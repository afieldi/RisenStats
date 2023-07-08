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
import LeaguePings from './league-pings';
import LeagueLeaderboard from './league-leaderboard';

const gradientsEnabled = true;
export interface LeaguePageGeneralStatsProps {
    seasonId: number;
    games: PlayerGameModel[]
    teams: TeamModel[]
}

export default function LeaguePageGeneralStats(props: LeaguePageGeneralStatsProps)
{

  const champsPlayed: Map<GameRoles, Map<number, number>> = buildChamps(props.games);
  const leagueStats = buildLeagueStats(props.games);
  const sideWinrate = buildWinrate(props.games);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
      <Box sx={{ maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <SideWinrateBox redWins={sideWinrate.redWin} blueWins={sideWinrate.blueWin} hasData={true}></SideWinrateBox>
        <TeamListBox seasonId={props.seasonId} teams={props.teams}></TeamListBox>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <LeagueStats kills={leagueStats.kills}
          uniqueChampions={buildUniqueChamps(champsPlayed)}
          totalDurationRiotTimestamp={leagueStats.totalDuration}
          totalGames={leagueStats.totalGames}/>
        <ChampionPickRate champsPlayedByRole={champsPlayed}></ChampionPickRate>
        <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
          {/*<LeaguePings games={props.games}/>*/}
          <LeagueLeaderboard teams={props.teams} games={props.games}></LeagueLeaderboard>
        </Box>
      </Box>
    </Box>
  );
}

function buildWinrate(games: PlayerGameModel[]) {
  let gamesChecked: Set<number> = new Set<number>();
  let blueWin = 0;
  let redWin = 0;
  for(let game of games) {
    if (gamesChecked.has(game.gameGameId)) {
      continue;
    }

    // Only add the game if we found the winning game
    if (game.win) {
      blueWin += game.teamId == 200 ? 1 : 0;
      redWin += game.teamId == 100 ? 1 : 0;
      gamesChecked.add(game.gameGameId);
    }
  }
  return { blueWin, redWin };
}

function buildLeagueStats(games: PlayerGameModel[]) {
  let gamesChecked: Set<number> = new Set<number>();
  let kills = 0;
  let deaths = 0;
  let totalGames = 0;
  let totalDuration = 0;

  for(let game of games) {
    // Only add these stats once per a given match
    if (!gamesChecked.has(game.gameGameId)) {
      totalDuration += game.gameLength;
      totalGames +=1;
    }
    kills += game.kills;
    deaths += game.deaths;


    gamesChecked.add(game.gameGameId);
  }
  return { kills, deaths, totalGames, totalDuration };
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