import { Box, Typography } from '@mui/material';
import React from 'react';
import { GameSummaryPlayer } from '../../../../../Common/Interface/Database/game';
import { Link } from 'react-router-dom';

export enum TeamColor {
    BLUE = 'blue',
    RED = 'red'
}

interface TeamInfoProps {
    teamPlayers: GameSummaryPlayer[]
    gameId: number
    teamColor: TeamColor
}

const alignmentByTeamColor: Record<TeamColor, 'left' | 'right'> = {
  [TeamColor.BLUE] : 'left',
  [TeamColor.RED]:  'right'
};

const flexDirectionByTeamColor: Record<TeamColor, string> = {
  [TeamColor.BLUE] : 'row',
  [TeamColor.RED]: 'row-reverse'
};

function TeamInfo(teamInfoProps: TeamInfoProps) {

  const alignment: 'left' | 'right' = alignmentByTeamColor[teamInfoProps.teamColor];
  const rowType = flexDirectionByTeamColor[teamInfoProps.teamColor];
  return <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', pr: .5 }}>
    {
      teamInfoProps.teamPlayers.map((player, i) => {
        return (
          <Box key={`${teamInfoProps.teamColor}-${teamInfoProps.gameId}-${i}`}
            sx={{ 
              display: 'inline-flex',
              height: '1.2em',
              fontStretch: 'condensed',
              flexDirection: rowType,
              columnGap: '2px'
            }}>
            <Box sx={{ width: '15px', flexShrink: '0' }}>
              <img src={`/images/champions/icons/${player.championId}_0.png`}
                alt={`${player.championId}`}
                height="15px"
                width="15px"/>
            </Box>
            <Box sx={{ overflow: 'hidden' }}>
              <Link to={`/player/${encodeURIComponent(player.playerName)}`}>
                <Typography variant="body2" align={alignment} className="clickable-bg no-overflow player-names">
                  {player.playerName}
                </Typography>
              </Link>
            </Box>
          </Box>
        );
      })
    }
  </Box>;
}

export default TeamInfo;