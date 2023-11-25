import React from 'react';
import { Box, Typography } from '@mui/material';
import ImgBox from '../risen-box/img-box';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';
import { roundTo } from '../../../../Common/utils';

export interface PlayerChampBannerItem {
  stats: AggregatedPlayerStatModel;
  championPortraitId: number;
}

export interface PlayerChampBanners {
  top: PlayerChampBannerItem;
  jungle: PlayerChampBannerItem;
  mid: PlayerChampBannerItem;
  bot: PlayerChampBannerItem;
  supp: PlayerChampBannerItem;
}

interface IndividualBoxProps {
  roleInfo: PlayerChampBannerItem;
  position: string;
}

export default function PlayerChampBanner(props: PlayerChampBanners) {
  const IndividualBox = ({ roleInfo, position }: IndividualBoxProps) => {
    const {
      championPortraitId,
      stats,
    } = roleInfo;
    return (
      <Box sx={{ height: 500 }}>
        <Box>
          <Typography align='left' fontFamily="Montserrat">{position}</Typography>
        </Box>
        <Box sx={{ height: 300, overflow: 'hidden', width: 190, clipPath: 'polygon(0 0, 75% 0, 100% 100%, 25% 100%)', backgroundImage: `url(/images/champions/profile/${championPortraitId}_0.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Box>
          <Typography align='right' fontFamily="Montserrat">{stats.player.name}</Typography>
          <Typography align='right' fontFamily="Montserrat">{stats.kills}/{stats.deaths}/{stats.assists}</Typography>
          <Typography align='right'>{roundTo(stats.damagePerMinute / stats.games, 0)} DPM</Typography>
          <Typography align='right'>{roundTo(stats.goldPerMinute / stats.games, 0)} GPM</Typography>
          <Typography align='right'>{roundTo(stats.visionScorePerMinute / stats.games, 1)} VSPM</Typography>
          <Typography align='right'>{stats.games} games</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', pl: 3 }}>
        <IndividualBox roleInfo={props.top} position='Top'/>
        <IndividualBox roleInfo={props.jungle} position='Jungle'/>
        <IndividualBox roleInfo={props.mid} position='Middle'/>
        <IndividualBox roleInfo={props.bot} position='Bottom'/>
        <IndividualBox roleInfo={props.supp} position='Support'/>
      </Box>
    </Box>
  );
}