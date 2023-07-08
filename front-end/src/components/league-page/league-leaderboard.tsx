import { Theme, Typography, useTheme } from '@mui/material';
import { calculateWR } from '../../../../Common/utils';
import { Box } from '@mui/system';
import { getGradient } from './general';
import { darken } from '@mui/system/colorManipulator';
import React from 'react';
import TeamModel from '../../../../Common/models/team.model';
import { getRankColorByPercent } from '../../common/utils';
import PlayerGameModel from '../../../../Common/models/playergame.model';

interface LeagueLeaderbooardProps {
    teams: TeamModel[],
    games: PlayerGameModel[]
}
export default function LeagueLeaderboard(props: LeagueLeaderbooardProps) {
  const theme = useTheme() as Theme;

  let teamModels: Map<number, TeamModel> = new Map();
  for (let team of props.teams) {
    teamModels.set(team.teamId, team);
  }

  let leaderboardByTeam = buildLeaderboardByTeam(props.games);
  // TODO this component is a mess, lets fix is later
  return (
    <Box sx={{ minWidth: 560,
      minHeight: 280,
      display: 'flex', flexDirection: 'row', columnGap: 3,
      flexGrow: 1,
      flexWrap: 'wrap',
    }}>
      {/*{leaderboardByTeam.map(map => <LeaderboardCard values={map} teams={teamModels}/>)}*/}
    </Box>
  );
}

function buildLeaderboardByTeam(games: PlayerGameModel[]) {
  let averageGameTime: Map<number, number> = new Map();
  let averageGoldDiff15: Map<number, number> = new Map();
  let averageDragonsKilled: Map<number, number> = new Map();
  let gameMap: Map<number, Set<number>> = new Map(); //Figure out a way to get total games per team

  for (let game of games) {
    averageGameTime.set(game.risenTeamTeamId, (averageGameTime.has(game.risenTeamTeamId) ? averageGameTime.get(game.risenTeamTeamId) as number : 0) + (game.gameLength / 5));
    averageGoldDiff15.set(game.risenTeamTeamId, (averageGoldDiff15.has(game.risenTeamTeamId) ? averageGoldDiff15.get(game.risenTeamTeamId) as number : 0)  + game.goldDiff15);
    averageDragonsKilled.set(game.risenTeamTeamId, (averageDragonsKilled.has(game.risenTeamTeamId) ? averageDragonsKilled.get(game.risenTeamTeamId) as number : 0)  + game.dragonKills);

    let games = gameMap.has(game.risenTeamTeamId) ? gameMap.get(game.risenTeamTeamId) as Set<number> : new Set<number>();

    if(!games.has(game.risenTeamTeamId)) {
      games.add(game.gameGameId);
      gameMap.set(game.risenTeamTeamId, games);
    }
  }

  averageGameTime.forEach((value, key) => {
    averageGameTime.set(key, value / (gameMap.get(key) as Set<number>).size);
  });

  averageGoldDiff15.forEach((value, key) => {
    averageGameTime.set(key, value / (gameMap.get(key) as Set<number>).size);
  });

  averageDragonsKilled.forEach((value, key) => {
    averageDragonsKilled.set(key, value / (gameMap.get(key) as Set<number>).size);
  });

  return [
    averageGameTime, averageGoldDiff15, averageDragonsKilled
  ];
}

// TODO everything below this into its own file
interface LeaderboardCardProp {
    teams: Map<number, TeamModel>;
    values: Map<number, number>
}

function LeaderboardCard(props: LeaderboardCardProp) {
  const theme = useTheme() as Theme;

  const nameHeader = <Typography sx={{ paddingLeft: 2 }} variant='subtitle2' align='left' color={theme.palette.info.main}>Name</Typography>;
  const gamesHeader= <Typography sx={{ minWidth: 60 }} variant='subtitle2' align='left' color={theme.palette.info.main}>Games</Typography>;
  const wrHeader = <Typography sx={{ minWidth: 60, paddingRight: 1 }} variant='subtitle2' align='left' color={theme.palette.info.main}>Win Rate</Typography>;

  const sorted = new Map([...props.values.entries()].sort((a, b) => b[1] - a[1]));
  return (
    <Box sx={{ minWidth: 140,
      minHeight: 280,
      flexGrow: 1,
      flexWrap: 'wrap',
    }}>
      <Box sx={{ p: 0.2, borderRadius: '4px 4px 0px 0px', background: getGradient(theme.palette.risenBoxBg.main)  }}>
        <Typography sx={{ pl: 1 }} fontFamily="Montserrat" variant='h6' align='left' color={theme.palette.info.main}>TEAMS</Typography>
        <hr/>
      </Box>
      <Box sx={{ background: getGradient(theme.palette.risenBoxBg.main) }}>
        {LeaderboardRow(darken(theme.palette.risenBoxBg.main, 0), nameHeader, wrHeader)}
        {
          Array.from(props.values.keys())
            .filter(key => key !== null)
            .map((key, index) => {
              return LeaderboardValueRow(props.teams.get(key) as TeamModel, props.values.get(key) as number, theme, index );
            })
        }
      </Box>
      <Box sx={{ p: 1, borderRadius: '0px 0px 4px 4px', background: getGradient(theme.palette.risenBoxBg.main) }}/>
    </Box>
  );
}

function LeaderboardValueRow(team: TeamModel, value: number, theme: Theme, index: number,) {
  const background =  index % 2 === 0 ? darken(theme.palette.risenBoxBg.main, 0.13) : darken(theme.palette.risenBoxBg.main, 0);
  const name = <Typography sx={{ paddingLeft: 2 }} fontWeight="bold" variant='body2' align='left'>{team.abbreviation}</Typography>;
  const rowValue = <Typography sx={{ minWidth: 60, paddingRight: 1 }} fontWeight="bold" variant='body2' align='center'>{value}</Typography>;
  return LeaderboardRow(background, name, rowValue);
}

function LeaderboardRow(bgColor: string, teamName: React.ReactNode, value: React.ReactNode) {
  return (
    <Box sx={{ pt: 0.5, pb: 0.5, display: 'flex', flexDirection: 'row', justifyContent:'space-between', background: getGradient(bgColor) }}>
      {teamName}
      <Box sx={{ minWidth: 110, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {value}
      </Box>
    </Box>
  );
}