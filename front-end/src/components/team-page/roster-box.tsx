import { useTheme } from '@emotion/react';
import { Theme, Typography } from '@mui/material';
import React from 'react';
import PlayerTeamModel from '../../../../Common/models/playerteam.model';
import {
  buildTextBasedLeaderboardHeader,
  buildTextBasedLeaderboardRowPropsWithRedirect,
  LeaderboardRowProps,
  RowMainValue
} from '../league-page/leaderboard/row';
import LeaderboardCard from '../league-page/leaderboard/leaderboardCard';
import { useNavigate } from 'react-router-dom';
import PlayerGameModel from '../../../../Common/models/playergame.model';

export interface RosterProps {
    roster: PlayerTeamModel[],
    teamGames: PlayerGameModel[]
}

export default function RosterBox(props: RosterProps) {
  const theme = useTheme() as Theme;
  const navigate = useNavigate();

  const gameCounts = buildGameCounts(props.teamGames);

  const leaderboardHeaders = buildTextBasedLeaderboardHeader('Name', 'Rank', 'Games', theme);

  let leaderboardRows: LeaderboardRowProps[] = [];

  for (let player of props.roster) {

    let mainValue: RowMainValue = {
      value: (gameCounts.has(player.playerPuuid) ? gameCounts.get(player.playerPuuid) : 0) as number,
      formatter: (value: number) => `${value}`
    };
    leaderboardRows.push(buildTextBasedLeaderboardRowPropsWithRedirect(displayName(player.player.name, player.player.tag),
      `${player.player.league} ${player.player.division}`,
      mainValue, 
      theme,
      getGameColorByCount,
      () => navigate(`/player/${encodeURIComponent(`${player.player.name}-${player.player.tag}`)}`)));
  }

  let title = <Typography sx={{ pl: 1 }} fontFamily="Montserrat" variant='h6' align='left' color={theme.palette.info.main}>ROSTER</Typography>;

  return (
    <LeaderboardCard sx={{ minWidth: 280, maxWidth: 280, minHeight: 280 }} sortedRowProps={leaderboardRows} header={leaderboardHeaders} title={title}/>
  );
}


function displayName(playerName: string, playerTag: string): string {
  let displayName: string = `${playerName}#${playerTag}`;
  // Need to do this for stuff to fit nicely
  if (displayName.length > 10) {
    return displayName.slice(0, 11) + '...';
  }
  return displayName;
}

function buildGameCounts(games: PlayerGameModel[]): Map<string, number> {
  let gameCounts = new Map();
  for (let game of games) {
    let currentCount = (gameCounts.has(game.playerPuuid) ? gameCounts.get(game.playerPuuid) : 0) as number;
    gameCounts.set(game.playerPuuid, currentCount + 1);
  }

  return gameCounts;
}

function getGameColorByCount(count: number, theme: Theme) {
  // TODO fix?
  return theme.palette.info.dark;
}