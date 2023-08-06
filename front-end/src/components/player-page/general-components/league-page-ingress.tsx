import { Box, Button, Theme } from '@mui/material';
import React from 'react';
import SeasonModel from '../../../../../Common/models/season.model';
import { useNavigate } from 'react-router-dom';
import { getSeasonWithLeaguePage } from '../../../../../Common/utils';
import InsightsIcon from '@mui/icons-material/Insights';


interface LeaguePageIngress {
    seasons: SeasonModel[];
    selectSeasonId: string;
}

export default function LeaguePageIngress(props: LeaguePageIngress)
{
  const navigate = useNavigate();

  const season = getSeasonWithLeaguePage(props.seasons, props.selectSeasonId);

  if (!season) {
    return null;
  }

  return (
    <Button
      onClick={() => navigate(`/leagues/${season.searchname}`)}
      variant={'outlined'}
      color={'primary'}
      sx={{
        height: 60,
        cursor: 'pointer',
        justifyContent: 'space-between'
      }}>
      <Box sx={{ pr: 1 }}>View League Stats</Box>
      <InsightsIcon/>
    </Button>
  );
}