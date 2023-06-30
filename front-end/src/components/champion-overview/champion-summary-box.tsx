import { useTheme } from '@emotion/react';
import { Theme } from '@mui/material';
import React from 'react';
import ImgBox from '../risen-box/img-box';

interface ChampionSummaryBoxProps {
    championId: number;
    games: number
}

export default function ChampionSummaryBox(championOverviewProps: ChampionSummaryBoxProps) {
  const theme = useTheme() as Theme;
  return (
    <ImgBox
      sx={{ height:55, width: 55 }}
      alt={`${championOverviewProps.championId}`}
      src={`/images/champions/icons/${championOverviewProps.championId}_0.png`}
      height="50px"
      width="50px"
      text={championOverviewProps.games.toString()}
    />
  );
}
