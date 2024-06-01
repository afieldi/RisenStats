import { Box, Container, Hidden, Typography } from '@mui/material';
import React from 'react';

interface TeamPageHeaderProps {
    teamName?: string;
    teamAbbr?: string;
}
export default function TeamPageHeader(props: TeamPageHeaderProps)
{
  return (
    <Container sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'inline-flex', alignItems: 'flex-start' }}>
        <Box sx={{ flexGrow: 1, pl: 0, textAlign: 'left', }}>
          <Hidden smDown>
            <Typography fontFamily="Montserrat" variant="h2" className="text-overflow">{props.teamName} [{props.teamAbbr}]</Typography>
          </Hidden>
        </Box>
      </Box>
    </Container>
  );
}