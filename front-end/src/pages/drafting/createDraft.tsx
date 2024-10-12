import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import { Container } from '@mui/system';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateDraft } from '../../api/drafting';

export default function() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [blueTeamName, setBlueTeamName] = useState<string>('');
  const [redTeamName, setRedTeamName] = useState<string>('');

  const onDraftClick = async() => {
    if (blueTeamName && redTeamName) {
      const draftData = await CreateDraft({
        redTeamName,
        blueTeamName,
      });
      navigate(`/drafting/links/${draftData.room}/${draftData.blueAuth}/${draftData.redAuth}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', color: theme.palette.text.primary, pt: 10 }}>
      <Box>
        <Typography variant='h2'>Create Draft</Typography>
      </Box>

      <Box>
        <Typography variant='h4'>Blue Team Name</Typography>
        <TextField
          type='text'
          placeholder='Blue team'
          label='Blue team'
          value={blueTeamName}
          color='secondary'
          onChange={(event) => setBlueTeamName(event.target.value)}
        />
      </Box>

      <Box>
        <Typography variant='h4'>Red Team Name</Typography>
        <TextField
          type='text'
          placeholder='Red team'
          label='Red team'
          value={redTeamName}
          onChange={(event) => setRedTeamName(event.target.value)}
        />
      </Box>

      <Button variant='outlined' onClick={onDraftClick}>
        Create Draft
      </Button>
    </Container>
  );
}