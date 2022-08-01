import React from "react";
import { Container } from "@mui/material";
import GameSummary from "./game-summary";
import GameModel from "../../../../../Common/models/game.model";
import { PlayerDetailedGame } from "../../../../../Common/Interface/Internal/player";

interface Props
{
  gameList: PlayerDetailedGame[]
}

function GameSummaryList({gameList}: Props)
{
  if (!gameList) { gameList = []; }
  return (
    <Container sx={{pr: 0}}>
      {gameList.map((game, i) => {
        return (
          <GameSummary key={`game-${i}`} gameData={game}></GameSummary>
        );
      })}
    </Container>
  );
}

export default GameSummaryList;