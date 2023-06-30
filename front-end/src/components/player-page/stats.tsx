import React from 'react';
import { Box, Typography, } from '@mui/material';
import PerformanceOverview from './stats/performance-overview';
import SeasonModel from '../../../../Common/models/season.model';
import ChampionOverview from '../champion-overview/champion-overview';
import WinRateBox from '../charts/win-rate-box';
import BaseRisenBox from '../risen-box/base-risen-box';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import FilterBar from '../filters/filter-bar';
import ObjectiveOverview from './stats/objective-overview';
import GameRatingOverview from './stats/game-rating-overview';
import PingOverview from './stats/ping-overview';
import { deepCopy, doesPlayerStatsObjectHaveData, mergePlayerStats } from '../../../../Common/utils';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

interface PlayerPageStatsProps {
    seasonConfig: {
        seasonId: string,
        setSeasonId: (seasonId: string) => void,
        seasons: SeasonModel[],
    };
    roleConfig?: {
        roleId: GameRoles,
        setRoleId: (roleId: GameRoles) => void,
    };
    playerStats: AggregatedPlayerStatModel[]
    leaderboardData?: AggregatedPlayerStatModel[]
    playerPuuid?: string
}

const byRole = (seasonId: string, roleId: GameRoles, teamId: number, championId: number) => {
  return `${seasonId}-${roleId}-${championId}`;
};

export default function PlayerPageStats(props: PlayerPageStatsProps) {
  const {
    seasonConfig,
    roleConfig,
    playerStats,
    playerPuuid,
    leaderboardData,
  } = props;

  // This page does not care about a per champion breakdown right now, so merge the data so its by role.
  // This page also doesnt care about a per team breakdown right now, so merge the team data away
  let playerStatsByRole = deepCopy(props.playerStats); // DeepCopy is needed for some react state BS
  if (roleConfig) {
    playerStatsByRole = mergePlayerStats(seasonConfig.seasonId, roleConfig.roleId, deepCopy(playerStats), byRole);
  }

  let wins = 0;
  let games = 0;
  for (let playerStat of playerStatsByRole) {
    wins += playerStat.win;
    games += playerStat.games;
  }

  return (
    <Box>
      <FilterBar seasonConfig={seasonConfig} roleConfig={roleConfig}/>
      <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 3 }}>
        <Box sx={{ maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2 }}>
          <WinRateBox hasData={doesPlayerStatsObjectHaveData(playerStatsByRole)} wins={wins} losses={games-wins}/>
          <ChampionOverview playerStats={playerStats}/>
          <ObjectiveOverview playerStats={playerStatsByRole}/>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
          <PerformanceOverview    playerStats={playerStatsByRole}
            playerPuuid={playerPuuid}
            leaderboardStats={leaderboardData ?? []}
          />
          <Box sx={{ minHeight: 350, display: 'flex', flexDirection: 'row', columnGap: 2 }}>
            <GameRatingOverview playerStats={playerStatsByRole}
              roleId={!!roleConfig?.roleId ? roleConfig.roleId : GameRoles.ALL}/>
            <PingOverview playerStats={playerStatsByRole}/>
            <BaseRisenBox hideDivider>
              <Typography variant="subtitle1">THIS SECTION IS COMING SOON</Typography>
              <Typography variant="subtitle1">DM soulbert#7829 with bugs/suggestions</Typography>
            </BaseRisenBox>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
