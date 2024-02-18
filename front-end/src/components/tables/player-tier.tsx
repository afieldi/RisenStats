import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { roundTo } from '../../../../Common/utils';
import { getFlattenedLeaderboard } from '../../api/leaderboards';
import { TableColumn, SortOrder, LeaderboardType } from '../../common/types';
import { StatGenerators, OVERALL_GAME_RATING_OVERVIEW } from '../../common/constants';
import Loading from '../loading/loading';
import SortableTableHead from './helper-components/sortable-head';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';
import { DEFAULT_RISEN_SEASON_ID } from '../../../../Common/constants';

interface PlayerTierTableProps {
  seasonId: string;
  roleId: GameRoles;
  activeCols: TableColumn<LeaderboardType>[];
};

function MapStatsToLeaderboard(data: AggregatedPlayerStatModel[]): LeaderboardType[] {
  return data.map((stat, i) => ({
    rank: +i+1,
    playerName: stat.player.name,
    playerTag: stat.player.tag,
    tier: OVERALL_GAME_RATING_OVERVIEW[stat.lobbyPosition as keyof typeof GameRoles].getStatNumber([stat]),
    wr: roundTo(StatGenerators.WR.getStatValue(stat)),
    role: GameRoles[stat.lobbyPosition as keyof typeof GameRoles],
    kda: roundTo(StatGenerators.KDA.getStatValue(stat)),
    dpm: roundTo(StatGenerators.DPM.getStatValue(stat)),
    gpm: roundTo(StatGenerators.GPM.getStatValue(stat)),
    vs: roundTo(stat.visionScore / stat.games),
    vspm: roundTo(StatGenerators.AVERAGE_VSPM.getStatValue(stat)),
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
    baitPings: roundTo(StatGenerators.TOTAL_BAIT_PINGS.getStatValue(stat)),
    games: stat.games,
  }));
}

export default function PlayerTierTable(props: PlayerTierTableProps) {
  const {
    seasonId,
    roleId,
    activeCols,
  } = props;

  const theme = useTheme();

  const [playersStats, setPlayersStats] = useState<LeaderboardType[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [sortCol, setSortCol] = useState<keyof LeaderboardType>('playerName');
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  useEffect(() => {
    setLoadingStats(true);
    getFlattenedLeaderboard(
      seasonId === DEFAULT_RISEN_SEASON_ID ? 0 : Number(seasonId),
      roleId,
    ).then((data) => {
      sortPlayerStats(MapStatsToLeaderboard(data), sortCol, sortOrder);
      setLoadingStats(false);
    });
  }, [seasonId, roleId]);

  const setNewSort = (newSortCol: keyof LeaderboardType) => {
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
    sortPlayerStats(playersStats, newSortCol, newSortOrder);
  };

  const sortPlayerStats = (newStats: LeaderboardType[], passedCol: keyof LeaderboardType, passedOrder: SortOrder) => {
    setPlayersStats(newStats.sort((a, b) => {
      let retValue = 0;
      if (a[passedCol] > b[passedCol])
        retValue = 1;
      else if (a[passedCol] < b[passedCol])
        retValue = -1;
      return retValue * (passedOrder === SortOrder.ASC ? 1 : -1);
    }));
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Table>
            <SortableTableHead
              order={sortOrder}
              orderBy={sortCol}
              headCells={activeCols}
              onRequestSort={(event: React.MouseEvent<unknown>, property) => {setNewSort(property);}}
            />
            {
              loadingStats ? null :
                <TableBody>
                  {
                    playersStats.map((row, index) => {
                      return (
                        <TableRow
                          hover
                          key={`row_${index}`}>
                          {
                            activeCols.map((cell, j) => {
                              const displayValue = cell.id === 'rank' ? (
                                <Typography>{+index+1}</Typography>
                              ) : cell.display(row, theme);
                              return (
                                <TableCell key={`item_${j}`}>
                                  {displayValue}
                                </TableCell>
                              );
                            })
                          }
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
            }
          </Table>
        </TableContainer>
      </Paper>
      {
        loadingStats && <Loading sx={{ pt: 2 }} />
      }
    </Box>
  );
}