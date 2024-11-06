import { Box, Typography } from '@mui/material';
import React from 'react';
import { draftStepConfig } from '../../../../Common/constants';
import { getChampionNameFromId } from '../../common/utils';

interface Props {
  champions: string[];
  stage: number;
  reverse?: boolean;
}

export default function({ champions, reverse, stage }: Props) {
  const [team, step, index] = draftStepConfig[stage] ?? ['blueTeam', -1, -1];
  let addBorder = false;
  if ((team === 'blueTeam' && !reverse) || (team === 'redTeam' && reverse)) {
    addBorder = true;
  }
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      rowGap: '10px',
      width: '250px',
      minWidth: '250px',
    }}>
      {
        champions.map((champion, champIndex) => {
          return (
            <Box
              className={(addBorder && step === 'picks' && index === champIndex) ? 'outlined-box' : 'waiting-box'}
              sx={{
                position: 'relative',
                display: 'flex',
                backgroundSize: 'cover',
                aspectRatio: '1.69',
                padding: '0 10px',
                justifyContent: 'center',
              }}
            >
              <img
                src={champion && champion !== '0' ? `/images/champions/splash/${champion}_0.jpg` : '/risen512.png'}
                style={{
                  position: 'absolute',
                  height: '100%',
                  margin: 'auto',
                }}
              />
              <Box sx={{
                display: 'flex',
                flexDirection: reverse ? 'row-reverse' : 'row',
                marginTop: 'auto',
                width: '100%'
              }}>
                <Typography>{getChampionNameFromId(champion)}</Typography>
              </Box>
            </Box>
          );
        })
      }
    </Box>
  );
}