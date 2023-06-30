import { useTheme } from '@emotion/react';
import { Box, SxProps, Theme } from '@mui/material';
import React from 'react';
import BaseRisenBox from '../risen-box/base-risen-box';
import ChampionSummaryBox from './champion-summary-box';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';



interface ChampionOverviewProps {
    playerStats: AggregatedPlayerStatModel[]
    sx?: SxProps<Theme>;
}

export default function ChampionOverview(championOverviewProps: ChampionOverviewProps) {
  const theme = useTheme() as Theme;

  championOverviewProps.playerStats.sort((a, b) => {return b.games - a.games;});

  return (
    <BaseRisenBox title="CHAMPIONS" sx={championOverviewProps.sx}>
      <Box sx={{ display: 'flex', columnGap: 1, rowGap: 1, flexWrap: 'wrap' }}>
        { championOverviewProps.playerStats.map((champData, index) =>
          <ChampionSummaryBox key={index} championId={champData.championId} games={champData.games}/>
        )}
      </Box>
    </BaseRisenBox>
  );
}
