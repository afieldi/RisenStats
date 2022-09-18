import React from "react";
import { Container, Grid, Box, Hidden } from "@mui/material";
import GameSummaryList from "./general-components/game-summary-list";
import RankFlag from "./general-components/rank-flag";
import GameModel from "../../../../Common/models/game.model";
import { PlayerDetailedGame, PlayerOverviewResponse } from "../../../../Common/Interface/Internal/player";
import PlayerModel from "../../../../Common/models/player.model";
import PlayerRadarCard from "./general-components/player-radar-card";

interface Props {
  games: PlayerDetailedGame[],
  player?: PlayerModel,
  loadGamesConfig: {
    callback: (newPlayer: boolean, profile: PlayerOverviewResponse | undefined) => void,
    status: boolean
  };
}

function PlayerPageGeneral({games, loadGamesConfig, player}: Props)
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
          <RankFlag player={player}></RankFlag>
          {/* <Hidden mdDown> */}
            <PlayerRadarCard sx={{mt: 2}} games={games}></PlayerRadarCard>
          {/* </Hidden> */}
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