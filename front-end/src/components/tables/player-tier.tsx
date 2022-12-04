import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";
import PlayerStatModel from "../../../../Common/models/playerstat.model";
import { calculateKDA, riotTimestampToMinutes, roundTo, toSearchName } from "../../../../Common/utils";
import { getFlattenedLeaderboard } from "../../api/leaderboards";
import { DPMStatGenerator } from "../../common/stats-generators/DPMStatGenerator";
import { KDAStatGenerator } from "../../common/stats-generators/KDAStatGenerator";
import { TableColumn, SortOrder, LeaderboardType } from "../../common/types";
import { StatGenerators } from "../../common/utils";
import SortableTableHead from "./helper-components/sortable-head";
interface PlayerTierTableProps {
  seasonId: string;
  roleId: GameRoles;
  activeCols: TableColumn<LeaderboardType>[];
};

function MapStatsToLeaderboard(data: PlayerStatModel[]): LeaderboardType[] {
  return data.map((stat, i) => ({
    rank: +i+1,
    playerName: stat.player.name,
    wr: roundTo(StatGenerators.WR.getStatValue(stat)),
    role: GameRoles[stat.lobbyPosition as keyof typeof GameRoles],
    kda: roundTo(StatGenerators.KDA.getStatValue(stat)),
    dpm: roundTo(StatGenerators.DPM.getStatValue(stat)),
    gpm: roundTo(StatGenerators.GPM.getStatValue(stat)),
    vs: roundTo(stat.visionScore),
    kpp: roundTo(StatGenerators.KP_PERCENT.getStatValue(stat)),
    dmgp: roundTo(StatGenerators.DMG_PERCENT.getStatValue(stat)),
    deathPercent: roundTo(StatGenerators.DEATH_PERCENT.getStatValue(stat)),
    goldPercent: roundTo(StatGenerators.GOLD_SHARE.getStatValue(stat)),
    soloKills: roundTo(StatGenerators.SOLO_KILL.getStatValue(stat)),
    towerPlates: roundTo(StatGenerators.TOWER_PLATES.getStatValue(stat)),
    vsPercent: roundTo(StatGenerators.VS_PERCENT.getStatValue(stat)),
    gdDiff15: roundTo(StatGenerators.GOLD_DIFF_15.getStatValue(stat)),
    gdDiff25: roundTo(StatGenerators.GOLD_DIFF_25.getStatValue(stat)),
    xpDiff15: roundTo(StatGenerators.XP_DIFF_15.getStatValue(stat)),
    xpDiff25: roundTo(StatGenerators.XP_DIFF_25.getStatValue(stat)),
    csDiff15: roundTo(StatGenerators.CS_DIFF_15.getStatValue(stat)),
    csDiff25: roundTo(StatGenerators.CS_DIFF_25.getStatValue(stat)),
    games: stat.games,
  }));
}

export default function PlayerTierTable(props: PlayerTierTableProps) {
  const {
    seasonId,
    roleId,
    activeCols,
  } = props;

  const [playersStats, setPlayersStats] = useState<LeaderboardType[]>([]);
  const [sortCol, setSortCol] = useState<keyof LeaderboardType>('playerName');
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const theme = useTheme();
  useEffect(() => {
    getFlattenedLeaderboard(
      seasonId === "RISEN" ? undefined : Number(seasonId),
      seasonId === "RISEN",
      roleId,
    ).then((data) => {
      setPlayersStats(MapStatsToLeaderboard(data));
    })
  }, [seasonId, roleId]);

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
              headCells={activeCols}
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
                          activeCols.map((cell, j) => (
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