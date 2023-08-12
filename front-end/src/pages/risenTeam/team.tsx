import { useParams } from 'react-router-dom';
import React from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import { Box } from '@mui/system';


function TeamPage() {
  let { leagueName } = useParams();

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh' }}>
      <CssBaseline />
      <main>
        <Box sx={{ pt: 15, pb: 6, }}>
          <Typography fontFamily="Montserrat" variant="h3">Vexrax Still Is Cooking Here</Typography>
          <Typography fontFamily="Montserrat" variant="h4">Come Back Later!</Typography>
          <img src="/images/misc/cooking.png" width="30%" height="30%"></img>
        </Box>
      </main>
    </Container>
  );
}

export default TeamPage;