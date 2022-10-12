import React from "react";
import { Container, Grid, Box, Hidden, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import GameSummaryList from "./general-components/game-summary-list";
import RankFlag from "./general-components/rank-flag";
import GameModel from "../../../../Common/models/game.model";
import { PlayerDetailedGame, PlayerOverviewResponse } from "../../../../Common/Interface/Internal/player";
import PlayerModel from "../../../../Common/models/player.model";
import PlayerRadarCard from "./general-components/player-radar-card";
import RisenBox1 from "../risen-box/risen-box-1";
import { callbackify } from "util";
import { useState } from "react";
import SeasonModel from "../../../../Common/models/season.model";
import GamesFilter from "../filters/games-filter";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";

interface Props {
  games: PlayerDetailedGame[],
  player?: PlayerModel,
  seasons: SeasonModel[],
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

function PlayerPageGeneral({games, loadGamesConfig, player, seasons}: Props)
{
  if (!games)
  {
    games = [];
  }
  return (
    <Box>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Container sx={{pr: 0, pl: 0}}>
            <GamesFilter sx={{mb: 2}} useSeason={true} seasonConfig={{...loadGamesConfig.seasonConfig, seasons}} useRole={true} roleConfig={loadGamesConfig.roleConfig} />
            <RankFlag player={player}></RankFlag>
            <PlayerRadarCard sx={{mt: 2, mb: 2}} games={games}></PlayerRadarCard>
          </Container>
        </Grid>
        <Grid item xs={12} md={8}>
          <GameSummaryList gameList={games} loadGamesConfig={loadGamesConfig}></GameSummaryList>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PlayerPageGeneral;