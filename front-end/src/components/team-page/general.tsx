import { Box } from '@mui/material';
import React from 'react';
import BaseRisenBox from '../risen-box/base-risen-box';
import WinRateBox from '../charts/win-rate-box';
import RosterBox from './roster-box';
import ChampionPickRate from '../league-page/champion-pick-rate';
import LeagueStats from '../league-page/league-stats';
import TeamModel from '../../../../Common/models/team.model';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import SeasonModel from '../../../../Common/models/season.model';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import LeagueChampionWinrates from '../league-page/league-champ-winrates';
import PlayerTeamModel from '../../../../Common/models/playerteam.model';
import StatsVsRestOfLeague from './stats-vs-rest-of-league';
import SideWinRateBox from '../charts/side-win-rate-box';
import { BLUE_TEAM_ID, RED_TEAM_ID } from '../../common/constants';

interface TeamPageGeneralStatsProps {
    season: SeasonModel
    team: TeamModel;
    teamRoster: PlayerTeamModel[],
    teamGames: PlayerGameModel[]
    leagueTeams: Map<number, TeamModel>;
    leagueGames: PlayerGameModel[]
}

export default function TeamPageGeneralStats(props: TeamPageGeneralStatsProps)
{

  const champsPlayed: Map<GameRoles, Map<number, number>> = buildChamps(props.teamGames);
  const winrate = calculateWinrateFromTeamGames(props.teamGames);

  return (
    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'row', columnGap: 3 }}>
      <Box sx={{ maxWidth: 280, height: '100%', display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <WinRateBox wins={winrate.blueWins + winrate.redWins} losses={winrate.blueLosses + winrate.redLosses} hasData={true}/>
        <SideWinRateBox blueWins={winrate.blueWins} blueLosses={winrate.blueLosses} redWins={winrate.redLosses} redLosses={winrate.redLosses} hasData={true}/>
        <RosterBox roster={props.teamRoster} teamGames={props.teamGames}/>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2, width: '100%' }}>
        <LeagueStats games={props.teamGames} uniqueChampions={buildUniqueChamps(champsPlayed)}/>
        <ChampionPickRate champsPlayedByRole={champsPlayed}></ChampionPickRate>
        <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
          <StatsVsRestOfLeague leagueGames={props.leagueGames}
            leagueTeams={props.leagueTeams}
            primaryTeam={props.team}></StatsVsRestOfLeague>
          <LeagueChampionWinrates games={props.teamGames} minGames={Math.min(calcMinChampsForWinrateLeaderboard(champsPlayed), 4)}/>
        </Box>
      </Box>
    </Box>
  );
}

// TODO this code is duplicated from league-page/general, UNDUPE IT
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

// TODO this code is duplicated from league-page/general, UNDUPE IT

function buildUniqueChamps(champsPlayed: Map<GameRoles, Map<number, number>>) {
  let mergedMap = new Map();
  for (let key of champsPlayed.keys()) {
    mergedMap = new Map([...Array.from(mergedMap.entries()), ...Array.from((champsPlayed.get(key) as Map<number, number>).entries())]);
  }
  return mergedMap.size;
}
function calculateWinrateFromTeamGames(games: PlayerGameModel[]): { redWins: number, redLosses: number, blueWins: number, blueLosses: number } {
  const gamesChecked = new Set<number>();
  let blueWins = 0;
  let blueLosses = 0;

  let redWins = 0;
  let redLosses = 0;


  for (const game of games) {
    if (gamesChecked.has(game.gameGameId)) {
      continue;
    }
    gamesChecked.add(game.gameGameId);

    if (game.teamId === BLUE_TEAM_ID) {
      game.win ? blueWins++ : blueLosses++;
    }

    if (game.teamId === RED_TEAM_ID) {
      game.win ? redWins++ : redLosses++;
    }
  }

  return { redWins, redLosses, blueWins, blueLosses };
}

function calcMinChampsForWinrateLeaderboard(champsPlayed: Map<GameRoles, Map<number, number>>) {
  let allRoles = champsPlayed.get(GameRoles.ALL) as Map<number, number>;
  let sum = 0;
  for (const value of allRoles.values()) {
    sum += value;
  }

  return  allRoles.size > 0 ? sum / allRoles.size : 0;
}