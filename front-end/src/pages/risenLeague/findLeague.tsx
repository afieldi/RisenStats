import React, { useEffect, useState } from 'react';
import { Container, Box, Grid, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SeasonModel from '../../../../Common/models/season.model';
import { GetAllSeasons } from '../../api/season';

export default function FindLeague() {
  const navigate = useNavigate();

  const [seasons, setSeasons] = useState<SeasonModel[]>([]);


  function navigateToLeaguePage(seasonSearchName: string) {
    navigate(`/leagues/${seasonSearchName}`);
  }

  async function loadSeasons() {
    try {
      setSeasons((await GetAllSeasons()).seasons);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadSeasons();
  }, []);

  const seasonsWithLeaguePage = seasons.filter(season => season.active)
    .filter(season => season.googleSheetId != null)
    .sort((a,b) => a.id > b.id ? 1 : -1); // Always display in the same order no matter how it returned from the DB

  return (
    <Container className="full-height full-width" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <img src="/images/logos/risen.png" style={{ width: '70%' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', columnGap: '10px' }}>
          {
            seasonsWithLeaguePage.map((season) => {
              return (
                <Button variant='outlined' onClick={ () => navigateToLeaguePage(season.seasonName)} sx={{ width: '80%', height: '5em' }}>{season.seasonName}</Button>
              );
            })
          }
        </Box>
      </Box>
    </Container>
  );
};