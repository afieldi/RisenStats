import { Box, SxProps, Theme } from '@mui/material';
import React from 'react';
import TeamInfo, { TeamColor } from './team-info';
import GameModel from '../../../../../Common/models/game.model';

interface AllTeamInfoProps {
  gameModel: GameModel;
  sx?: SxProps<Theme>
}
function AllTeamInfo(allTeamInfoProps: AllTeamInfoProps) {

  // For some reason these are flipped so we do this remapping here.
  const bluePlayer = allTeamInfoProps.gameModel.playersSummary.redPlayers;
  const redPlayers = allTeamInfoProps.gameModel.playersSummary.bluePlayers;

  return (
    <Box sx={{ ...allTeamInfoProps.sx, display: 'flex', justifyContent: 'flex-end' }}>
      <TeamInfo teamPlayers={bluePlayer}
        gameId={allTeamInfoProps.gameModel.gameId}
        teamColor={TeamColor.BLUE} />
      <TeamInfo teamPlayers={redPlayers}
        gameId={allTeamInfoProps.gameModel.gameId}
        teamColor={TeamColor.RED} />
    </Box>
  );
}

export default AllTeamInfo;