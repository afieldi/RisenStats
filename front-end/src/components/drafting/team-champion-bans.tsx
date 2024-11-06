import { Box, Typography } from '@mui/material';
import React from 'react';
import { draftStepConfig } from '../../../../Common/constants';
import { getChampionNameFromId } from '../../common/utils';

interface Props {
  champions: string[];
  stage: number;
  reverse?: boolean;
  ready: boolean
}

export default function({ champions, stage, reverse, ready }: Props) {
  const [team, step, index] = draftStepConfig[stage] ?? ['blueTeam', -1, -1];

  let addBorder = false;
  if (ready && ((team === 'blueTeam' && !reverse) || (team === 'redTeam' && reverse))) {
    addBorder = true;
  }
  console.log({ champions });
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: reverse? 'row-reverse' : 'row',
      columnGap: '10px',
      height: '182px',
    }}>
      {
        champions.map((champion, champIndex) => (
          <>
            <Box
              className={(addBorder && step === 'bans' && index === champIndex) ? 'outlined-box' : 'waiting-box'}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px',
                aspectRatio: '0.55',
                padding: '0 10px',
              }}
            >
              <img
                src={champion && champion !== '0' ? `/images/champions/profile/${champion}_0.jpg` : '/risen512.png'}
                style={{
                  position: 'absolute',
                  width: champion && champion !== '0' ? '100%' : '80%',
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
            {
              champIndex === 2 && (
                <Box sx={{ width: '30px' }} />
              )
            }
          </>
        ))
      }
    </Box>
  );
}