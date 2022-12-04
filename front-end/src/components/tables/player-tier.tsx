import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";
import PlayerStatModel from "../../../../Common/models/playerstat.model";
import { calculateKDA, riotTimestampToMinutes, roundTo, toSearchName } from "../../../../Common/utils";
import { getFlattenedLeaderboard } from "../../api/leaderboards";
import { DPMStatGenerator } from "../../common/stats-generators/DPMStatGenerator";
import { KDAStatGenerator } from "../../common/stats-generators/KDAStatGenerator";
import { TableColumn, SortOrder } from "../../common/types";
import { StatGenerators } from "../../common/utils";
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

function getAllHeadCells(goToPlayer: Function): TableColumn<LeaderboardType>[] {
  return [
    {
      id: 'rank',
      align: 'left',
      disablePadding: false,
      label: 'Rank',
      active: true,
      display: (i: LeaderboardType) => i.rank,
    },
    {
      id: 'role',
      align: 'left',
      disablePadding: false,
      label: 'Role',
      active: true,
      display: (item: LeaderboardType) => item.role,
    },
    {
      id: 'playerName',
      align: 'left',
      disablePadding: false,
      label: 'Name',
      active: true,
      display: (item: LeaderboardType) => (
        <div className="clickable" onClick={() => {goToPlayer(item.playerName)}}>
          {item.playerName}
        </div>
      ),
    },
    {
      id: 'wr',
      align: 'center',
      disablePadding: false,
      label: 'WR',
      active: true,
      display: (item: LeaderboardType) => `${item.wr}%`,
    },
    {
      id: 'kda',
      align: 'center',
      disablePadding: false,
      label: 'KDA',
      active: true,
      display: (item: LeaderboardType) => `${item.kda}:1`,
    },
    {
      id: 'dpm',
      align: 'center',
      disablePadding: false,
      label: 'DPM',
      active: true,
      display: (item: LeaderboardType) => item.dpm,
    },
    {
      id: 'gpm',
      align: 'center',
      disablePadding: false,
      label: 'GPM',
      active: true,
      display: (item: LeaderboardType) => item.gpm,
    },
    {
      id: 'kpp',
      align: 'center',
      disablePadding: false,
      label: 'KP%',
      active: true,
      display: (item: LeaderboardType) => `${item.kpp}%`,
    },
    {
      id: 'games',
      align: 'center',
      disablePadding: false,
      label: 'Games',
      active: true,
      display: (item: LeaderboardType) => item.games,
    },
  ];
}

function MapStatsToLeaderboard(data: PlayerStatModel[]): LeaderboardType[] {
  return data.map((stat, i) => ({
    rank: i,
    playerName: stat.player.name,
    wr: StatGenerators.WR.getStatValue(stat),
    role: GameRoles[stat.lobbyPosition as keyof typeof GameRoles],
    kda: StatGenerators.KDA.getStatValue(stat),
    dpm: StatGenerators.DPM.getStatValue(stat),
    gpm: StatGenerators.GPM.getStatValue(stat),
    kpp: StatGenerators.KP_PERCENT.getStatValue(stat),
    games: stat.games,
  }));
}

export default function PlayerTierTable(props: PlayerTierTableProps) {
  const {
    seasonId,
    roleId,
  } = props;

  const [playersStats, setPlayersStats] = useState<LeaderboardType[]>([]);
  const [sortCol, setSortCol] = useState<keyof LeaderboardType>('playerName');
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

  const headCells = getAllHeadCells(goToPlayer);

  const [activeCells, setActiveCells] = useState<TableColumn<LeaderboardType>[]>(headCells.filter(cell => cell.active));


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
                        {
                          headCells.map((cell, j) => (
                            <TableCell key={`item_${j}`}>
                              {cell.display(row)}
                            </TableCell>
                          ))
                        }
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