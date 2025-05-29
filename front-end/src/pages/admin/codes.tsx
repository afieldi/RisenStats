import {
  Box,
  Button,
  Container, Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CodeModel from '../../../../Common/models/code.model';
import SeasonModel from '../../../../Common/models/season.model';
import { GenerateCodes } from '../../api/codes';
import { createSeason, GetActiveSeasons } from '../../api/season';
import RisenSeasonSelector from '../../components/selectors/risen-season-selector';

export default function AdminCodes() {
  const theme = useTheme();
  const [numberOfMatches, setNumberOfMatches] = useState<number>(0);
  const [bestOf, setBestOf] = useState<number>(3);
  const [risenSeason, setRisenSeason] = useState<string>('');
  const [risenSeasons, setRisenSeasons] = useState<SeasonModel[]>([]);
  const [error, setError] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<CodeModel[]>([]);
  const [newRisenSeasonName, setNewRisenSeasonName] = useState<string>('');
  const [newRisenSeasonCreationMessage, setNewRisenSeasonCreationMessage] = useState<string>('');

  useEffect(() => {
    GetActiveSeasons().then(seasons => {
      setRisenSeasons(seasons.seasons);
    });
  }, []);

  const onGenerateCodes = () => {
    if (numberOfMatches > 0 && bestOf > 0 && risenSeason) {
      setError(false);
      GenerateCodes(numberOfMatches * bestOf, risenSeason).then(response => {
        setGeneratedCodes(response.codes);
      });
    }
    else {
      setError(true);
    }
  };

  const onGenerateSeason = () => {
    setNewRisenSeasonCreationMessage('');
    if(!(/^[a-zA-Z0-9 ]+$/.test(newRisenSeasonName))) {
      setNewRisenSeasonCreationMessage('Season must be alpha Numeric');
      return;
    }

    if(newRisenSeasonName.length < 5) {
      setNewRisenSeasonCreationMessage('Season name must be longer than 5 characters');
      return;
    }

    createSeason(newRisenSeasonName).then(response => {
      if(response == null || response.season == null) {
        setNewRisenSeasonCreationMessage('Season response was null or season was null');
      } else {
        setNewRisenSeasonCreationMessage(`Created season with name ${response.season.seasonName} and Id ${response.season.id}`);
      }
    });
  };

  return (
    <Container maxWidth='lg'>
      <Box sx={{ pt: 15, pb: 6, minHeight: '50vh' }}>
        <Typography fontFamily="Montserrat" variant="h1" color={theme.palette.info.light}>
          Create Codes
        </Typography>
        <Box sx={{ display: 'flex', columnGap: 1 }}>
          <RisenSeasonSelector
            callBack={(event) => setRisenSeason(event.target.value)}
            seasonConfig={{
              seasons: risenSeasons,
              seasonId: risenSeason,
              setSeasonId: setRisenSeason,
            }}
            sx={{
              minWidth: '300px',
            }}
            error={error}
            hideAllGames
            hideAllRisenGames
          />
          <TextField
            type='number'
            placeholder='Number of matches'
            label='Number of matches'
            value={numberOfMatches}
            error={error}
            onChange={(event) => setNumberOfMatches(Number(event.target.value))}
          />
          <TextField
            type='number'
            placeholder='Best of'
            label='Best of'
            value={bestOf}
            error={error}
            onChange={(event) => setBestOf(Number(event.target.value))}
          />
          <Button variant={'contained'} onClick={onGenerateCodes}>
            Generate Codes
          </Button>
        </Box>
        <hr />
        <Box color={theme.palette.info.light}>
          <Typography fontFamily="Montserrat" variant="h3">
            Create Codes
          </Typography>
          {
            generatedCodes.length > 0 && (
              <TableContainer component={Paper}>
                <Table>
                  {
                    [...Array(numberOfMatches)].map((_, rowIndex) => (
                      <TableRow>
                        {
                          [...Array(bestOf)].map((_, colIndex) => (
                            <TableCell>{generatedCodes[(bestOf * rowIndex) + colIndex]?.code}</TableCell>
                          ))
                        }
                      </TableRow>
                    ))
                  }
                </Table>
              </TableContainer>
            )
          }
        </Box>
      </Box>
      <Box sx={{ pt: 15, pb: 6, minHeight: '50vh' }}>
        <Typography fontFamily="Montserrat" variant="h1" color={theme.palette.info.light}>
          Create Season
        </Typography>
        <hr />
        <TextField
          label="New Season Name"
          placeholder="Enter new season name"
          value={newRisenSeasonName}
          onChange={(event) => setNewRisenSeasonName(event.target.value)}
          sx={{ mt: 2, mb: 2 }}
          fullWidth
        />

        <Button variant={'contained'} onClick={onGenerateSeason}>
          Generate Season
        </Button>

        {newRisenSeasonCreationMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {newRisenSeasonCreationMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
};