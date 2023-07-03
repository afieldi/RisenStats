import { Box, SelectChangeEvent, Theme } from '@mui/material';
import { useTheme } from '@emotion/react';
import BaseRisenBox from '../risen-box/base-risen-box';
import ChampionSummaryBox from '../champion-overview/champion-summary-box';
import React, { useState } from 'react';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import RoleSelector from '../selectors/role-selector';

interface ChampionOverviewProps {
    champsPlayedByRole: Map<GameRoles, Map<number, number>>
}

export default function ChampionPickRate(props: ChampionOverviewProps) {
  const theme = useTheme() as Theme;

  const [selectedGameRoles, setSelectedGameRoles] = useState<GameRoles>(GameRoles.ALL);


  let champsPlayed = getChampsPlayed(props.champsPlayedByRole, selectedGameRoles);
  champsPlayed = new Map([...champsPlayed.entries()].sort((a, b) => b[1] - a[1]));

  // TODO add a total unique per role

  return (
    <BaseRisenBox title={'CHAMPIONS PICKED'}>
      <RoleSelector
        sx={{ minWidth: '150px', pt: 1, pb: 1 }}
        initalValue={selectedGameRoles}
        callBack={(event: SelectChangeEvent) => { setSelectedGameRoles(GameRoles[event.target.value as keyof typeof GameRoles]); }}
      />
      <Box sx={{ display: 'flex', columnGap: 1, rowGap: 1, flexWrap: 'wrap' }}>
        { Array.from(champsPlayed.keys()).map((championId,  index) =>
          <ChampionSummaryBox key={index} championId={championId} games={champsPlayed.get(championId) as number}/>
        )}
      </Box>
    </BaseRisenBox>
  );
}

function getChampsPlayed(champsPlayedByRole: Map<GameRoles, Map<number, number>>, selectedGameRole: GameRoles): Map<number, number> {
  // TODO maybe remove fill since its massive

  if(selectedGameRole != GameRoles.ALL) {
    return champsPlayedByRole.get(selectedGameRole) as Map<number, number>;
  }

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