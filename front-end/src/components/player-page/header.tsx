import { useTheme } from "@emotion/react";
import { Box, Button, CardHeader, Grid, Hidden, Theme } from "@mui/material";
import { Card } from "@mui/material";
import { Typography } from "@mui/material";
import { Container } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlayerOverviewResponse } from "../../../../Common/Interface/Internal/player";
import { UpdatePlayer } from "../../api/player";
import LoadingButton from "../loading-button/LoadingButton";

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

  const playerIcon = playerOverviewProps.playerOverview?.overview?.profileIconId ? playerOverviewProps.playerOverview?.overview?.profileIconId : 10;
  return (
    <Container sx={{display: 'flex', alignItems: 'flex-start'}}>
      <Box sx={{display: 'inline-flex', alignItems: 'flex-start'}}>
        <img src={`https://ddragon.leagueoflegends.com/cdn/12.19.1/img/profileicon/${playerIcon}.png`} className="player-profile-picture"></img>
        <Box sx={{flexGrow: 1, pl: 2, textAlign: 'left'}}>
          <Hidden mdUp>
            <Typography variant="h5">{playerOverviewProps.playerOverview?.overview?.name}</Typography>
          </Hidden>
          <Hidden smDown>
            <Typography variant="h3" className="text-overflow">{playerOverviewProps.playerOverview?.overview?.name}</Typography>
          </Hidden>
          {/* <br></br> */}
          <LoadingButton variant="outlined" color="primary" onClick={updateGames} loading={loading}>Update</LoadingButton>
        </Box>
      </Box>
    </Container>
  )
}