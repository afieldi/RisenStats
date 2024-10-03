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
import { GetActiveSeasons } from '../../api/season';
import RisenSeasonSelector from '../../components/selectors/risen-season-selector';

export default function AdminCodes() {
  const theme = useTheme();
  const [numberOfMatches, setNumberOfMatches] = useState<number>(0);
  const [bestOf, setBestOf] = useState<number>(3);
  const [risenSeason, setRisenSeason] = useState<string>('');
  const [risenSeasons, setRisenSeasons] = useState<SeasonModel[]>([]);
  const [error, setError] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<CodeModel[]>([]);

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
        console.log(generatedCodes);
      });
    }
    else {
      setError(true);
    }
  };
  return (
    <Container maxWidth='lg'>
      <Box sx={{ pt: 15, pb: 6, minHeight: '100vh' }}>
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
                            <TableCell>{generatedCodes[(numberOfMatches * rowIndex) + colIndex]?.code}</TableCell>
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
    </Container>
  );
};