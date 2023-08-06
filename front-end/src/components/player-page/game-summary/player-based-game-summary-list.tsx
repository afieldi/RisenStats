import React from 'react';
import { Container, Box, Button, SxProps, Theme } from '@mui/material';
import PlayerBasedGameSummary from './player-based-game-summary';
import GameModel from '../../../../../Common/models/game.model';
import { PlayerDetailedGame, PlayerOverviewResponse } from '../../../../../Common/Interface/Internal/player';
import LoadingButton from '../../loading-button/LoadingButton';
import SeasonModel from '../../../../../Common/models/season.model';

interface Props
{
  gameList: PlayerDetailedGame[];
  loadGamesConfig: {
    callback: (newPlayer: boolean) => void,
    status: boolean
  };
  seasons: SeasonModel[];
  sx?: SxProps<Theme>;
}

function PlayerBasedGameSummaryList({ gameList, loadGamesConfig, seasons, sx }: Props)
{
  if (!gameList) { gameList = []; }
  return (
    <Container sx={{ pr: 0, pl: 0, ...sx }}>
      {gameList.map((game, i) => {
        return (
          <PlayerBasedGameSummary key={`game-${i}`} gameData={game} seasons={seasons}></PlayerBasedGameSummary>
        );
      })}
      <Box>
        <LoadingButton color="primary" onClick={() => {loadGamesConfig.callback(false);}} loading={loadGamesConfig.status}>Load More</LoadingButton>
      </Box>
    </Container>
  );
}

export default PlayerBasedGameSummaryList;