import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import {
  riotTimestampToGameTime,
  roundTo,
} from '../../../../Common/utils';
import { ChampionIdToName } from '../../common/utils';
import WinRatePieChart from '../charts/winrate-pie';
import SeasonModel from '../../../../Common/models/season.model';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import FilterBar from '../filters/filter-bar';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';
import { StatGenerators } from '../../common/constants';

interface Props {
  playerStats: AggregatedPlayerStatModel[]
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

  props.playerStats.sort((a, b) => {return b.games - a.games;});

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
              props.playerStats.map((champData: AggregatedPlayerStatModel) => {
                const gameTime = Number.parseInt(champData.gameLength.toString());
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
                        <WinRatePieChart wins={champData.win} losses={champData.games - champData.win} height={25}></WinRatePieChart>
                        <Typography sx={{ pl: 1 }}>{roundTo(StatGenerators.WR.getStatValue(champData))}%</Typography>
                      </Box>
                      {/* In Progress */}
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{StatGenerators.KDA.getStatString([champData])}:1</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{riotTimestampToGameTime(gameTime)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{StatGenerators.DPM.getStatString([champData])}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{StatGenerators.GPM.getStatString([champData])}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{champData.games}</Typography>
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