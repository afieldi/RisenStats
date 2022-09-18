import { Box, Container } from '@mui/material';
import { useNavigate } from "react-router-dom";
import React, { KeyboardEvent } from 'react';
import SearchField from '../../components/search-field/search-field';
import SearchField2 from '../../components/search-field/search-field2';
import { toSearchName } from '../../../../Common/utils';

export default function Home() {
  const navigate = useNavigate();

  function searchName(event: KeyboardEvent<HTMLInputElement>) {
    const playerName = event.target.value;
    navigate(`player/${encodeURIComponent(playerName)}`)
  }
  return (
    <Container className="full-height full-width" sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <img src="/images/logos/risen.png" style={{maxWidth: '500px'}}></img>
        </Box>
        <Box>
          <SearchField2 placeholder='Summoner Name' sx={{width: '500px'}} onSubmit={searchName}></SearchField2>
        </Box>
      </Box>
    </Container>
  )
}