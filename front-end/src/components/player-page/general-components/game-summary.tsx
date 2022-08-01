import { useTheme } from "@emotion/react";
import { Box, Theme, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { calculateCS, calculateKDA, GameTypeToString, riotTimestampToGameTime, toSearchName, trimStr } from "../../../../../Common/utils";
import GameModel from "../../../../../Common/models/game.model";
import PlayerGameModel from "../../../../../Common/models/playergame.model";
import RisenBox1 from "../../risen-box/risen-box-1";
import { GameSummaryPlayer } from "../../../../../Common/Interface/Database/game";
import { PlayerDetailedGame } from "../../../../../Common/Interface/Internal/player";

interface Props {
  gameData: PlayerDetailedGame
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

function GameSummary({gameData}: Props)
{
  const theme = useTheme() as Theme;
  const { playerName } = useParams();
  const mainPlayer = gameData.playerGame;
  const playerWin = mainPlayer.win;
  const bgColor = playerWin ? theme.palette.risenVictory.main : theme.palette.risenDefeat.main;

  return (
    <RisenBox1 sx={{
      bgcolor: bgColor,
      mb: 1
    }}>
      <Box sx={{
        display: "inline-flex",
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}>
        <Box sx={{
        display: "inline-flex",
        flexGrow: 1
        }}>
          {/* W/L + Gametime */}
          <Box  sx={{width: "40px"}}>
            <Typography align="center">
              {playerWin ? "Win" : "Loss"}
            </Typography>
            <hr></hr>
            <Typography align="center" variant="body2">
              {riotTimestampToGameTime(gameData.game.gameDuration)}
            </Typography>
          </Box>
          {/* W/L + Gametime end */}

          <Box>
            <Box sx={{display: "inline-flex"}}>
              {/* Champion pfp */}
              <Box sx={{pl: 1, pr: 1}}>
                <img src={`/images/champions/icons/${mainPlayer.championId}_0.png`} height="50px" width="50px"></img>
              </Box>
              {/* pfp end */}

              {/* Summoner Spells */}
              <Box sx={{display: "flex", flexDirection: "column"}}>
                <img src={`/images/summoner/${mainPlayer.summoner1Id}.png`} height="25px" width="25px"></img>
                <img src={`/images/summoner/${mainPlayer.summoner2Id}.png`} height="25px" width="25px"></img>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" align="center">{GameTypeToString(gameData.game.gameType, gameData.game.seasonId)}</Typography>
            </Box>
          </Box>
          {/* Summoner Spells end */}

          {/* Rune Choices */}
          <Box sx={{display: "flex", flexDirection: "column"}}>
            <img src={`/images/runes/${mainPlayer.primaryRunes[0]}.png`} height="25px" width="25px"></img>
            <Box sx={{width: "20px"}} className="hcenter">
              <img src={`/images/runes/${mainPlayer.secondaryStyle}.png`} height="25px" width="25px"></img>
            </Box>
          </Box>
          {/* Rune Choices End */}

          {/* Score */}
          <Box sx={{pr: 1, pl: 1, pt: 1, width: '70px'}}>
            <Typography align="center">
              {`${mainPlayer.kills}/${mainPlayer.deaths}/${mainPlayer.assists}`}
            </Typography>
            <Typography align="center" variant="body2">
              {calculateKDA(mainPlayer)}
            </Typography>
          </Box>
          {/* Score End */}

          {/* High-level Numbers */}
          <Box sx={{pr: 1}}>
            <Typography variant="body2" align="center">
              {`Level ${mainPlayer.champLevel}`}
            </Typography>
            <Typography variant="body2" align="center">
              {`${calculateCS(mainPlayer)} CS`}
            </Typography>
            <Typography variant="body2" align="center">
              {`${mainPlayer.visionScore} VS`}
            </Typography>
          </Box>
          {/* High Level Numbers End */}
        </Box>
        <Box sx={{display: 'flex', justifyContent: "flex-end"}}>
          {/* Blue Team */}
          <Box sx={{display: "flex", flexDirection: "column", width: '50%', pr: .5}}>
            {
              gameData.game.playersSummary.bluePlayers.map((player, i) => {
                return (
                  <Box key={`blue-${gameData.game.gameId}-${i}`} sx={{display: "inline-flex", height: '1.2em', fontStretch: 'condensed'}}>
                    <Box sx={{width: '15px', flexShrink: '0'}}>
                      <img src={`/images/champions/icons/${player.championId}_0.png`} height="15px" width="15px"></img>
                    </Box>
                    <Box sx={{overflow: 'hidden', width: '75px'}}>
                      <Link to={`/player/${encodeURIComponent(player.playerName)}`}>
                        <Typography variant="body2" align="left" className="clickable-bg no-overflow player-names">
                          {player.playerName}
                        </Typography>
                      </Link>
                    </Box>
                  </Box>
                )
              })
            }
          </Box>
          {/* Blue Team End */}

          {/* Red Team */}
          <Box sx={{display: "flex", flexDirection: "column", width: '50%', pl: .5}}>
            {
              gameData.game.playersSummary.redPlayers.map((player, i) => {
                return (
                  <Box key={`red-${gameData.game.gameId}-${i}`} sx={{display: "inline-flex", flexDirection: 'row-reverse', height: '1.2em', fontStretch: 'condensed'}}>
                    <Box sx={{width: '15px'}} className="testclass">
                      <img src={`/images/champions/icons/${player.championId}_0.png`} height="15px" width="15px"></img>
                    </Box>
                    <Box sx={{overflow: 'hidden', width: '75px', textAlign: 'right'}}>
                      <Link to={`/player/${encodeURIComponent(player.playerName)}`}>
                        <Typography variant="body2" align="right" className="clickable-bg player-names">
                          {player.playerName}
                        </Typography>
                      </Link>
                    </Box>
                  </Box>
                )
              })
            }
          </Box>
          {/* Red Team Emd */}
        </Box>
      </Box>
    </RisenBox1>
  )
}


export default GameSummary;