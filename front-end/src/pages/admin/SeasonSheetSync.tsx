import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Alert,
  CircularProgress
} from '@mui/material';
import SeasonModel from '../../../../Common/models/season.model';
import { GetActiveSeasons, updateSeasonGoogleSheetId } from '../../api/season';
import { buildRisenTeams } from '../../api/teams';
import RisenSeasonSelector from '../../components/selectors/risen-season-selector';

export default function SeasonSheetSync() {
  const theme = useTheme();
  
  const [seasons, setSeasons] = useState<SeasonModel[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');
  const [googleSheetId, setGoogleSheetId] = useState<string>('');
  
  // Submit status
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Validation status
  const [validateMessage, setValidateMessage] = useState<string>('');
  const [validateSuccess, setValidateSuccess] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  useEffect(() => {
    GetActiveSeasons().then(response => {
      if (response && response.seasons) {
        setSeasons(response.seasons);
      }
    }).catch(err => {
      console.error('Failed to load active seasons', err);
    });
  }, []);

  const handleSeasonChange = (event: any) => {
    const val = event.target.value;
    setSelectedSeasonId(val);
    
    // Find the season model to populate Google Sheet ID
    const season = seasons.find(s => s.id === Number(val));
    setGoogleSheetId(season?.googleSheetId || '');
    
    // Reset messages
    setSubmitMessage('');
    setSubmitSuccess(null);
    setValidateMessage('');
    setValidateSuccess(null);
  };

  const onSubmit = async () => {
    if (!selectedSeasonId) {
      setSubmitSuccess(false);
      setSubmitMessage('Please select a season first.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitSuccess(null);

    try {
      const response = await updateSeasonGoogleSheetId(Number(selectedSeasonId), googleSheetId);
      if (response && response.success) {
        setSubmitSuccess(true);
        setSubmitMessage('Google Sheet ID updated successfully!');
        
        // Update local seasons cache
        setSeasons(prev =>
          prev.map(s => (s.id === Number(selectedSeasonId) ? { ...s, googleSheetId } as SeasonModel : s))
        );
      } else {
        setSubmitSuccess(false);
        setSubmitMessage('Failed to update Google Sheet ID.');
      }
    } catch (err: any) {
      setSubmitSuccess(false);
      setSubmitMessage(err.message || 'An error occurred while updating.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onValidate = async () => {
    if (!selectedSeasonId) {
      setValidateSuccess(false);
      setValidateMessage('Please select a season first.');
      return;
    }

    setIsValidating(true);
    setValidateMessage('');
    setValidateSuccess(null);

    try {
      const response = await buildRisenTeams(Number(selectedSeasonId));
      if (response && response.success) {
        setValidateSuccess(true);
        setValidateMessage('Teams and rosters built successfully!');
      } else {
        setValidateSuccess(false);
        setValidateMessage('Build call succeeded but returned failure status.');
      }
    } catch (err: any) {
      setValidateSuccess(false);
      setValidateMessage(err.message || 'An error occurred during verification/build.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Box sx={{ pt: 6, pb: 6 }}>
      <Typography fontFamily="Montserrat" variant="h1" color={theme.palette.info.light} sx={{ mb: 2 }}>
        Setup Google Sheet For Season
      </Typography>
      <hr />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3, maxWidth: '600px' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <RisenSeasonSelector
            callBack={handleSeasonChange}
            seasonConfig={{
              seasons: seasons,
              seasonId: selectedSeasonId,
              setSeasonId: setSelectedSeasonId,
            }}
            sx={{
              minWidth: '250px',
            }}
            hideAllGames
            hideAllRisenGames
          />
          
          <TextField
            label="Google Sheet ID"
            placeholder="Enter google sheet ID"
            value={googleSheetId}
            onChange={(e) => setGoogleSheetId(e.target.value)}
            fullWidth
            disabled={!selectedSeasonId}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={!selectedSeasonId || isSubmitting}
            sx={{ minWidth: '120px' }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={onValidate}
            disabled={!selectedSeasonId || isValidating}
            sx={{ minWidth: '120px' }}
          >
            {isValidating ? <CircularProgress size={24} color="inherit" /> : 'Validate / Build'}
          </Button>
        </Box>

        {submitMessage && (
          <Alert severity={submitSuccess ? 'success' : 'error'} sx={{ mt: 1 }}>
            {submitMessage}
          </Alert>
        )}

        {validateMessage && (
          <Alert severity={validateSuccess ? 'success' : 'error'} sx={{ mt: 1 }}>
            {validateMessage}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
