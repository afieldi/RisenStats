import React, { useRef, useState } from 'react';
import { Container, Box, Grid, Button } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SearchPlayers } from '../../api/player';

export default function SearchPage() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const latestRequestId = useRef(0);
  const highlightedRef = useRef<string | null>(null);

  const fetchSuggestions = (query: string) => {
    clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setOptions([]);
      return;
    }
    const requestId = ++latestRequestId.current;
    debounceRef.current = setTimeout(async () => {
      const result = await SearchPlayers(query);
      if (requestId === latestRequestId.current) {
        setOptions(result.players.map(p => p.tag ? `${p.name}#${p.tag}` : p.name));
      }
    }, 300);
  };

  function searchName(value?: string) {
    const playerName = (value ?? inputValue).replaceAll('#', '-');
    navigate(`/player/${encodeURIComponent(playerName)}`);
  }

  return (
    <Container className="full-height full-width" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <img src="/images/logos/risen.png" style={{ width: '70%' }} />
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={10}>
              <Autocomplete
                freeSolo
                disableClearable
                options={options}
                inputValue={inputValue}
                filterOptions={(x) => x}
                onHighlightChange={(_, option) => {
                  highlightedRef.current = option as string | null;
                }}
                onInputChange={(_, value, reason) => {
                  if (reason === 'input') {
                    setInputValue(value);
                    fetchSuggestions(value);
                  }
                }}
                onChange={(_, value) => {
                  if (value) searchName(value as string);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Summoner Name"
                    variant="outlined"
                    sx={{ width: '80%' }}
                    inputProps={{
                      ...params.inputProps,
                      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          if (highlightedRef.current) {
                            (params.inputProps as any).onKeyDown?.(e);
                          } else {
                            searchName(inputValue);
                          }
                        } else {
                          (params.inputProps as any).onKeyDown?.(e);
                        }
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Button variant='outlined' onClick={() => searchName()} sx={{ width: '80%', height: '4em' }}>Search</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
