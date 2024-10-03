import { useTheme } from '@emotion/react';
import { Theme } from '@mui/material';
import { getGradient } from '../../common/utils';
import BaseRisenBox from '../risen-box/base-risen-box';
import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts';
import React from 'react';
import PlayerGameModel from '../../../../Common/models/playergame.model';

interface LeagueDragonProps {
  games: PlayerGameModel[];
}
export default function LeagueDragons(props: LeagueDragonProps) {
  const theme = useTheme() as Theme;

  const dragonStats = buildDragonStats(props.games);

  const data = [
    { name: 'Ocean', value: dragonStats.ocean, color: 'rgb(35,97,105)' },
    { name: 'Infernal', value: dragonStats.infernal, color: 'rgb(143,40,20)' },
    { name: 'Mountain', value: dragonStats.mountain, color: 'rgb(108,76,42)' },
    { name: 'Cloud', value: dragonStats.cloud, color: 'rgb(207,207,211)' },
    { name: 'Hextech', value: dragonStats.hextech, color: 'rgb(47,143,182)' },
    { name: 'Chemtech', value: dragonStats.chemtech, color: 'rgb(102,177,90)' },
    { name: 'Elder', value: dragonStats.elder, color: 'rgb(7,20,33)' }
  ];

  const totalDragons = dragonStats.ocean + dragonStats.elder + dragonStats.cloud + dragonStats.hextech + dragonStats.chemtech + dragonStats.mountain + dragonStats.infernal;

  return (
    <BaseRisenBox sx={{ minWidth: 280, minHeight: 280, flexGrow: 1, background: getGradient(theme.palette.risenBoxBg.main) }} title="Dragons">
      <PieChart width={260} height={220} style={{ margin: 'auto' }}>
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={95}
          cx={'50%'}
          cy={'50%'}
          blendStroke={true}
          dataKey={'value'}>
          <Label value={totalDragons}
            position="centerBottom"
            className='label-top'
            style={{ fill: theme.palette.info.dark, fontSize: '35px' }}/>
          <Label value={'Total Dragons'}
            position="centerTop"
            className='label'
            style={{ fill: theme.palette.info.dark }}/>
          {
            data.map((entry, index) => <Cell key={index} fill={entry.color}/>)
          }
        </Pie>
        <Tooltip/>
      </PieChart>
    </BaseRisenBox>
  );
}

function buildDragonStats(games: PlayerGameModel[]) {
  let ocean = 0;
  let mountain = 0;
  let cloud = 0;
  let infernal = 0;
  let hextech = 0;
  let chemtech  = 0;
  let elder = 0;

  for(let game of games) {
    ocean += game.oceanDragonKills;
    mountain += game.mountainDragonKills;
    cloud += game.cloudDragonKills;
    infernal += game.infernalDragonKills;
    hextech += game.hextechDragonKills;
    chemtech  += game.chemtechDragonKills;
    elder += game.elderDragonKills;
  }
  return { ocean, mountain, cloud, infernal, hextech, chemtech, elder };
}