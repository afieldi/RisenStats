import { Box, SelectChangeEvent, Theme, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import BaseRisenBox from '../risen-box/base-risen-box';
import ChampionSummaryBox from '../champion-overview/champion-summary-box';
import React, { useState } from 'react';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import RoleSelector from '../selectors/role-selector';
import { getGradient } from './general';

interface ChampionOverviewProps {
    champsPlayedByRole: Map<GameRoles, Map<number, number>>
}

export default function ChampionPickRate(props: ChampionOverviewProps) {
  const theme = useTheme() as Theme;

  const [selectedGameRoles, setSelectedGameRoles] = useState<GameRoles>(GameRoles.SUPPORT);

  let champsPlayed = getChampsPlayed(props.champsPlayedByRole, selectedGameRoles);
  champsPlayed = new Map([...champsPlayed.entries()].sort((a, b) => b[1] - a[1]));

  // TODO fix the gradiant so the numbers fit nicely
  return (
    <BaseRisenBox sx={{ background: getGradient(theme.palette.risenBoxBg.main) }} title={getTitleHeader(theme, champsPlayed.size, selectedGameRoles, setSelectedGameRoles)}>
      <Box sx={{ display: 'flex', columnGap: 1, rowGap: 1, flexWrap: 'wrap' }}>
        { Array.from(champsPlayed.keys()).map((championId,  index) =>
          <ChampionSummaryBox key={index} championId={championId} games={champsPlayed.get(championId) as number}/>
        )}
      </Box>
    </BaseRisenBox>
  );
}

function getTitleHeader(theme: Theme, unique: number, selectedGameRoles: GameRoles, setSelectedGameRoles: (value: (((prevState: GameRoles) => GameRoles) | GameRoles)) => void) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <Box>
        <Typography fontFamily="Montserrat" fontStyle="italic" variant='h5' align='left' color={theme.palette.info.main}>{`Champions Picked: ${unique}`}</Typography>
      </Box>
      <RoleSelector
        exclude={[GameRoles.ALL]}
        imageSize={30}
        sx={{ minWidth: '100px', pt: 1, pb: 0 }}
        initalValue={selectedGameRoles}
        callBack={(event: SelectChangeEvent) => {
          setSelectedGameRoles(GameRoles[event.target.value as keyof typeof GameRoles]);
        }}
      />
    </Box>
  );
}

function getChampsPlayed(champsPlayedByRole: Map<GameRoles, Map<number, number>>, selectedGameRole: GameRoles): Map<number, number> {

  if(selectedGameRole != GameRoles.ALL) {
    return champsPlayedByRole.get(selectedGameRole) as Map<number, number>;
  }

  // Currently this code wont be called every because we filter out ALL, but keeping it here incase we want to show ALL
  let mergedMap: Map<number, number> = new Map();
  Object.keys(GameRoles).forEach(role => {
    let currentRoles = champsPlayedByRole.get(role as GameRoles) as Map<number, number>;
    for(let champion of currentRoles.keys()) {
      let currentCount = (mergedMap.has(champion) ? mergedMap.get(champion) : 0) as number;
      mergedMap.set(champion, currentCount + ( currentRoles.get(champion) as number));
    }
  });
  return mergedMap;
}