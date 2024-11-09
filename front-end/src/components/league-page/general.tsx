import { Box } from '@mui/material';
import React from 'react';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import GameModel from '../../../../Common/models/game.model';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import SeasonModel from '../../../../Common/models/season.model';
import TeamModel from '../../../../Common/models/team.model';
import ChampionPickRate from './champion-pick-rate';
import LeagueChampionWinrates from './league-champ-winrates';
import LeagueDragons from './league-dragons';
import LeagueStats from './league-stats';
import RecentGames from './recent-games';
import { StockTimelineEntry } from '../../../../Common/Interface/Internal/stocks';
import StockTimelineChart from '../charts/stock-timeline-chart';
import SideWinrateBox from './side-winrate-box';
import TeamListBox from './teams-list';
import TeamLeaderboards from './team-leaderboards';
import RisenStocks from './risen-stocks';

export interface LeaguePageGeneralStatsProps {
    season: SeasonModel;
    playerGames: PlayerGameModel[]
    recentGames: GameModel[]
    teams: Map<number, TeamModel>
    stockTimeline: Map<number, StockTimelineEntry[]>
}

export default function LeaguePageGeneralStats(props: LeaguePageGeneralStatsProps)
{

  const champsPlayed: Map<GameRoles, Map<number, number>> = buildChamps(props.playerGames);

  return (
    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'row', columnGap: 3 }}>
      <Box sx={{ maxWidth: 280, height: '100%', display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <SideWinrateBox games={props.playerGames}/>
        <TeamListBox teams={Array.from(props.teams.values())}/>
        <RecentGames teams={props.teams} games={props.recentGames}/>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <LeagueStats games={props.playerGames} uniqueChampions={buildUniqueChamps(champsPlayed)}/>
        <ChampionPickRate champsPlayedByRole={champsPlayed}/>
        <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
          <LeagueDragons games={props.playerGames}/>
          <LeagueChampionWinrates games={props.playerGames} minGames={4}/>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
          <TeamLeaderboards games={props.playerGames} teams={props.teams}></TeamLeaderboards>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
          <RisenStocks stockTimeline={props.stockTimeline} teams={props.teams}/>
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
