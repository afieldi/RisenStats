import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DraftState } from '../../../../Common/Interface/Internal/drafting';
import ChampionPicker from '../../components/drafting/champion-picker';
import DraftSubmitButton from '../../components/drafting/draft-submit-button';
import TeamChampionBans from '../../components/drafting/team-champion-bans';
import TeamChampionPicks from '../../components/drafting/team-champion-picks';
import socket from '../../draftSocket';


export default function() {
  const theme = useTheme();
  const { room, auth } = useParams();
  const [draftState, setDraftState] = useState<DraftState>();

  useEffect(() => {
    console.log('effect', socket.connected);
    if (socket.connected) {
      socket.emit('register', room as string);
    }
    else {
      socket.on('connect', () => {
        console.log('connected to backend');
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
    console.log('Champion clicked: ', champion);
    socket.emit('hover', room as string, auth as string, champion, draftState?.stage ?? 0);
  };

  const onPickSubmit = () => {
    console.log('Pick Submitted', draftState);
    socket.emit('pick', room as string, auth as string);
  };

  console.log('draftState', draftState);
  return (
    <Box sx={{ minHeight: '100vh', maxWidth: '95%', margin: 'auto', color: theme.palette.text.primary, pt: 10 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', }}>
        <TeamChampionPicks champions={draftState?.blueTeam.picks ?? []} />
        <ChampionPicker onClick={onChampClick} draftState={draftState} />
        <TeamChampionPicks champions={draftState?.redTeam.picks ?? []} reverse />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', }}>
        <TeamChampionBans champions={draftState?.blueTeam.bans ?? []} />
        <Box sx={{ flexGrow: 1 }}>
          <DraftSubmitButton
            auth={auth}
            draftState={draftState}
            socket={socket}
            room={room as string}
            onSubmit={onPickSubmit}
          />
        </Box>
        <TeamChampionBans champions={draftState?.redTeam.bans ?? []} reverse />
      </Box>
    </Box>
  );
}