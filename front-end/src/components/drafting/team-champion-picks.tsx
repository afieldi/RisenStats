import { Box, Typography } from '@mui/material';
import React from 'react';
import { DRAFT_STAGE, DRAFT_TEAM, draftStepConfig } from '../../../../Common/constants';
import { getChampionNameFromId } from '../../common/utils';

interface Props {
  champions: string[];
  stage: number;
  active: boolean;
  reverse?: boolean;
}

export default function({ active, champions, reverse, stage }: Props) {
  const [team, step, index] = draftStepConfig[stage] ?? [DRAFT_TEAM.blueTeam, -1, -1];
  let addBorder = false;
  if ((team === DRAFT_TEAM.blueTeam && !reverse) || (team === DRAFT_TEAM.redTeam && reverse)) {
    addBorder = active && true;
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
              className={(addBorder && step === DRAFT_STAGE.picks && index === champIndex) ? 'outlined-box' : 'waiting-box'}
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
                width: '100%',
                zIndex: 1,
              }}>
                <Typography fontFamily='Montserrat'>{getChampionNameFromId(champion)}</Typography>
              </Box>
            </Box>
          );
        })
      }
    </Box>
  );
}