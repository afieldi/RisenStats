import { Box, Button, Collapse, SelectChangeEvent, TextField, Theme, Typography, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import { DraftState } from '../../../../Common/Interface/Internal/drafting';
import { getTeamFromDraftState } from '../../../../Common/utils';

import Champs from '../../data/champions.json';
import RoleMap from '../../data/role_map.json';
import ImgBox from '../risen-box/img-box';
import RoleSelector from '../selectors/role-selector';

interface Props {
  onClick: (championKey: string) => void;
  auth?: string;
  draftState?: DraftState;
}

const sortedChamps = Object.values(Champs.data).sort((a, b) => a.name.localeCompare(b.name));

const NameBar = ({ name, color, redSide, active }: {name?: string, color: string, redSide?: boolean, active?: boolean}) => (
  <Box sx={{
    display: 'flex',
    width: '100%',
    flexDirection: redSide ? 'row-reverse' : 'row',
    alignItems: 'right',
  }}>
    <Box sx={{
      width: active ? '100%' : '40%',
      transition: 'width 1000ms',
      padding: '10px 30px',
      backgroundColor: color,
      textAlign: redSide ? 'end' : 'start',
    }}>
      <Typography display='inline' fontFamily='Montserrat' fontSize={24} textAlign={redSide ? 'right' : 'left'}>{name}</Typography>
    </Box>
  </Box>
);

export default function({ onClick, draftState, auth }: Props) {
  const [champSearch, setChampSearch] = useState('');
  const [roleId, setRoleId] = useState(GameRoles.ALL);
  const [blueReady, setBlueReady] = useState(false);
  const [redReady, setRedReady] = useState(false);
  const theme = useTheme();

  const filteredChamps = useMemo(() => {
    const filtered = sortedChamps.filter(champ => champ.name.includes(champSearch));
    if (roleId !== GameRoles.ALL) {
      return filtered.filter(champ => RoleMap[champ.key as keyof typeof RoleMap].includes(roleId));
    }
    return filtered;
  }, [champSearch, roleId]);

  const clearFilter = () => {
    setChampSearch('');
    setRoleId(GameRoles.ALL);
  };

  const unavailableChamps: Set<string> = useMemo(() => {
    if (!draftState) return new Set();
    const team = getTeamFromDraftState(draftState, auth ?? '');
    const champs = [
      ...draftState.blueTeam.picks,
      ...draftState.blueTeam.bans,
      ...draftState.redTeam.picks,
      ...draftState.redTeam.bans,
    ];
    if (team === 'redTeam') {
      champs.push(...draftState.redTeam.disabledPicks);
    }
    else if (team === 'blueTeam') {
      champs.push(...draftState.blueTeam.disabledPicks);
    }
    return new Set(champs);
  }, [draftState, auth]);

  useEffect(() => {
    if (!draftState) return;

    if (!draftState.roomActive) {
      if (draftState.stage > 0) {
        setBlueReady(false);
        setRedReady(false);
      }
      else {
        setBlueReady(draftState.blueTeam.ready);
        setRedReady(draftState.redTeam.ready);
      }
    }
    else {
      setBlueReady(getTeamFromDraftState(draftState, auth ?? '') === 'blueTeam');
      setRedReady(getTeamFromDraftState(draftState, auth ?? '') === 'redTeam');
    }
  }, [draftState]);

  return (
    <Box sx={{ 
      flexGrow: 1,
      pr: 2,
      pl: 2,
    }}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '45% 10% 45%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        pb: 2,
      }}>
        <NameBar name={draftState?.blueTeam.displayName} color={theme.palette.secondary.main} active={blueReady} />
        <Box>
          <Typography fontFamily='Montserrat' fontSize={32}>{Math.max(draftState?.timerRemaining ?? 0, 0)}</Typography>
        </Box>
        <NameBar name={draftState?.redTeam.displayName} color={theme.palette.primary.main} redSide active={redReady} />
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <RoleSelector
          imageSize={45}
          initalValue={roleId}
          sx={{ pt: 1, pb: 1, display: 'block' }}
          callBack={(event: SelectChangeEvent) => { 
            let newRole = GameRoles[event.target.value as keyof typeof GameRoles];
            if (newRole === roleId) {
              newRole = GameRoles.ALL;
            }
            setRoleId(newRole);
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button sx={{ margin: 'auto' }} variant='outlined' onClick={clearFilter}>
            Reset Filter
          </Button>
          <TextField value={champSearch} onChange={(event) => setChampSearch(event.target.value)} />
        </Box>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'baseline',
        justifyContent: 'center',
        overflow: 'scroll',
        maxHeight: '670px',
      }}>
        {
          filteredChamps.map(champion => (
            <ImgBox
              sx={{
                height:80,
                width: 80,
                filter: unavailableChamps.has(champion.key) ? 'grayscale(1)' : '',
              }}
              alt={`${champion.id}`}
              src={`/images/champions/icons/${champion.key}_0.png`}
              height="75px"
              width="75px"
              onClick={() => {
                if (!unavailableChamps.has(champion.key)) {
                  onClick(champion.key);
                }
              }}
            />
          ))
        }
      </Box>
    </Box>
  );
}