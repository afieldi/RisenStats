import { useTheme } from "@emotion/react";
import { Box, Hidden, Theme, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import { useParams } from "react-router-dom";
import { calculateCS, calculateKDA, GameTypeToString, riotTimestampToGameTime, toSearchName, trimStr } from "../../../../../Common/utils";
import GameModel from "../../../../../Common/models/game.model";
import PlayerGameModel from "../../../../../Common/models/playergame.model";
import RisenBox1 from "../../risen-box/risen-box-1";
import { GameSummaryPlayer } from "../../../../../Common/Interface/Database/game";
import { PlayerDetailedGame } from "../../../../../Common/Interface/Internal/player";
import ItemBox from "../../item-box/item-box";
import PlayerRadar from "../general-components/player-radar";
import AllTeamInfo from "./all-team-info";
import GameTimeInformation from "./game-time-information";
import EndOfGameStatsSummary from "./end-of-game-stats-summary";
import ChampionSetup from "./champion-setup";
import SeasonModel from "../../../../../Common/models/season.model";

interface Props {
  gameData: PlayerDetailedGame,
  seasons: SeasonModel[],
}

function _getPlayerFromGameData(playerName: string, gameData: GameModel): GameSummaryPlayer
{
  const playerSearchName = toSearchName(playerName);
  for (let player of gameData.playersSummary.bluePlayers)
  {
    if (toSearchName(player.playerName) === playerSearchName)
    {
      return player;
    }
  }
  for (let player of gameData.playersSummary.redPlayers)
  {
    if (toSearchName(player.playerName) === playerSearchName)
    {
      return player;
    }
  }
  throw new Error(`Player: ${playerName} not found in game ${gameData.gameId}!`);
}


function GameSummary({gameData, seasons}: Props)
{
  const theme = useTheme() as Theme;
  const mainPlayer = gameData.playerGame;
  const playerWin = mainPlayer.win;
  const bgColor = playerWin ? theme.palette.risenVictory.main : theme.palette.risenDefeat.main;
  const timestamp = new Date();
  timestamp.setUTCMilliseconds(+gameData.game.gameStart + (+gameData.game.gameDuration * 1000));
  const radarOptions = {
    height: 100,
    width: 100,
    size: 50,
    hideLabels: true
  };

  return (
    <RisenBox1 sx={{bgcolor: bgColor, mb: 1}}>
      <Box sx={{display: "inline-flex", width: "100%", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "center"}}>
        <Box sx={{display: "inline-flex", justifyContent: "space-evenly", flexGrow: 1, flexWrap: 'wrap',}}>
          <GameTimeInformation playerWin={playerWin} gameDuration={gameData.game.gameDuration}/>
          <ChampionSetup mainPlayer={mainPlayer} gameType={gameData.game.gameType} seasonId={gameData.game.seasonId} seasons={seasons} />

          <Box sx={{pr: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <Typography align="center" sx={{fontFamily: 'Montserrat'}}>
              {`${mainPlayer.kills}/${mainPlayer.deaths}/${mainPlayer.assists}`}
            </Typography>
            <ItemBox items={mainPlayer.items}></ItemBox>
          </Box>

          <EndOfGameStatsSummary mainPlayer={mainPlayer}/>

          <Hidden mdDown>
            <Box sx={{pr: 1, flexGrow: 1, justifyContent: 'center', display: 'flex'}}>
              <PlayerRadar games={[gameData]} options={radarOptions}></PlayerRadar>
            </Box>
          </Hidden>

          <AllTeamInfo gameModel={gameData.game}/>
        </Box>
      </Box>
    </RisenBox1>
  )
}

export default GameSummary;