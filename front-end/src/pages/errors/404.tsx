import { Box, Container, Typography } from '@mui/material';
import React from 'react';

export default function Error404() {
  return (
    <Container sx={{ pt: 15, color: 'white' }} className="full-height">
      <Box>
        <img src={'/images/logos/blitz_question.png'}></img>
      </Box>
      <Typography variant="h1">
        404 Not Found
      </Typography>
    </Container>
  );
}