import React from "react";
import { Container, Grid, Box } from "@mui/material";
import GameSummaryList from "./general-components/game-summary-list";
import PlayerRadar from "./general-components/player-radar";
import RankFlag from "./general-components/rank-flag";
import GameModel from "../../../../Common/models/game.model";
import { PlayerDetailedGame } from "../../../../Common/Interface/Internal/player";

interface Props {
  games: PlayerDetailedGame[]
}

function PlayerPageGeneral({games}: Props)
{
  if (!games)
  {
    games = [];
  }
  return (
    <Box>
      <Grid container>
        <Grid item md={4}>
          <RankFlag rank={"Platinum 1"}></RankFlag>
          <PlayerRadar sx={{mt:  2}}></PlayerRadar>
        </Grid>
        <Grid item xs={12} md={8}>
          <GameSummaryList gameList={games}></GameSummaryList>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PlayerPageGeneral;