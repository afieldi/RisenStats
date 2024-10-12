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
  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', pt: 10, color: theme.palette.text.primary }}>
      <Button onClick={onNewDraftClick} variant='outlined'>
        New Draft
      </Button>
      <DisplayRow side='Blue' link={`${prePath}/drafting/${room}/${blueAuth}`} />
      <DisplayRow side='Red' link={`${prePath}/drafting/${room}/${redAuth}`} />
      <DisplayRow side='Spectator' link={`${prePath}/drafting/${room}`} />
    </Container>
  );
}