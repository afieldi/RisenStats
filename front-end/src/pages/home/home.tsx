import { Box, Button, Container, Grid, Hidden, Typography, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import React, { KeyboardEvent } from 'react';

const AngleBox = styled(Box)`
  height: 100vh;
  width: 34%;
  transition: .5s;
  transform: skewX(-10deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-position: center;
  background-repeat: repeat-y;
  filter: grayscale(30%);
  &:hover {
    filter: grayscale(0%);
    color: white;
    width: 50%;
    cursor: pointer;
  }
`;

const MobileBox = styled(Button)`
  margin-top: 10px;
  padding: 40px;
  &:hover {
    cursor: pointer;
  }
`;

const directory = {
  'leaderboard': '/leaderboard',
  'search': '/search',
  'discord': 'https://discord.com/invite/BwnnBsV',
};

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();

  function goTo(location: keyof typeof directory) {
    const newUrl = directory[location];
    if (newUrl.startsWith('http')) {
      window.location.href = newUrl;
    }
    else {
      navigate(newUrl);
    }
  }
  return (
    <Box className="full-height full-width" sx={{overflow: 'hidden'}}>
      <Hidden mdDown>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <AngleBox sx={{backgroundColor: theme.palette.primary.main, color: theme.palette.info.light}} onClick={() => goTo('leaderboard')}>
            <Typography fontFamily="Montserrat" variant="h3">LEADERBOARDS</Typography>
          </AngleBox>
          <AngleBox sx={{backgroundColor: theme.palette.secondary.main, color: theme.palette.info.light}} onClick={() => goTo('search')}>
            <Typography fontFamily="Montserrat" variant="h3">PLAYER STATS</Typography>
          </AngleBox>
          <AngleBox sx={{backgroundColor: 'black', color: theme.palette.info.light}} onClick={() => goTo('discord')}>
            <Typography fontFamily="Montserrat" variant="h3">DISCORD</Typography>
          </AngleBox>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Container>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', pt: 3}}>
              <img src="/images/logos/risen.png" style={{width: '70%'}}></img>
            </Box>
            <MobileBox variant='outlined' onClick={() => goTo('leaderboard')}>
              <Typography fontFamily="Montserrat" variant="h5">LEADERBOARDS</Typography>
            </MobileBox>
            <MobileBox variant='outlined' onClick={() => goTo('search')}>
              <Typography fontFamily="Montserrat" variant="h5">PLAYER STATS</Typography>
            </MobileBox>
            <MobileBox variant='outlined' onClick={() => goTo('discord')}>
              <Typography fontFamily="Montserrat" variant="h5">DISCORD</Typography>
            </MobileBox>
          </Box>
        </Container>
      </Hidden>
    </Box>
  )
}