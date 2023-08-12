import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

import GameModel from '../../../../Common/models/game.model';
import { SeasonBasedGameSummary } from '../player-page/game-summary/season-based-game-summary';
import TeamModel from '../../../../Common/models/team.model';

interface RecentGamesProps {
    games: GameModel[]
    teams: Map<number, TeamModel>
}
export default function RecentGames(props: RecentGamesProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column',  flexWrap: 'wrap', rowGap: 1 }}>
      <Box sx={{ p: 0.2, display: 'flex', flexDirection: 'column', minWidth: 280 }}>
        <Typography fontFamily="Montserrat" variant='h4' align='left'>Recent Games</Typography>
        <hr style={{ width: '100%' }}></hr>
      </Box>
      {
        props.games.length === 0 && <Typography fontFamily="Montserrat" variant='subtitle2' align='left'>No Games Yet!</Typography>
      }
      {
        props.games.length > 0 && props.games.map(match => {
          return <SeasonBasedGameSummary
            blueTeamAbbreviation={getTeamAbbrevation(100, match, props.teams)}
            redTeamAbbreviation={getTeamAbbrevation(200, match, props.teams)}
            match={match}/>;
        })
      }
    </Box>
  );
}

function getTeamAbbrevation(teamId: 100 | 200, match: GameModel, teams: Map<number, TeamModel>): string {
  let risenTeamId = match.players.find(playerGameModel => {
    return playerGameModel.teamId === teamId;
  })?.risenTeamTeamId;

  if (!risenTeamId) {
    return '???';
  }

  let abbrevation = teams.get(risenTeamId)?.abbreviation;

  if(!abbrevation) {
    return '???';
  }

  return abbrevation;

}