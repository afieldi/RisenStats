import { useTheme } from "@emotion/react";
import { Box, Button, CardHeader, Grid, Theme } from "@mui/material";
import { Card } from "@mui/material";
import { Typography } from "@mui/material";
import { Container } from "@mui/material";
import React from "react";
import LoadingButton from "../loading-button/LoadingButton";

interface Props {
  playerName: string;
}

export default function PlayerPageHeader({playerName}: Props)
{
  const theme = useTheme() as Theme;
  const [loading, setLoading] = React.useState(false);
  // const router = useRouter();
  function updateGames()
  {
    setLoading(true);
    fetch(`/api/${playerName}/update`, {
      method: "POST"
    }).then(() => {}, (err) => {alert(err); setLoading(false)});
  }
  return (
    <Container>
      <Box sx={{display: 'inline-flex'}}>
        <img src="https://ddragon.leagueoflegends.com/cdn/12.3.1/img/profileicon/4568.png" style={{height: '125px'}}></img>
        <Box  sx={{flexGrow: 1, pl: 2}}>
          <Typography variant="h3">{playerName}</Typography>
          <br></br>
          <LoadingButton variant="outlined" color="warning" onClick={updateGames} loading={loading}>Update</LoadingButton>
        </Box>
      </Box>
    </Container>
  )
}