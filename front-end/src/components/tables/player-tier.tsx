import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";
import PlayerStatModel from "../../../../Common/models/playerstat.model";
import { calculateKDA, riotTimestampToMinutes, roundTo, toSearchName } from "../../../../Common/utils";
import { getFlattenedLeaderboard } from "../../api/leaderboards";
import { DPMStatGenerator } from "../../common/stats-generators/DPMStatGenerator";
import { KDAStatGenerator } from "../../common/stats-generators/KDAStatGenerator";
import { HeadCell, SortOrder } from "../../common/types";
import SortableTableHead from "./helper-components/sortable-head";

interface PlayerTierTableProps {
  seasonId: string;
  roleId: GameRoles;
};

interface LeaderboardType {
  rank: number;
  playerName: string;
  role: GameRoles;
  kda: number;
  dpm: number;
  gpm: number;
  kpp: number;
  wr: number;
  games: number;
}

const headCells: HeadCell<LeaderboardType>[] = [
  {
    id: 'rank',
    align: 'left',
    disablePadding: false,
    label: 'Rank'
  },
  {
    id: 'role',
    align: 'left',
    disablePadding: false,
    label: 'Role'
  },
  {
    id: 'playerName',
    align: 'left',
    disablePadding: false,
    label: 'Name'
  },
  {
    id: 'wr',
    align: 'center',
    disablePadding: false,
    label: 'WR',
  },
  {
    id: 'kda',
    align: 'center',
    disablePadding: false,
    label: 'KDA'
  },
  {
    id: 'dpm',
    align: 'center',
    disablePadding: false,
    label: 'DPM'
  },
  {
    id: 'gpm',
    align: 'center',
    disablePadding: false,
    label: 'GPM'
  },
  {
    id: 'kpp',
    align: 'center',
    disablePadding: false,
    label: 'KP%'
  },
  {
    id: 'games',
    align: 'center',
    disablePadding: false,
    label: 'Games'
  },
]

function MapStatsToLeaderboard(data: PlayerStatModel[]): LeaderboardType[] {
  return data.map((stat, i) => ({
    rank: +i+1,
    playerName: stat.player.name,
    wr: roundTo((stat.win / stat.games)*100),
    role: GameRoles[stat.lobbyPosition as keyof typeof GameRoles],
    kda: calculateKDA(stat),
    dpm: roundTo(stat.totalDamageDealtToChampions / riotTimestampToMinutes(stat.gameLength)),
    gpm: roundTo(stat.goldEarned / riotTimestampToMinutes(stat.gameLength)),
    kpp: roundTo((stat.kills + stat.assists) / stat.totalKillsOfTeam),
    games: stat.games,
  }));
}

export default function PlayerTierTable(props: PlayerTierTableProps) {
  const {
    seasonId,
    roleId,
  } = props;
  const [playersStats, setPlayersStats] = useState<LeaderboardType[]>([]);
  const [sortCol, setSortCol] = useState<keyof LeaderboardType>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const theme = useTheme();
  const navigate = useNavigate();
  useEffect(() => {
    getFlattenedLeaderboard(
      seasonId === "RISEN" ? undefined : Number(seasonId),
      seasonId === "RISEN",
      roleId,
    ).then((data) => {
      setPlayersStats(MapStatsToLeaderboard(data));
    })
  }, [seasonId, roleId]);

  const goToPlayer = (playerName: string) => {
    navigate(`/player/${toSearchName(playerName)}`)
  }

  const sortPlayerStats = (newSortCol: keyof LeaderboardType) => {
    let newSortOrder: SortOrder;
    if (sortCol === newSortCol) {
      newSortOrder = sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
      setSortOrder(newSortOrder);
    }
    else {
      newSortOrder = SortOrder.DESC;
      setSortOrder(newSortOrder);
    }
    setSortCol(newSortCol);

    setPlayersStats(playersStats.sort((a, b) => {
      let retValue = 0;
      if (a[newSortCol] > b[newSortCol])
        retValue = 1;
      else if (a[newSortCol] < b[newSortCol])
        retValue = -1;
      return retValue * (newSortOrder === SortOrder.ASC ? 1 : -1);
    }));
  }

  return (
    <Box sx={{pb: 10}}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Table>
            <SortableTableHead
              order={sortOrder}
              orderBy={sortCol}
              headCells={headCells}
              onRequestSort={(event: React.MouseEvent<unknown>, property) => {sortPlayerStats(property)}}
            />
            <TableBody>
              {
                playersStats.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      key={`row_${index}`}>
                        <TableCell>
                          {row.rank}
                        </TableCell>
                        <TableCell>
                          {row.role}
                        </TableCell>
                        <TableCell>
                          <div className="clickable" onClick={() => {goToPlayer(row.playerName)}}>
                            {row.playerName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Typography align='center'>{row.wr}%</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color={KDAStatGenerator.getColor(row.kda, theme)} align='center'>{row.kda}:1</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color={DPMStatGenerator.getColor(row.dpm, theme)} align='center'>{row.dpm}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography align='center'>{row.gpm}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography align='center'>{row.kpp}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography align='center'>{row.games}</Typography>
                        </TableCell>
                        {/* <TableCell>{row.kda}</TableCell> */}
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}