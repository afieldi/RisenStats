import { Box, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import { DraftState } from '../../../../Common/Interface/Internal/drafting';

import Champs from '../../data/champions.json';
import ImgBox from '../risen-box/img-box';
import RoleSelector from '../selectors/role-selector';

interface Props {
  onClick: (championKey: string) => void;
  draftState?: DraftState;
}

const sortedChamps = Object.values(Champs.data).sort((a, b) => a.name.localeCompare(b.name));

export default function({ onClick, draftState }: Props) {
  const [champSearch, setChampSearch] = useState('');
  const [roleId, setRoleId] = useState(GameRoles.ALL);

  const filteredChamps = useMemo(() =>
    sortedChamps.filter(champ => champ.name.includes(champSearch)), [champSearch]);

  const NameBar = ({ name, color }: {name?: string, color: string}) => (
    <Box sx={{
      width: '40%',
      padding: '10px 30px',
      margin: '0px 5%',
      backgroundColor: color,
    }}>
      <Typography textAlign={color === 'blue' ? 'left' : 'right'}>{name}</Typography>
    </Box>
  );

  return (
    <Box sx={{ 
      flexGrow: 1,
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        pb: 2,
      }}>
        <NameBar name={draftState?.blueTeam.displayName} color={'blue'} />
        <Box>
          <Typography>{draftState?.timerRemaining}</Typography>
        </Box>
        <NameBar name={draftState?.redTeam.displayName} color={'red'} />
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
            setRoleId(GameRoles[event.target.value as keyof typeof GameRoles]);
          }}
        />
        <TextField onChange={(event) => setChampSearch(event.target.value)} />
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'baseline',
        justifyContent: 'center',
        overflow: 'scroll',
      }}>
        {
          filteredChamps.map(champion => (
            <ImgBox
              sx={{ height:80, width: 80 }}
              alt={`${champion.id}`}
              src={`/images/champions/icons/${champion.key}_0.png`}
              height="75px"
              width="75px"
              onClick={() => onClick(champion.key)}
              // text={championOverviewProps.games.toString()}
            />
          ))
        }
      </Box>
    </Box>
  );
}