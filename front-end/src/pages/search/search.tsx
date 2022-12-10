import React from "react";
import { Container, Box, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchField2 from "../../components/search-field/search-field2";

export default function SearchPage() {
  const navigate = useNavigate();
  const playerSearchFieldId = 'playerSearch';

  function searchName() {
    const playerName = (document.getElementById(playerSearchFieldId) as HTMLInputElement).value;
    navigate(`/player/${encodeURIComponent(playerName)}`)
  }
  return (
    <Container className="full-height full-width" sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <img src="/images/logos/risen.png" style={{width: '70%'}}></img>
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={10}>
              <SearchField2 id={playerSearchFieldId} placeholder='Summoner Name' sx={{width: '80%'}} onSubmit={searchName}></SearchField2>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Button variant='outlined' onClick={searchName} sx={{width: '80%', height: '4em'}}>Search</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
};