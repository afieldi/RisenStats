import { Box, Typography } from '@mui/material';
import { calculateCS } from '../../../../../Common/utils';
import React from 'react';
import PlayerGameModel from '../../../../../Common/models/playergame.model';

interface EndOfGameStatsSummaryProps {
    mainPlayer: PlayerGameModel
}

function EndOfGameStatsSummary(endOfGameStatsSummaryProps: EndOfGameStatsSummaryProps) {
  return <Box sx={{ pr: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Typography variant="body2" align="center">
      {`Level ${endOfGameStatsSummaryProps.mainPlayer.champLevel}`}
    </Typography>
    <Typography variant="body2" align="center">
      {`${calculateCS(endOfGameStatsSummaryProps.mainPlayer)} CS`}
    </Typography>
    <Typography variant="body2" align="center">
      {`${endOfGameStatsSummaryProps.mainPlayer.visionScore} VS`}
    </Typography>
  </Box>;
}

export default EndOfGameStatsSummary;