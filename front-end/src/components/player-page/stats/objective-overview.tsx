import { useTheme } from '@emotion/react';
import { Box, Divider, Fade, Switch, Theme, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import BaseRisenBox from '../../risen-box/base-risen-box';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { BaseStatGenerator } from '../../../common/stats-generators/BaseStatsGenerator';
import { StatGenerators } from '../../../common/constants';
import { AllObjectives, Dragons, Objectives } from '../../../common/types';


interface ChampionOverviewProps {
    playerStats: PlayerStatModel[]
}

// We need to do this because i couldnt find all the files we need as SVGs. So some of the files are in .svg format while some are in .png format
// TODO find all files as SVGs
const ObjectiveToPath: Record<AllObjectives, string> = {
  Chemtech: '/images/game/Chemtech-dragon.png',
  Cloud: '/images/game/Cloud-dragon.svg',
  Elder: '/images/game/Elder-dragon.svg',
  Herald: '/images/game/Herald.svg',
  Hextech: '/images/game/Hextech-dragon.svg',
  Infernal: '/images/game/Infernal-dragon.svg',
  Mountain: '/images/game/Mountain-dragon.svg',
  Ocean: '/images/game/Ocean-dragon.svg',
  Plates: '/images/game/Plates.png',
  Tower: '/images/game/Tower.png',
  Baron : '/images/game/Baron.svg'
};

const totalObjectives: Record<Objectives, BaseStatGenerator> = {
  Elder : StatGenerators.TOTAL_ELDER,
  Herald : StatGenerators.TOTAL_HERALD,
  Baron : StatGenerators.TOTAL_BARON,
  Tower: StatGenerators.TOTAL_TOWERS,
  Plates: StatGenerators.TOTAL_TOWER_PLATES
};

const averageObjectives: Record<Objectives, BaseStatGenerator> = {
  Elder : StatGenerators.ELDER,
  Herald : StatGenerators.HERALD,
  Baron : StatGenerators.BARON,
  Tower: StatGenerators.TOWERS,
  Plates: StatGenerators.TOWER_PLATES
};

export default function ObjectiveOverview(props: ChampionOverviewProps) {

  const [shouldUseTotals, setShouldUseTotals] = useState(false);

  const theme = useTheme() as Theme;
  const hasStats = props.playerStats.length > 0;
  const statsGeneratorToUse:  Record<Objectives, BaseStatGenerator> = shouldUseTotals ? totalObjectives : averageObjectives;
  const dragonsStatsGeneratorToUse: BaseStatGenerator = shouldUseTotals ? StatGenerators.TOTAL_DRAGON : StatGenerators.DRAGON;
  const amountOfDecimals = shouldUseTotals ? 0 : 2;
  return (
    <BaseRisenBox
      sx={{ padding: '0px 16px 16px 16px' }}
      title={
        <Box sx={{ display: 'flex', flexDirection:'row', justifyContent:'space-between' }}>
          <Typography sx={{ paddingTop: '16px' }} fontStyle="italic" fontFamily="Montserrat" color={theme.palette.info.light} align="left" variant="h5">OBJECTIVES</Typography>
          <Tooltip title={shouldUseTotals ? 'Show Averages' : 'Show Totals' }>
            <Switch sx={{ marginTop: '8px' }} onChange={(event) => setShouldUseTotals(event.target.checked)} />
          </Tooltip>
        </Box>
      }>

      { hasStats &&
                <Box>
                  <Fade in={true} style={{ transitionDelay: '50ms' }}>
                    <Box sx={{ display: 'flex', columnGap: 3, rowGap: 1 }}>
                      { Object.keys(statsGeneratorToUse).map((key) => ObjectiveStat(key as Objectives, statsGeneratorToUse[key as Objectives], props.playerStats, amountOfDecimals))}
                    </Box>
                  </Fade>
                  <Box sx={{ marginBottom: 2 }}/>
                  { getDragonObjectiveStat(dragonsStatsGeneratorToUse, props.playerStats, amountOfDecimals) }
                </Box>
      }

    </BaseRisenBox>
  );
}

function ObjectiveStat(objectiveType: Objectives, statGenerator: BaseStatGenerator, playerStats: PlayerStatModel[], amountOfDecimals: number) {
  return (
    <Box key={statGenerator.getStatTitle()}>
      <Tooltip title={objectiveType} sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent:'center' }}>
        {getObjectiveImg(objectiveType)}
      </Tooltip>
      <Box sx={{ width: '30px' }}>
        <Typography  fontFamily="Montserrat" align="center"
          variant="button">{statGenerator.getStatString(playerStats, amountOfDecimals)}</Typography>
      </Box>

    </Box>
  );
}

// Need a sperate component for dragons since we use all 6 icons for 1 stat
function getDragonObjectiveStat(statGenerator: BaseStatGenerator, playerStats: PlayerStatModel[], amountOfDecimals: number) {
  return (
    <Box sx={{ display: 'flex', rowGap: 1, flexDirection:'column' }}>
      <Tooltip title={'Dragons'}>
        <Box sx={{ display: 'flex', flexDirection:'row', justifyContent: 'center' }}>
          {Object.values(Dragons).map(dragonName => getObjectiveImg(dragonName as Dragons))}
        </Box>
      </Tooltip>
      <Typography fontFamily="Montserrat" align="center"
        variant="button">{statGenerator.getStatString(playerStats, amountOfDecimals)}</Typography>
    </Box>
  );
}

function getObjectiveImg(objectiveType: AllObjectives) {
  return (
    <img alt={objectiveType}
      src={ObjectiveToPath[objectiveType]}
      height="25px"
      width="25px"/>
  );
}