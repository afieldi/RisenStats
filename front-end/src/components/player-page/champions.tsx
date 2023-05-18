import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import PlayerChampionStatsModel from '../../../../Common/models/playerchampionstats.model';
import { calculateChampionKDA, calculateWR, riotTimestampToGameTime, toPerMinute } from '../../../../Common/utils';
import { ChampionIdToName } from '../../common/utils';
import WinRatePieChart from '../charts/winrate-pie';
import SeasonModel from '../../../../Common/models/season.model';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import GamesFilter from '../filters/games-filter';
import FilterBar from '../filters/filter-bar';

interface Props {
  championData: PlayerChampionStatsModel[]
  seasonConfig: {
    seasonId: string,
    setSeasonId: (seasonId: string) => void,
    seasons: SeasonModel[],
  };
  roleConfig?: {
    roleId: GameRoles,
    setRoleId: (roleId: GameRoles) => void,
  };
}

export default function PlayerPageChampions(props: Props) {
  return (
    <Box>
      <FilterBar seasonConfig={props.seasonConfig} roleConfig={props.roleConfig}/>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>Champion</Typography>
              </TableCell>
              <TableCell>
                <Typography>Winrate</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">KDA</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">Game Time</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">Damage/Min</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">Gold/Min</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">Games</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              props.championData.map((champData: PlayerChampionStatsModel) => {
                const gameTime = Number.parseInt(champData.averageGameDuration.toString());
                return (
                  <TableRow key={champData.championId}>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <img src={`/images/champions/icons/${champData.championId}_0.png`} height="35px" width="35px"></img>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1.5 }}>
                          <Typography>{ChampionIdToName(champData.championId)}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <WinRatePieChart wins={champData.totalWins} losses={champData.totalGames - champData.totalWins} height={25}></WinRatePieChart>
                        <Typography sx={{ pl: 1 }}>{calculateWR(champData, 2)}%</Typography>
                      </Box>
                      {/* In Progress */}
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{calculateChampionKDA(champData, 2)}:1</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{riotTimestampToGameTime(gameTime)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{toPerMinute(champData.averageDamageDealt, gameTime)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{toPerMinute(champData.averageGoldEarned, gameTime)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{champData.totalGames}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}