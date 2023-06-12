import { Box } from '@mui/material';
import React from 'react';
import TeamInfo, { TeamColor } from './team-info';
import GameModel from '../../../../../Common/models/game.model';

interface AllTeamInfoProps {
    gameModel: GameModel
}
function AllTeamInfo(allTeamInfoProps: AllTeamInfoProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <TeamInfo teamPlayers={allTeamInfoProps.gameModel.playersSummary.bluePlayers}
        gameId={allTeamInfoProps.gameModel.gameId}
        teamColor={TeamColor.BLUE}/>
      <TeamInfo teamPlayers={allTeamInfoProps.gameModel.playersSummary.redPlayers}
        gameId={allTeamInfoProps.gameModel.gameId}
        teamColor={TeamColor.RED}/>
    </Box>
  );
}

export default AllTeamInfo;