import React, { useEffect, useState } from 'react';
import { Container, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import FilterBar from '../../components/filters/filter-bar';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import PlayerTierTable from '../../components/tables/player-tier';
import { GetActiveSeasons } from '../../api/season';
import SeasonModel from '../../../../Common/models/season.model';

export default function Leaderboards() {
  const theme = useTheme();
  const [seasonId, setSeasonId] = useState<string>("RISEN");
  const [seasons, setSeasons] = useState<SeasonModel[]>([]);
  const [roleId, setRoleId] = useState<GameRoles>(GameRoles.ALL);
  useEffect(() => {
    GetActiveSeasons().then(activeSeasons => {
      setSeasons(activeSeasons.seasons);
    });
  }, []);
  return (
    <Container maxWidth='lg' sx={{pt: 10, minHeight: '100vh', color: theme.palette.info.light}}>
      <Box>
        <Typography variant="h1" color={theme.palette.info.light}>
          Top Players
        </Typography>
      </Box>
      <hr />
      <FilterBar
        hideAllGames={true}
        seasonConfig={{seasonId, setSeasonId, seasons}}
        roleConfig={{roleId, setRoleId}} />
      <PlayerTierTable
        seasonId={seasonId}
        roleId={roleId} />
    </Container>
  )
}