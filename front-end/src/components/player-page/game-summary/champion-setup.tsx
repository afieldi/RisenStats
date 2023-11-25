import PlayerGameModel from '../../../../../Common/models/playergame.model';
import { Box, Typography } from '@mui/material';
import { GameTypeToString, getSeasonWithLeaguePage } from '../../../../../Common/utils';
import React from 'react';
import SeasonModel from '../../../../../Common/models/season.model';
import ImgBox from '../../risen-box/img-box';
import { useNavigate } from 'react-router-dom';

interface ChampionSetupProps {
    mainPlayer: PlayerGameModel
    gameType: number,
    seasonId: number,
    seasons: SeasonModel[],
}

function ChampionSetup(championSetupProps: ChampionSetupProps) {

  const navigate = useNavigate();

  const {
    mainPlayer,
    gameType,
    seasonId,
    seasons,
  } = championSetupProps;

  const season = getSeasonWithLeaguePage(championSetupProps.seasons, championSetupProps.seasonId?.toString());

  const onClickSeasonName = () => {
    if (!season) {
      return;
    }
    navigate(`/leagues/${season.searchname}`);
  };

  return <Box sx={{ pr: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Box sx={{ display: 'inline-flex' }}>
      <ImgBox
        sx={{ height:50, width: 50, overflow: 'hidden', mr: 1 }}
        alt={`${mainPlayer.championId}`}
        src={`/images/champions/icons/${mainPlayer.championId}_0.png`}
        height="50px"
        width="50px"
        text={mainPlayer.champLevel.toString()}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <img src={`/images/summoner/${mainPlayer.summoner1Id}.png`}
          alt={`${mainPlayer.summoner1Id}`}
          height="25px"
          width="25px"/>
        <img src={`/images/summoner/${mainPlayer.summoner2Id}.png`}
          alt={`${mainPlayer.summoner2Id}`}
          height="25px"
          width="25px"/>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', pl: .4 }}>
        <img src={`/images/runes/${mainPlayer.primaryRunes[0]}.png`}
          alt={`${mainPlayer.primaryRunes[0]}`}
          height="25px"
          width="25px"/>
        <img src={`/images/runes/${mainPlayer.secondaryStyle}.png`}
          alt={`${mainPlayer.secondaryStyle}`}
          height="25px"
          width="25px"/>
      </Box>
    </Box>
    <Box className={season ? 'clickable' : ''} onClick={onClickSeasonName}>
      <Typography variant="body2" sx={{ fontSize: '12px', maxWidth: '115px', pt: 1 }} align="center">
        {GameTypeToString(gameType, seasonId, seasons)}
      </Typography>
    </Box>
  </Box>;
}

export default ChampionSetup;