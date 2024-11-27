import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const SideData = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: '10px',
  justifyContent: 'center',
}));

const DisplayRow = ({ side, link }: {side: string, link: string}) => {
  const onOpen = () => {
    window.open(link, '_blank')?.focus();
  };

  const onCopy = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <Box>
      <Box>
        <Typography variant='h4'>{side}</Typography>
      </Box>
      <SideData>
        <Box>
          {link}
        </Box>
        <Button variant='outlined' onClick={onOpen}>
          Open
        </Button>
        <Button variant='outlined' onClick={onCopy}>
          Copy
        </Button>
      </SideData>
    </Box>
  );
};

export default function() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { room, blueAuth, redAuth } = useParams();
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;

  const prePath = `${protocol}//${hostname}${port && (':' + port)}`;

  const onNewDraftClick = () => {
    navigate('/drafting');
  };

  const blueLink = `${prePath}/drafting/${room}/${blueAuth}`;
  const redLink = `${prePath}/drafting/${room}/${redAuth}`;
  const specLink = `${prePath}/drafting/${room}`;
  const onCopy = () => {
    navigator.clipboard.writeText(`Blue Draft: ${blueLink}\nRed Draft: ${redLink}\nSpectator: ${specLink}`);
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', pt: 10, color: theme.palette.text.primary }}>
      <Button onClick={onNewDraftClick} sx={{ mb: 5 }} variant='outlined'>
        New Draft
      </Button>
      <DisplayRow side='Blue' link={blueLink} />
      <DisplayRow side='Red' link={redLink} />
      <DisplayRow side='Spectator' link={specLink} />
      <Button onClick={onCopy} variant='outlined' sx={{ mt: 5 }}>
        Copy all
      </Button>
    </Container>
  );
}