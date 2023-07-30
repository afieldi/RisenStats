import React from 'react';
import { Box, Hidden, styled, useTheme, useMediaQuery } from '@mui/material';
import GameSummaryList from './game-summary/game-summary-list';
import RankFlag from './general-components/rank-flag';
import { PlayerDetailedGame } from '../../../../Common/Interface/Internal/player';
import PlayerModel from '../../../../Common/models/player.model';

import SeasonModel from '../../../../Common/models/season.model';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import ChampionOverview from '../champion-overview/champion-overview';
import WinRateBox from '../charts/win-rate-box';
import FilterBar from '../filters/filter-bar';
import RecentPlayers from '../recent-players/recentPlayers';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

interface Props {
  games: PlayerDetailedGame[],
  player?: PlayerModel,
  seasons: SeasonModel[],
  playerStats: AggregatedPlayerStatModel[],
  loadGamesConfig: {
    callback: (newPlayer: boolean) => void,
    status: boolean,
    seasonConfig: {
      setSeasonId: (seasonId: string) => void,
      seasonId: string,
    },
    roleConfig: {
      setRoleId: (roleId: GameRoles) => void,
      roleId: GameRoles,
    }
  };
}

const StyledFlexBox = styled(Box)(({ theme }) => ({
  'flex-wrap': 'wrap',
  'column-gap': '16px',
  'justify-content': 'space-between',
  'display': 'flex',
  'row-gap': '16px',
  'align-content': 'flex-start',
}));

function PlayerPageGeneral({ games, loadGamesConfig, player, seasons, playerStats }: Props)
{
  games = games ?? [];
  const results = { wins: 0, losses: 0 };
  games.map(cur => results[cur.playerGame.win ? 'wins' : 'losses'] += 1);
  const theme = useTheme();
  return (
    <Box>
      <FilterBar
        seasonConfig={{ ...loadGamesConfig.seasonConfig, seasons: seasons.filter(season => season.active) }}
        roleConfig={loadGamesConfig.roleConfig} />
      <Box sx={{ display: 'flex', flexWrap: useMediaQuery(theme.breakpoints.up('sm')) ? 'nowrap' : 'wrap' }}>
        <StyledFlexBox>
          <RankFlag sx={{ minWidth: '170px', flexGrow: 1 }} player={player}></RankFlag>
          <WinRateBox hasData={results.wins > 0 || results.losses > 0} {...results} />
          <ChampionOverview playerStats={playerStats}  sx={{ width: '100%' }}/>
          {/* <PlayedSeasons playerPuuid={player?.puuid} setSeason={loadGamesConfig.seasonConfig.setSeasonId} allSeasons={seasons} /> */}
          <Hidden smDown>
            <RecentPlayers sx={{ width: '100%' }} recentGames={games} />
          </Hidden>
        </StyledFlexBox>
        <GameSummaryList gameList={games} loadGamesConfig={loadGamesConfig} seasons={seasons} sx={{ minWidth: useMediaQuery(theme.breakpoints.up('sm')) ? '585px' : '371px' }}></GameSummaryList>
      </Box>
    </Box>
  );
}

export default PlayerPageGeneral;