import { Theme, Typography } from '@mui/material';
import { OVERALL_GAME_RATING_OVERVIEW } from '../../common/constants';
import { TableColumn, LeaderboardType, Rank } from '../../common/types';
import { getRankColor } from '../../common/utils';

export function getAllHeadCells(goToPlayer: Function): TableColumn<LeaderboardType>[] {
  return [
    {
      id: 'rank',
      align: 'left',
      disablePadding: false,
      label: 'Rank',
      active: true,
      display: (i: LeaderboardType, theme: Theme) => (
        <Typography>{i.rank}</Typography>
      ),
    },
    {
      id: 'role',
      align: 'left',
      disablePadding: false,
      label: 'Role',
      active: true,
      display: (item: LeaderboardType, theme: Theme) => (
        <img src={`/images/roles/${item.role}.png`} style={{ height: '30px' }}></img>
      ),
    },
    {
      id: 'playerName',
      align: 'left',
      disablePadding: false,
      label: 'Name',
      active: true,
      display: (item: LeaderboardType, theme: Theme) => (
        <Typography>
          <div className="clickable" onClick={() => {goToPlayer(item.playerName);}}>
            {item.playerName}
          </div>
        </Typography>
      ),
    },
    {
      id: 'tier',
      align: 'left',
      disablePadding: false,
      label: 'Tier',
      active: true,
      display: (item: LeaderboardType, theme: Theme) => {
        const rank: Rank = OVERALL_GAME_RATING_OVERVIEW[item.role].getRatingFromNumber(item.tier);
        return (
          <Typography color={getRankColor(rank, theme)} align="left" variant="h5">{rank}</Typography>
        );
      },
    },
    {
      id: 'wr',
      align: 'left',
      disablePadding: false,
      label: 'WR',
      active: true,
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
        <Typography>{`${item.kda}:1`}</Typography>
      ),
    },
    {
      id: 'dpm',
      align: 'left',
      disablePadding: false,
      label: 'DPM',
      active: true,
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
        <Typography>{`${item.vs}`}</Typography>
      ),
      description: 'Vision Score',
    },
    {
      id: 'vspm',
      align: 'left',
      disablePadding: false,
      label: 'VSPM',
      active: false,
      display: (item: LeaderboardType, theme: Theme) => (
        <Typography>{item.vspm}</Typography>
      ),
      description: 'Average Vision Score Per Min',
    },
    {
      id: 'kpp',
      align: 'left',
      disablePadding: false,
      label: 'KP%',
      active: true,
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
        <Typography>{`${item.dmgp}%`}</Typography>
      ),
      description: '% of Team\'s Damage',
    },
    {
      id: 'deathPercent',
      align: 'left',
      disablePadding: false,
      label: 'Death%',
      active: false,
      display: (item: LeaderboardType, theme: Theme) => (
        <Typography>{`${item.deathPercent}%`}</Typography>
      ),
      description: '% of Team\'s Deaths',
    },
    {
      id: 'goldPercent',
      align: 'left',
      disablePadding: false,
      label: 'Gold%',
      active: false,
      display: (item: LeaderboardType, theme: Theme) => (
        <Typography>{`${item.goldPercent}%`}</Typography>
      ),
      description: '% of Team\'s Gold',
    },
    {
      id: 'soloKills',
      align: 'left',
      disablePadding: false,
      label: 'Solo Kills',
      active: false,
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
        <Typography>{`${item.vsPercent}%`}</Typography>
      ),
      description: '% of Team\'s Vision Score',
    },
    {
      id: 'gdDiff15',
      align: 'left',
      disablePadding: false,
      label: 'GD@15',
      active: false,
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
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
      display: (item: LeaderboardType, theme: Theme) => (
        <Typography>{item.games}</Typography>
      ),
      description: 'Total Games',
    },
    {
      id: 'baitPings',
      align: 'left',
      disablePadding: false,
      label: 'Bait Pings',
      active: false,
      display: (item: LeaderboardType, theme: Theme) => (
        <Typography>{item.baitPings}</Typography>
      ),
      description: 'Total bait pings',
    },
  ];
}