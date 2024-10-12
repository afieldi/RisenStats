import { Box, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';

import Champs from '../../data/champions.json';
import ImgBox from '../risen-box/img-box';

interface Props {
  onClick: (championKey: string) => void;
}

const sortedChamps = Object.values(Champs.data).sort((a, b) => a.name.localeCompare(b.name));

export default function({ onClick }: Props) {
  const [champSearch, setChampSearch] = useState('');

  const filteredChamps = useMemo(() =>
    sortedChamps.filter(champ => champ.name.includes(champSearch)), [champSearch]);

  return (
    <Box sx={{ 
      flexGrow: 1,
    }}>
      <Box>
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