import { Box, Theme, Tooltip, Typography } from '@mui/material';
import React from 'react';
import BaseRisenBox from '../../risen-box/base-risen-box';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { useTheme } from '@emotion/react';
import { StatGenerators } from '../../../common/constants';
import { BaseStatGenerator } from '../../../common/stats-generators/BaseStatsGenerator';
import { doesPlayerStatsObjectHaveData } from '../../../../../Common/utils';
import { abbreviateNumber } from '../../../common/utils';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

interface PingOverviewProps {
    playerStats: AggregatedPlayerStatModel[]
}

const pings: Record<string, BaseStatGenerator> = {
  '/images/game/pings/all_in.png' : StatGenerators.TOTAL_ALL_IN_PINGS,
  '/images/game/pings/assist.png' : StatGenerators.TOTAL_ASSIST_ME_PINGS,
  '/images/game/pings/ping.png' : StatGenerators.TOTAL_BASIC_PINGS,
  '/images/game/pings/bait.png' : StatGenerators.TOTAL_BAIT_PINGS,
  '/images/game/pings/mia.png' : StatGenerators.TOTAL_ENEMY_MISSING_PINGS,
  '/images/game/pings/area_is_warded.png' : StatGenerators.TOTAL_ENEMY_VISION_PINGS,
  '/images/game/pings/caution.png' : StatGenerators.TOTAL_GET_BACK_PING,
  '/images/game/pings/hold.png' : StatGenerators.TOTAL_HOLD_PING,
  '/images/game/pings/need_ward.png' : StatGenerators.TOTAL_NEED_VISION_PING,
  '/images/game/pings/on_my_way.png' : StatGenerators.TOTAL_ON_MY_WAY_PINGS,
  '/images/game/pings/push.png' : StatGenerators.TOTAL_PUSH_PINGS,
  '/images/game/pings/cleared.png' : StatGenerators.TOTAL_VISION_CLEARED_PINGS,
  '/images/game/pings/command.png' : StatGenerators.TOTAL_COMMAND_PINGS,
  '/images/game/pings/danger.png' : StatGenerators.TOTAL_DANGER_PINGS
};

export default function PingOverview(props: PingOverviewProps) {
  const theme = useTheme() as Theme;

  let totalPings = 0;
  Object.keys(pings).forEach(key => totalPings += pings[key].getStatSum(props.playerStats));

  return (
    <BaseRisenBox sx={{ minWidth: 240, maxWidth: 270, justifyContent:'space-between' }} title="Total Pings">
      {
        !doesPlayerStatsObjectHaveData(props.playerStats) && <Typography color={theme.palette.info.light} variant="h3">No Data</Typography>
      }
      <Box sx={{ justifyContent:'space-between', display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 1, padding: '5px' }}>
        {
          doesPlayerStatsObjectHaveData(props.playerStats) &&
                    Object.keys(pings)
                      .sort((a, b) => pings[b].getStatSum(props.playerStats) - pings[a].getStatSum(props.playerStats))
                      .map((key) => {
                        return getPing(theme, key, pings[key], props.playerStats);
                      })
        }
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 1, justifyContent: 'space-between', alignContent: 'center', paddingTop: '10px' }}>
        <Typography fontFamily="Montserrat" color={theme.palette.info.light} align="left" variant="h6">TOTAL</Typography>
        <Typography fontFamily="Montserrat" align="left" variant="h6">{abbreviateNumber(totalPings)}</Typography>
      </Box>
    </BaseRisenBox>
  );
}

function getPing(theme: Theme, src: string, statGenerator: BaseStatGenerator, playerStats: AggregatedPlayerStatModel[]) {
  return (
    <Box key={statGenerator.getStatTitle()}>
      <Tooltip title={statGenerator.getToolTip()} sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent:'center' }}>
        <img alt={statGenerator.getToolTip()} src={src} height="25x" width="25px"/>
      </Tooltip>
      <Box sx={{ width: '30px' }}>
        <Typography  fontFamily="Montserrat" align="center"
          variant="button">{abbreviateNumber(statGenerator.getStatSum(playerStats))}</Typography>
      </Box>

    </Box>
  );
}