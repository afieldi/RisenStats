import React, { useEffect, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import { GetPlayerSeasons } from '../../api/player';
import { LoadingData } from '../../common/types';
import Loading from '../loading/loading';
import BaseRisenBox from '../risen-box/base-risen-box';
import SeasonModel from '../../../../Common/models/season.model';

interface PlayedSeasonsProps {
  setSeason: (seasonId: string) => void;
  playerPuuid: string | undefined;
  allSeasons: SeasonModel[],
}

export default (props: PlayedSeasonsProps) => {
  const {
    playerPuuid,
    setSeason,
    allSeasons,
  } = props;

  const [seasons, setSeasons] = useState<LoadingData<string[]>>({ loading: true });

  const seasonMap = useMemo(() => {
    const data: {[key: string]: string} = {};
    allSeasons.forEach(season => data[season.id] = season.seasonName);
    return data;
  }, [allSeasons]);

  useEffect(() => {
    if (playerPuuid) {
      GetPlayerSeasons(playerPuuid).then(response => setSeasons({
        loading: false,
        data: response.seasons,
      }));
    }
  }, [playerPuuid]);
  return (
    <BaseRisenBox title={'Seasons'}>
      {
        seasons.loading ? <Loading /> : (
          seasons.data?.map(season => (
            <>
              <Typography textAlign='left'>{seasonMap[season]}</Typography>
              <hr></hr>
            </>
          ))
        )
      }
    </BaseRisenBox>
  );
};