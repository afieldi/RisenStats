import { useTheme } from '@emotion/react';
import { Collapse, Theme, Typography } from '@mui/material';
import React, { useState } from 'react';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import TeamModel from '../../../../Common/models/team.model';
import {
  buildTextBasedLeaderboardHeader, buildTextBasedLeaderboardRowPropsWithRedirect,
  LeaderboardRowProps,
  RowMainValue
} from './leaderboard/row';
import { riotTimestampToGameTime, roundTo } from '../../../../Common/utils';
import LeaderboardCard from './leaderboard/leaderboardCard';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import {
  getDisplayValueForTeamLeaderboardForAverage,
  getRisenTeamGameCountForLeague,
  getRisenTeamTotalStatForLeague, sortRisenTeamStatEntriesAscending, sortRisenTeamStatEntriesDescending
} from '../../common/stats-generators/team/RisenTeamStatGenerator';
import { NavigateFunction } from 'react-router/lib/hooks';

export interface TeamLeaderboardProps {
    games: PlayerGameModel[]
    teams: Map<number, TeamModel>
}

export interface TeamLeaderboardCardProps {
  titleOfCard: string,
  lbColumnTitle: string,
  orderedleaderboard: Map<number, number>,
  mainValueCalculator: (value: number, teamId: number) => number,
  formatter: (value: number) => string
}

const colorChoser = (v: number, theme: Theme) => '';
const howManyRowsToDisplay = 6;
const defaultAmountOfCardsToShow = 3; // Make sure this is a multiple of 3 for UI purposes
export default function TeamLeaderboards(props: TeamLeaderboardProps) {
  const theme = useTheme() as Theme;
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const gameCounts = getRisenTeamGameCountForLeague(props.games);
  const leaderboardCardProps = getLeaderboardCardProps(props.games, gameCounts, howManyRowsToDisplay);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', rowGap: 0.5, maxWidth: '100%' }}>
      <Box sx={{ p: 0.2, display: 'flex', flexDirection: 'column', minWidth: 880 }}>
        <Typography fontFamily="Montserrat" variant="h4" align="left">
            Team Leaderboards
        </Typography>
        <hr style={{ width: '100%' }} />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', columnGap: 3 }}>
        {
          [...leaderboardCardProps.keys()].slice(0, defaultAmountOfCardsToShow).map(key => {
            return TeamLeaderboardCard(
                  leaderboardCardProps.get(key) as TeamLeaderboardCardProps,
                  props.teams,
                  gameCounts,
                  theme,
                  navigate
            );
          })
        }
        <Collapse in={expanded} timeout="auto" unmountOnExit >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', columnGap: 3 }}>
            {[...leaderboardCardProps.keys()].slice(defaultAmountOfCardsToShow, leaderboardCardProps.size).map(key => {
              return TeamLeaderboardCard(
                  leaderboardCardProps.get(key) as TeamLeaderboardCardProps,
                  props.teams,
                  gameCounts,
                  theme,
                  navigate
              );
            })}
          </Box>
        </Collapse>
      </Box>

      <Typography
        onClick={() => {setExpanded(!expanded);}}
        sx={{
          cursor: 'pointer',
          color: theme.palette.primary.main,
          textAlign: 'right',
          fontWeight: 'bold',
        }}>{expanded ? 'Show Less' : 'Show More'}</Typography>
    </Box>
  );
}

export function TeamLeaderboardCard(props: TeamLeaderboardCardProps, teamMap:Map<number, TeamModel>, gameCounts: Map<number, number>, theme: Theme, navigate: NavigateFunction) {
  const leaderboardHeaders = buildTextBasedLeaderboardHeader('Name', 'Games', props.lbColumnTitle, theme);

  let leaderboardRows: LeaderboardRowProps[] = [];

  props.orderedleaderboard.forEach((value, key) => {
    let team = teamMap.get(key) as TeamModel;
    let games = gameCounts.get(key) as number;
    let mainValue: RowMainValue = {
      value: props.mainValueCalculator(value, team.teamId),
      formatter: props.formatter
    };
    leaderboardRows.push(buildTextBasedLeaderboardRowPropsWithRedirect(team.abbreviation, `${roundTo(games/5, 0)}`, mainValue, theme, colorChoser, () => navigate(`${team.abbreviation}`)));
  });

  let title = <Typography sx={{ pl: 1 }} fontFamily="Montserrat" variant='h6' align='left' color={theme.palette.info.main}>{props.titleOfCard}</Typography>;

  return (
    <LeaderboardCard sx={{ minWidth: 270, maxWidth: 275, minHeight: 280, maxHeight: 320 }} sortedRowProps={leaderboardRows} header={leaderboardHeaders} title={title}/>
  );
}

export function getLeaderboardCardProps(games:PlayerGameModel[], gameCountMap: Map<number, number>, howManyToDisplay: number): Map<String, TeamLeaderboardCardProps> {

  const leaderboardCardProps: Map<string, TeamLeaderboardCardProps> = new Map();

  // CSD15
  const sortedEntriesCSD15 = sortRisenTeamStatEntriesDescending(getRisenTeamTotalStatForLeague(games, ['csDiff15']), gameCountMap)
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('CSD15', {
    titleOfCard: 'CSD @15',
    lbColumnTitle: 'CSD15',
    orderedleaderboard: new Map(sortedEntriesCSD15),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap), // Multiply to 5 to account for 5 players
    formatter: (v: number) => `${v}`
  });

  // Average GameTime
  const sortedEntriesAvgGameTime =  sortRisenTeamStatEntriesAscending(getRisenTeamTotalStatForLeague(games, ['gameLength']), gameCountMap)
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('Game Time', {
    titleOfCard: 'Average Game Time',
    lbColumnTitle: 'Time',
    orderedleaderboard: new Map(sortedEntriesAvgGameTime),
    mainValueCalculator: (value: number, teamId: number) => value / (gameCountMap.get(teamId) as number),
    formatter: (gameTime: number) => `${riotTimestampToGameTime(gameTime)}`
  });

  // GoldDiff15
  const sortedEntriesGD15 = sortRisenTeamStatEntriesDescending(getRisenTeamTotalStatForLeague(games, ['goldDiff15']), gameCountMap)
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('GD15', {
    titleOfCard: 'Gold Diff @15',
    lbColumnTitle: 'GD15',
    orderedleaderboard: new Map(sortedEntriesGD15),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  // Average Dragons
  const sortedEntriesDragons = sortRisenTeamStatEntriesDescending(getRisenTeamTotalStatForLeague(games, ['oceanDragonKills', 'mountainDragonKills', 'chemtechDragonKills', 'elderDragonKills', 'infernalDragonKills', 'hextechDragonKills', 'cloudDragonKills']), gameCountMap)
    .slice(0, howManyToDisplay);
  leaderboardCardProps.set('Dragons', {
    titleOfCard: 'Average Dragons',
    lbColumnTitle: 'Drags',
    orderedleaderboard: new Map(sortedEntriesDragons),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  // Average Rift
  const sortedEntriesRiftHerald = sortRisenTeamStatEntriesDescending(getRisenTeamTotalStatForLeague(games, ['riftHeraldKills']), gameCountMap)
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('Rift Heralds', {
    titleOfCard: 'Average Rift Heralds',
    lbColumnTitle: 'Herald',
    orderedleaderboard: new Map(sortedEntriesRiftHerald),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  // Average Rift
  const sortedEntriesBarons = sortRisenTeamStatEntriesDescending(getRisenTeamTotalStatForLeague(games, ['baronKills']), gameCountMap)
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('Barons', {
    titleOfCard: 'Average Barons',
    lbColumnTitle: 'Barons',
    orderedleaderboard: new Map(sortedEntriesBarons),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  // Average Void Grubs
  const sortedEntriesVoidGrubs = sortRisenTeamStatEntriesDescending(getRisenTeamTotalStatForLeague(games, ['voidgrubKills']), gameCountMap)
    .slice(0, howManyToDisplay);
  leaderboardCardProps.set('Void Grubs', {
    titleOfCard: 'Average Void Grubs',
    lbColumnTitle: 'Grubs',
    orderedleaderboard: new Map(sortedEntriesVoidGrubs),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  // Average Turret Plates
  const sortedEntriesTurretPlates = sortRisenTeamStatEntriesDescending(getRisenTeamTotalStatForLeague(games, ['turretPlatesTaken']), gameCountMap)
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('Turret Plates', {
    titleOfCard: 'Average Turret Plates',
    lbColumnTitle: 'Plates',
    orderedleaderboard: new Map(sortedEntriesTurretPlates),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });


  // Unique Champions
  const sortedUniqueChamps = Array.from(getSortedUniqueChampions(games).entries()).sort((a, b) => b[1] - a[1])
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('Unique Champions', {
    titleOfCard: 'Unique Champions',
    lbColumnTitle: 'Unique',
    orderedleaderboard: new Map(sortedUniqueChamps),
    mainValueCalculator: (value: number, teamId: number) => value,
    formatter: (v: number) => `${v}`
  });

  return leaderboardCardProps;
}

function getSortedUniqueChampions(games: PlayerGameModel[]): Map<number, number> {
  const allChampsPerTeam = new Map<number, Set<number>>();

  for (let game of games) {
    let risenTeamId = game.risenTeamTeamId;
    if (risenTeamId == null) {
      continue;
    }
    let current = allChampsPerTeam.get(risenTeamId);
    if (!current) {
      current = new Set<number>();
    }
    current.add(game.championId);
    allChampsPerTeam.set(risenTeamId, current);
  }

  const uniqueChampCountPerTeam = new Map<number, number>;
  for (let statMapElement of allChampsPerTeam) {
    uniqueChampCountPerTeam.set(statMapElement[0], statMapElement[1].size);
  }

  return uniqueChampCountPerTeam;
}