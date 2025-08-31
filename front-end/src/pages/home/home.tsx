import { Box, Button, Container, Grid, Hidden, InputBase, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import React, { KeyboardEvent } from 'react';
import DiscordAnnouncements from '../../components/discord-announcements/discord-announcements';

interface AngleBoxProps {
  dark: String,
  light: String
}

const AngleBox = styled(Box)((theme: AngleBoxProps) => ({
  'height': '100vh',
  'width': '34%',
  'transition': '.5s',
  'transform': 'skewX(-10deg)',
  'display': 'flex',
  'flex-direction': 'column',
  'justify-content': 'center',
  'background-position': 'center',
  'background-repeat': 'repeat-y',
  'filter': 'grayscale(30%)',
  '&:hover': {
    'filter': 'grayscale(0%)',
    'color': 'white',
    'width': '50%',
    'cursor': 'pointer',
  },
  'background-image': `linear-gradient(321deg, ${theme.dark} 0%, ${theme.light} 74%)`
}));

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
  'leagues': '/leagues',
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
    <Box className="full-height full-width" sx={{ overflow: 'hidden' }}>
      <Hidden mdDown>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <AngleBox light={theme.palette.primary.main} dark={theme.palette.primary.dark} sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.info.light }} onClick={() => goTo('leaderboard')}>
            <Typography fontFamily="Montserrat" variant="h3">LEADERBOARDS</Typography>
          </AngleBox>
          <AngleBox light={theme.palette.secondary.main} dark={theme.palette.secondary.dark} theme={{ dark: theme.palette.primary.main, light: theme.palette.info.light }} sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.info.light }} onClick={() => goTo('search')}>
            <Typography fontFamily="Montserrat" variant="h3">PLAYER STATS</Typography>
          </AngleBox>
          <AngleBox light={theme.palette.websiteBackground.main} dark={theme.palette.websiteBackground.dark} theme={theme.palette.primary.main} sx={{ backgroundColor: 'black', color: theme.palette.info.light }} onClick={() => goTo('leagues')}>
            <Typography fontFamily="Montserrat" variant="h3">LEAGUE STATS</Typography>
          </AngleBox>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Container>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', pt: 3 }}>
              <img src="/images/logos/risen.png" style={{ width: '70%' }}></img>
            </Box>
            <MobileBox variant='outlined' onClick={() => goTo('leaderboard')}>
              <Typography fontFamily="Montserrat" variant="h5">LEADERBOARDS</Typography>
            </MobileBox>
            <MobileBox variant='outlined' onClick={() => goTo('search')}>
              <Typography fontFamily="Montserrat" variant="h5">PLAYER STATS</Typography>
            </MobileBox>
            <MobileBox variant='outlined' onClick={() => goTo('leagues')}>
              <Typography fontFamily="Montserrat" variant="h5">LEAGUE STATS</Typography>
            </MobileBox>
          </Box>
        </Container>
      </Hidden>
      <Container>
        <DiscordAnnouncements />
      </Container>
    </Box>
  );
}