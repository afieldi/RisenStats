import { Box } from '@mui/material';
import React from 'react';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import TeamModel from '../../../../Common/models/team.model';
import SideWinrateBox from './side-winrate-box';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import ChampionPickRate from './champion-pick-rate';
import TeamListBox from './teams-list';
import { darken } from '@mui/system/colorManipulator';
import LeagueStats from './league-stats';
import LeagueDragons from './league-dragons';
import LeagueChampionWinrates from './league-champ-winrates';
import TeamLeaderboards from './team-leaderboards';

const gradientsEnabled = true;
export interface LeaguePageGeneralStatsProps {
    seasonId: number;
    games: PlayerGameModel[]
    teams: TeamModel[]
}

export default function LeaguePageGeneralStats(props: LeaguePageGeneralStatsProps)
{

  const champsPlayed: Map<GameRoles, Map<number, number>> = buildChamps(props.games);

  return (
    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'row', columnGap: 3 }}>
      <Box sx={{ maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <SideWinrateBox games={props.games}/>
        <TeamListBox seasonId={props.seasonId} teams={props.teams}/>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <LeagueStats games={props.games} uniqueChampions={buildUniqueChamps(champsPlayed)}/>
        <ChampionPickRate champsPlayedByRole={champsPlayed}/>
        <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
          <LeagueDragons games={props.games}/>
          <LeagueChampionWinrates games={props.games}/>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
          <TeamLeaderboards games={props.games} teams={props.teams}></TeamLeaderboards>
        </Box>
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

function buildUniqueChamps(champsPlayed: Map<GameRoles, Map<number, number>>) {
  let mergedMap = new Map();
  for (let key of champsPlayed.keys()) {
    mergedMap = new Map([...Array.from(mergedMap.entries()), ...Array.from((champsPlayed.get(key) as Map<number, number>).entries())]);
  }
  return mergedMap.size;
}

// The gradient function used for boxes on this page
export function getGradient(background: string) {
  if (gradientsEnabled) {
    return `linear-gradient(to right, ${background} 0%, ${darken(background, 0.4)} 100%)`;
  }
  return `linear-gradient(to right, ${background} 100%, ${background} 100%)`;
}