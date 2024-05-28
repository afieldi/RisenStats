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
import LeagueDragons from '../league-page/league-dragons';
import LeagueChampionWinrates from '../league-page/league-champ-winrates';
import PlayerTeamModel from '../../../../Common/models/playerteam.model';

interface TeamPageGeneralStatsProps {
    season: SeasonModel
    team: TeamModel;
    teamRoster: PlayerTeamModel[],
    teamGames: PlayerGameModel[]
}

export default function TeamPageGeneralStats(props: TeamPageGeneralStatsProps)
{

  const champsPlayed: Map<GameRoles, Map<number, number>> = buildChamps(props.teamGames);
  const winrate = calculateWinrateFromTeamGames(props.teamGames);

  return (
    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'row', columnGap: 3 }}>
      <Box sx={{ maxWidth: 280, height: '100%', display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <WinRateBox wins={winrate.wins} losses={winrate.losses} hasData={true}/>
        <BaseRisenBox sx={{ minWidth: 280, minHeight: 280, flexGrow: 1 }} title="Side Win Rate">TODO</BaseRisenBox>
        <RosterBox roster={props.teamRoster} teamGames={props.teamGames}/>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2, width: '100%' }}>
        <LeagueStats games={props.teamGames} uniqueChampions={buildUniqueChamps(champsPlayed)}/>
        <ChampionPickRate champsPlayedByRole={champsPlayed}></ChampionPickRate>
        <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
          <LeagueChampionWinrates games={props.teamGames}/>
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
function calculateWinrateFromTeamGames(games: PlayerGameModel[]): { wins: number, losses: number } {
  const gamesChecked = new Set<number>();
  let wins = 0;
  let losses = 0;

  for (const game of games) {
    if (gamesChecked.has(game.gameGameId)) {
      continue;
    }
    gamesChecked.add(game.gameGameId);
    game.win ? wins++ : losses++;
  }

  return { wins, losses };
}