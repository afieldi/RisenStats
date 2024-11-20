import { Server } from 'socket.io';
import NodeCache from 'node-cache';
import { DRAFT_TEAM, draftStepConfig } from '../../../Common/constants';
import { DraftState } from '../../../Common/Interface/Internal/drafting';
import { MakeId } from '../../../Common/utils';
import logger from '../../logger';
import { createDbDraft, getDbDraft } from '../db/drafting';

const gameCache = new NodeCache();
const gameTimers: Record<string, number[]> = {};

const DEFAULT_DRAFT_TIME = 30;

// 0 is spectator, 1 is blue, 2 is red
function getTeam(game: DraftState, auth: string): DRAFT_TEAM {
  if (game.blueTeam.auth === auth) {
    return DRAFT_TEAM.blueTeam;
  }
  else if (game.redTeam.auth === auth) {
    return DRAFT_TEAM.redTeam;
  }
  return null;
}

function clearTimersForRoom(room: string) {
  while(gameTimers[room].length) {
    clearInterval(gameTimers[room].pop());
  }
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

export async function handleSocketConnection(room: string) {

  if (!gameCache.has(room as string)) {
    const dbDraft = await getDbDraft(room);
    if (dbDraft) {
      this.socket.emit('draftUpdate', {
        ...dbDraft,
        stage: 19,
        roomActive: false,
        timerMax: 0,
        timerRemaining: 0,
      } as DraftState);
    }
    else {
      logger.error('Tried to join a room that does not exist: ' + room);
      logger.info('Current rooms: ', gameCache.keys());
    }
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
  if (!game || !game.roomActive) {
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

  if (game.redTeam.ready && game.blueTeam.ready) {
    game.roomActive = true;
    gameTimers[room] = [setInterval(handleTimerUpdate.bind({ server: this.server }, room, auth, this.server), 1000)[Symbol.toPrimitive]()];
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

export function handleDraftPick(room: string, auth: string, server: Server) {
  const game: DraftState = gameCache.get(room);
  logger.info('Got draftPick', room, auth);
  const resolvedServer: Server = server ?? this.server;
  if (!game || !game.roomActive) {
    logger.error(`Timer update for non-existent room(${room})`);
    // this.socket.disconnect();
    return;
  }
  const pickConfig = draftStepConfig[game.stage];

  // Server is only passed by handleTimerUpdate, meaning that it will only occur when we run out of time
  if ((game[pickConfig[0]])[pickConfig[1]][pickConfig[2]] === '0' && !server) {
    return;
  }

  // Reset the timer, increase the draft pick
  game.timerRemaining = game.timerMax;
  game.stage += 1;

  logger.info('Clearing room timers:', gameTimers[room]);
  clearTimersForRoom(room);

  gameCache.set(room, game);
  gameTimers[room].push(setInterval(handleTimerUpdate, 1000, room, auth, resolvedServer)[Symbol.toPrimitive]());

  resolvedServer.to(room).emit('draftUpdate', game);

  if (game.stage === draftStepConfig.length) {
    finishGame(room, resolvedServer);
  }
}

function handleTimerUpdate(room: string, auth: string, server: Server) {
  const game: DraftState = gameCache.get(room);

  if (!game) {
    logger.error(`Timer update for non-existent room(${room})`);
    return;
  }
  if (game.timerRemaining < -3) {
    return;
  }

  game.timerRemaining -= 1;
  gameCache.set(room, game);

  // give 3 seconds of leeway
  if (game.timerRemaining === -3) {
    handleDraftPick(room, auth, server);
  }
  server.to(room).emit('draftUpdate', game);
}

function finishGame(room: string, socket: Server) {
  const game: DraftState = gameCache.get(room);
  game.roomActive = false;
  socket.to(room).emit('draftUpdate', game);

  createDbDraft(game);
  gameCache.del(room);

  // basically just take the game out of memory and put it into the DB
  clearTimersForRoom(room);
  socket.to(room).disconnectSockets();
}