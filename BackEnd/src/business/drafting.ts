import { Socket } from 'socket.io';
import NodeCache from 'node-cache';
import { draftStepConfig } from '../../../Common/constants';
import { DraftState, TeamDraftState } from '../../../Common/Interface/Internal/drafting';
import { MakeId } from '../../../Common/utils';
import logger from '../../logger';

const gameCache = new NodeCache();
const gameTimers: Record<string, NodeJS.Timer> = {};

const DEFAULT_DRAFT_TIME = 30;

// 0 is spectator, 1 is blue, 2 is red
function getTeam(game: DraftState, auth: string): 'blueTeam' | 'redTeam' {
  if (game.blueTeam.auth === auth) {
    return 'blueTeam';
  }
  else if (game.redTeam.auth === auth) {
    return 'redTeam';
  }
  return null;
}

export function createDraft(blueName: string, redName: string): DraftState {
  const draftState: DraftState = {
    blueTeam: {
      ready: false,
      bans: Array(5).fill('0'),
      picks: Array(5).fill('0'),
      disabledPicks: [],
      auth: MakeId(10),
      displayName: blueName,
    },
    redTeam: {
      ready: false,
      bans: Array(5).fill('0'),
      picks: Array(5).fill('0'),
      disabledPicks: [],
      auth: MakeId(10),
      displayName: redName,
    },
    stage: 0,
    roomId: MakeId(10),
    timerMax: DEFAULT_DRAFT_TIME,
    timerRemaining: DEFAULT_DRAFT_TIME,
    roomActive: false,
  };
  gameCache.set(draftState.roomId, draftState, 60 * 60 * 12); // Keep drafts in memory for 12 hours
  return draftState;
}

export function handleSocketConnection(room: string) {

  if (!gameCache.has(room as string)) {
    logger.error('Tried to join a room that does not exist: ' + room);
    logger.info('Current rooms: ', gameCache.keys());
    this.socket.disconnect();
    return;
  }
  this.socket.join(room);
  logger.info(`New joiner to room: ${room}`);
  this.socket.emit('draftUpdate', gameCache.get(room as string));
}

export function handleDraftHover(room: string, auth: string, pick: string, stage: number) {
  const game: DraftState = gameCache.get(room);
  logger.info(`Got hover for champion: ${pick}`, stage, game.stage);
  if (!game) {
    logger.error(`Pick made(${pick}) with a room(${room}) not existing`);
    return;
  }
  const pickConfig = draftStepConfig[Number(stage)];

  if (stage < game.stage || getTeam(game, auth) !== pickConfig[0]) {
    // out of date update, ignore
    this.socket.emit('draftUpdate', game);
    return;
  }

  (game[pickConfig[0]])[pickConfig[1]][pickConfig[2]] = pick;

  logger.info('emitting update to ', room);
  gameCache.set(room, game);
  this.server.to(room as string).emit('draftUpdate', game);
}

export function handleReady(room: string, auth: string) {
  logger.info(`Room ${room} is ready: ${auth}`);
  if (!gameCache.has(room)) {
    return;
  }
  const game: DraftState = gameCache.get(room);
  game[getTeam(game, auth)].ready = true;

  console.log(`Blue: ${game.blueTeam.ready}, Red: ${game.redTeam.ready}`);

  if (game.redTeam.ready && game.blueTeam.ready) {
    game.roomActive = true;
    gameTimers[room] = setInterval(handleTimerUpdate.bind({ server: this.server }, room, auth, 0), 1000);
  }
  gameCache.set(room, game);
  this.server.to(room).emit('draftUpdate', game);
}

export function handleUnready(room: string, auth: string) {
  if (!gameCache.has(room)) {
    return;
  }
  logger.info(`Room ${room} is not ready: ${auth}`);
  const game: DraftState = gameCache.get(room);
  game[getTeam(game, auth)].ready = false;
  gameCache.set(room, game);
  this.server.to(room).emit('draftUpdate', game);
}

export function handleDraftPick(room: string, auth: string, stage: number, timeEnd = false) {
  const game: DraftState = gameCache.get(room);
  logger.info('Got draftPick', room, auth, stage);
  if (!game) {
    logger.error(`Timer update for non-existent room(${room})`);
    this.socket.disconnect();
    return;
  }
  const pickConfig = draftStepConfig[Number(stage)];
  if ((game[pickConfig[0]])[pickConfig[1]][pickConfig[2]] === '0' && !timeEnd) {
    return;
  }

  // Reset the timer, increase the draft pick
  game.timerRemaining = game.timerMax;
  game.stage += 1;

  if (gameTimers[room]) {
    logger.info('Clearing room timers:', gameTimers[room]);
    clearInterval(gameTimers[room]);
  }
  gameCache.set(room, game);
  gameTimers[room] = setInterval(() => {
    handleTimerUpdate.bind(this)(room, auth, stage);
  }, 1000);

  this.server.to(room).emit('draftUpdate', game);

  if (Number(stage) === draftStepConfig.length) {
    finishGame(this.server);
  }
}

function handleTimerUpdate(room: string, auth: string, stage: number) {
  const game: DraftState = gameCache.get(room);
  if (!game) {
    logger.error(`Timer update for non-existent room(${room})`);
    return;
  }
  game.timerRemaining -= 1;

  // give 3 seconds of leeway
  if (game.timerRemaining <= -3) {
    clearInterval(gameTimers[room]);
    handleDraftPick.bind(this)(room, auth, stage, true);
  }
  gameCache.set(room, game);
  this.server.to(room).emit('draftUpdate', game);
}

function finishGame(socket: Socket) {
  // basically just take the game out of memory and put it into the DB
  const room = socket.data.room as string;
  clearInterval(gameTimers[room]);
  socket.to(room).disconnectSockets();
  console.log('Finishing game: ' + room);
}