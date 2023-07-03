import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UpdatePlayer } from '../../api/player';
import { Box, Container, Hidden, Typography } from '@mui/material';
import LoadingButton from '../loading-button/LoadingButton';

interface LeaguePageHeaderProps {
    name: string;
}
export default function LeaguePageHeader(props: LeaguePageHeaderProps)
{
  return (
    <Container sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'inline-flex', alignItems: 'flex-start' }}>
        <Box sx={{ flexGrow: 1, pl: 2, textAlign: 'left' }}>
          <Hidden smDown>
            <Typography fontFamily="Montserrat" variant="h3" className="text-overflow">{props.name}</Typography>
          </Hidden>
        </Box>
      </Box>
    </Container>
  );
}