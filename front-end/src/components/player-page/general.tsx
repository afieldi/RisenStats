import React from "react";
import { Container, Grid, Box, Hidden, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, styled } from "@mui/material";
import GameSummaryList from "./game-summary/game-summary-list";
import RankFlag from "./general-components/rank-flag";
import { PlayerDetailedGame } from "../../../../Common/Interface/Internal/player";
import PlayerModel from "../../../../Common/models/player.model";

import SeasonModel from "../../../../Common/models/season.model";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";
import PlayerChampionStatsModel from "../../../../Common/models/playerchampionstats.model";
import ChampionOverview from "../champion-overview/champion-overview";
import WinRateBox from "../charts/win-rate-box";
import PlayerStatModel from "../../../../Common/models/playerstat.model";
import FilterBar from "../filters/filter-bar";
import PlayedSeasons from "../played-seasons/playedSeasons";
import RecentPlayers from "../recent-players/recentPlayers";

interface Props {
  games: PlayerDetailedGame[],
  player?: PlayerModel,
  seasons: SeasonModel[],
  playerStats: PlayerStatModel[],
  championData: PlayerChampionStatsModel[],
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

function PlayerPageGeneral({games, loadGamesConfig, player, seasons, championData, playerStats}: Props)
{
  games = games ?? [];
  const results = {wins: 0, losses: 0};
  playerStats.map(cur => results[cur.win ? 'wins' : 'losses'] += 1, );
  return (
    <Box>
      <FilterBar
        seasonConfig={{...loadGamesConfig.seasonConfig, seasons: seasons.filter(season => season.active)}}
        roleConfig={loadGamesConfig.roleConfig} />
      <Box sx={{display: 'flex'}}>
          <StyledFlexBox>
            <RankFlag sx={{ minWidth: '170px', flexGrow: 1}} player={player}></RankFlag>
            <WinRateBox hasData={results.wins > 0 || results.losses > 0} {...results} />
            <ChampionOverview championData={championData}  sx={{width: '100%'}}/>
            {/* <PlayedSeasons playerPuuid={player?.puuid} setSeason={loadGamesConfig.seasonConfig.setSeasonId} allSeasons={seasons} /> */}
            <RecentPlayers recentGames={games} />
          </StyledFlexBox>
          <GameSummaryList gameList={games} loadGamesConfig={loadGamesConfig} seasons={seasons} sx={{minWidth: '585px'}}></GameSummaryList>
      </Box>
    </Box>
  )
}

export default PlayerPageGeneral;