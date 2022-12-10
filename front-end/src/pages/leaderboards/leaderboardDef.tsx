import { Typography } from '@mui/material';
import { TableColumn, LeaderboardType } from '../../common/types';

export function getAllHeadCells(goToPlayer: Function): TableColumn<LeaderboardType>[] {
  return [
    {
      id: 'rank',
      align: 'left',
      disablePadding: false,
      label: 'Rank',
      active: true,
      display: (i: LeaderboardType) => (
        <Typography>{i.rank}</Typography>
      ),
    },
    {
      id: 'role',
      align: 'left',
      disablePadding: false,
      label: 'Role',
      active: true,
      display: (item: LeaderboardType) => (
        <img src={`/images/roles/${item.role}.png`} style={{height: '30px'}}></img>
      ),
    },
    {
      id: 'playerName',
      align: 'left',
      disablePadding: false,
      label: 'Name',
      active: true,
      display: (item: LeaderboardType) => (
        <Typography>
          <div className="clickable" onClick={() => {goToPlayer(item.playerName)}}>
            {item.playerName}
          </div>
        </Typography>
      ),
    },
    {
      id: 'wr',
      align: 'left',
      disablePadding: false,
      label: 'WR',
      active: true,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.wr}%`}</Typography>
      ),
      description: 'Win Rate',
    },
    {
      id: 'kda',
      align: 'left',
      disablePadding: false,
      label: 'KDA',
      active: true,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.kda}:1`}</Typography>
      ),
    },
    {
      id: 'dpm',
      align: 'left',
      disablePadding: false,
      label: 'DPM',
      active: true,
      display: (item: LeaderboardType) => (
        <Typography>{item.dpm}</Typography>
      ),
      description: 'Damage Per Minute',
    },
    {
      id: 'gpm',
      align: 'left',
      disablePadding: false,
      label: 'GPM',
      active: true,
      display: (item: LeaderboardType) => (
        <Typography>{item.gpm}</Typography>
      ),
      description: 'Gold Per Minute',
    },
    {
      id: 'vs',
      align: 'left',
      disablePadding: false,
      label: 'VS',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.vs}%`}</Typography>
      ),
      description: 'Vision Score',
    },
    {
      id: 'kpp',
      align: 'left',
      disablePadding: false,
      label: 'KP%',
      active: true,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.kpp}%`}</Typography>
      ),
      description: 'Kill Participation Percent',
    },
    {
      id: 'dmgp',
      align: 'left',
      disablePadding: false,
      label: 'DMG%',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.dmgp}%`}</Typography>
      ),
      description: "% of Team's Damage",
    },
    {
      id: 'deathPercent',
      align: 'left',
      disablePadding: false,
      label: 'Death%',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.deathPercent}%`}</Typography>
      ),
      description: "% of Team's Deaths",
    },
    {
      id: 'goldPercent',
      align: 'left',
      disablePadding: false,
      label: 'Gold%',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.goldPercent}%`}</Typography>
      ),
      description: "% of Team's Gold",
    },
    {
      id: 'soloKills',
      align: 'left',
      disablePadding: false,
      label: 'Solo Kills',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.soloKills}`}</Typography>
      ),
      description: 'Solo Kills per game',
    },
    {
      id: 'towerPlates',
      align: 'left',
      disablePadding: false,
      label: 'Plates',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.towerPlates}`}</Typography>
      ),
      description: 'Tower Plates',
    },
    {
      id: 'vsPercent',
      align: 'left',
      disablePadding: false,
      label: 'VS%',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.vsPercent}%`}</Typography>
      ),
      description: "% of Team's Vision Score",
    },
    {
      id: 'gdDiff15',
      align: 'left',
      disablePadding: false,
      label: 'GD@15',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.gdDiff15}`}</Typography>
      ),
      description: 'Gold Difference at 15 min',
    },
    {
      id: 'gdDiff25',
      align: 'left',
      disablePadding: false,
      label: 'GD@25',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.gdDiff25}`}</Typography>
      ),
      description: 'Gold Difference at 25 min',
    },
    {
      id: 'xpDiff15',
      align: 'left',
      disablePadding: false,
      label: 'XPD@15',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.xpDiff15}`}</Typography>
      ),
      description: 'XP Difference at 15 min',
    },
    {
      id: 'xpDiff25',
      align: 'left',
      disablePadding: false,
      label: 'XPD@25',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.xpDiff25}`}</Typography>
      ),
      description: 'XP Difference at 25 min',
    },
    {
      id: 'csDiff15',
      align: 'left',
      disablePadding: false,
      label: 'CSD@15',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.csDiff15}`}</Typography>
      ),
      description: 'CS Difference at 15 min',
    },
    {
      id: 'csDiff25',
      align: 'left',
      disablePadding: false,
      label: 'CSD@25',
      active: false,
      display: (item: LeaderboardType) => (
        <Typography>{`${item.csDiff25}`}</Typography>
      ),
      description: 'CS Difference at 25 min',
    },
    {
      id: 'games',
      align: 'left',
      disablePadding: false,
      label: 'Games',
      active: true,
      display: (item: LeaderboardType) => (
        <Typography>{item.games}</Typography>
      ),
      description: 'Total Games',
    },
  ];
}