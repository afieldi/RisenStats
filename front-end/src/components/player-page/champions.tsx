import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import PlayerChampionStatsModel from "../../../../Common/models/playerchampionstats.model";
import { calculateChampionKDA, riotTimestampToGameTime } from "../../../../Common/utils";
import { ChampionIdToName } from "../../common/utils";
import WinRatePieChart from "../charts/winrate-pie";

interface Props {
  championData: PlayerChampionStatsModel[]
}

export default function PlayerPageChampions({ championData }: Props) {
  console.log(championData);
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Champion</TableCell>
              <TableCell>Winrate</TableCell>
              <TableCell>KDA</TableCell>
              <TableCell>Game Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              championData.map((champData: PlayerChampionStatsModel) => {
                return (
                  <TableRow key={champData.championId}>
                    <TableCell>
                      <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <img src={`/images/champions/icons/${champData.championId}_0.png`} height="35px" width="35px"></img>
                        <Box sx={{display: 'flex', alignItems: 'center', pl: 1.5}}>
                          <Typography>{ChampionIdToName(champData.championId)}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      In Progress
                      {/* <WinRatePieChart wins={champData.totalWins} losses={champData.totalGames - champData.totalWins} height={50}></WinRatePieChart> */}
                    </TableCell>
                    <TableCell>{calculateChampionKDA(champData, 2)}</TableCell>
                    <TableCell>{riotTimestampToGameTime(Number.parseInt(champData.averageGameDuration.toString()))}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}