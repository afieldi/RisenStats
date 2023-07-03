import { Box } from '@mui/material';
import React from 'react';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import TeamModel from '../../../../Common/models/team.model';
import SideWinrateBox from './side-winrate-box';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import ChampionPickRate from './champion-pick-rate';

export interface LeaguePageGeneralStatsProps {
    games: PlayerGameModel[]
    teams: TeamModel[]
}

export default function LeaguePageGeneralStats(props: LeaguePageGeneralStatsProps)
{

  const champsPlayed: Map<GameRoles, Map<number, number>> = buildChamps(props.games);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
      <Box sx={{ maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <SideWinrateBox redWins={100} blueWins={10} hasData={true}></SideWinrateBox>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <ChampionPickRate champsPlayedByRole={champsPlayed}></ChampionPickRate>
      </Box>
    </Box>
  );
}

function buildChamps(games: PlayerGameModel[]): Map<GameRoles, Map<number, number>> {
  let champsCountByRole = new Map<GameRoles, Map<number, number>>();
  for (let value of Object.values(GameRoles)) {
    champsCountByRole.set(value, new Map());
  }

  for (let game of games) {
    let currentRole: Map<number, number> = champsCountByRole.get(game.lobbyPosition as GameRoles) as Map<number, number>;
    let currentCount = (currentRole.has(game.championId) ? currentRole.get(game.championId) : 0) as number;
    currentRole.set(game.championId, currentCount + 1);
  }
  
  return champsCountByRole;
}