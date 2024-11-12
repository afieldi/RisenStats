import { Box, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { DRAFT_SOCKET_PATH } from '../../../../Common/constants';
import {
  DraftingSocketClientToServer,
  DraftingSocketServerToClient,
  DraftState
} from '../../../../Common/Interface/Internal/drafting';
import ChampionPicker from '../../components/drafting/champion-picker';
import DraftSubmitButton from '../../components/drafting/draft-submit-button';
import TeamChampionBans from '../../components/drafting/team-champion-bans';
import TeamChampionPicks from '../../components/drafting/team-champion-picks';

export default function() {
  const theme = useTheme();
  const socket: Socket<
    DraftingSocketServerToClient,
    DraftingSocketClientToServer
  > = useMemo(() => (
    io(process.env.REACT_APP_BACKEND_URL, {
      path: DRAFT_SOCKET_PATH,
    })
  ), []);
  const { room, auth } = useParams();
  const [draftState, setDraftState] = useState<DraftState>();

  useEffect(() => {
    if (socket.connected) {
      socket.emit('register', room as string);
    }
    else {
      socket.on('connect', () => {
        socket.emit('register', room as string);
      });
    }

    socket.on('draftUpdate', (data) => {
      console.log('gotDraftUpdate');
      setDraftState(data);
    });
    return () => {
      if (socket.connected) { // <-- This is important
        socket.close();
      }
    };
  }, []);

  const onChampClick = (champion: string) => {
    socket.emit('hover', room as string, auth as string, champion, draftState?.stage ?? 0);
  };

  const onPickSubmit = () => {
    socket.emit('pick', room as string, auth as string);
  };

  return (
    <Box sx={{ minHeight: '100vh', maxWidth: '95%', margin: 'auto', color: theme.palette.text.primary, pt: 10 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', pb: 3 }}>
        <TeamChampionPicks
          champions={draftState?.blueTeam.picks ?? []}
          stage={draftState?.stage ?? 0}
          active={!!draftState?.roomActive}
        />
        <ChampionPicker onClick={onChampClick} draftState={draftState} auth={auth} />
        <TeamChampionPicks
          champions={draftState?.redTeam.picks ?? []}
          stage={draftState?.stage ?? 0}
          active={!!draftState?.roomActive}
          reverse
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', }}>
        <TeamChampionBans
          champions={draftState?.blueTeam.bans ?? []}
          stage={draftState?.stage ?? 0}
          ready={!!draftState?.roomActive}
        />
        <Box sx={{ flexGrow: 1 }}>
          <DraftSubmitButton
            auth={auth}
            draftState={draftState}
            socket={socket}
            room={room as string}
            onSubmit={onPickSubmit}
          />
        </Box>
        <TeamChampionBans
          champions={draftState?.redTeam.bans ?? []}
          stage={draftState?.stage ?? 0}
          ready={!!draftState?.roomActive}
          reverse
        />
      </Box>
    </Box>
  );
}