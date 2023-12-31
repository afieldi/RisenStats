import { useTheme } from '@emotion/react';
import { Box, Button, CardHeader, Grid, Hidden, Theme } from '@mui/material';
import { Card } from '@mui/material';
import { Typography } from '@mui/material';
import { Container } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerOverviewResponse } from '../../../../Common/Interface/Internal/player';
import { UpdatePlayer } from '../../api/player';
import LoadingButton from '../loading-button/LoadingButton';
import { splitNameTagLine } from '../../../../Common/utils';

interface Props {
  playerOverview: PlayerOverviewResponse | undefined;
  onUpdate: () => void;
}

export default function PlayerPageHeader(playerOverviewProps: Props)
{
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  function updateGames()
  {
    if (playerOverviewProps.playerOverview) {
      setLoading(true);
      playerOverviewProps.onUpdate();
      UpdatePlayer(playerOverviewProps.playerOverview.overview.puuid).then(() => {setLoading(false); navigate('./'); }, (err) => {alert(err); setLoading(false);});
    }
  }

  const name = playerOverviewProps.playerOverview?.overview?.name;
  const tag = playerOverviewProps.playerOverview?.overview?.tag;
  const playerIcon = playerOverviewProps.playerOverview?.overview?.profileIconId ? playerOverviewProps.playerOverview?.overview?.profileIconId : 10;
  return (
    <Container sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'inline-flex', alignItems: 'flex-start' }}>
        <img src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${playerIcon}.png`} className="player-profile-picture"></img>
        <Box sx={{ flexGrow: 1, pl: 2, textAlign: 'left' }}>
          <Hidden mdUp>
            <Typography variant="h5">{name}</Typography><Typography variant="h6">#{tag}</Typography>
          </Hidden>
          <Hidden smDown>
            <div>
              <Typography fontFamily="Montserrat" variant="h3" className="text-overflow inline-flex">{name}</Typography>
              <Typography fontFamily="Montserrat" variant="h5" className="text-overflow inline-flex">#{tag}</Typography>
            </div>
          </Hidden>
          {/* <br></br> */}
          <LoadingButton variant="outlined" color="primary" onClick={updateGames} loading={loading}>Update</LoadingButton>
        </Box>
      </Box>
    </Container>
  );
}