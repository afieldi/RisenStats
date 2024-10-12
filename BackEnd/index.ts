import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { DRAFT_SOCKET_PATH } from '../Common/constants';
import { DraftingSocketClientToServer, DraftingSocketServerToClient } from '../Common/Interface/Internal/drafting';
import logger from './logger';
import cookieParser from 'cookie-parser';
import yargs from 'yargs/yargs';
import io from 'socket.io';
import { createServer } from 'node:http';
import {
  handleDraftHover,
  handleDraftPick,
  handleReady,
  handleSocketConnection,
  handleUnready
} from './src/business/drafting';

interface Argv {
  prod?: boolean;
  stg?: boolean;
}

const argv: Argv = yargs(process.argv.slice(2)).argv as Argv;

let envFile = '.env.development';
if (argv.prod) {
  process.env.NODE_ENV = 'production';
  envFile = '.env.production';
}
else if (argv.stg) {
  process.env.NODE_ENV = 'development';
  envFile = '.env.staging';
}
else {
  process.env.NODE_ENV = 'development';
}
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: (origin: any, callback: any) => {
    callback(null, origin);
  },
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

import CodesRouter from './src/api/codes';
import ProviderRouter from './src/api/provider';
import SeasonRouter from './src/api/season';
import PlayerRouter from './src/api/player';
import GamesRouter from './src/api/games';
import AuthRouter from './src/api/auth';
import StreamRouter from './src/api/stream';
import ChartRouter from './src/api/charts';
import PlayerStatsRouter from './src/api/playerstats';
import ChampionStatsRouter from './src/api/championstats';
import LeaderboardsRouter from './src/api/leaderboards';
import TeamsRouter from './src/api/teams';
import Stocks from './src/api/stocks';

import DraftingRouter from './src/api/drafting';

app.use('/api/codes', CodesRouter);
app.use('/api/provider', ProviderRouter);
app.use('/api/season', SeasonRouter);
app.use('/api/player', PlayerRouter);
app.use('/api/games', GamesRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/stream', StreamRouter);
app.use('/api/charts', ChartRouter);
app.use('/api/stats/player', PlayerStatsRouter);
app.use('/api/stats/champions', ChampionStatsRouter);
app.use('/api/stats/leaderboards', LeaderboardsRouter);
app.use('/api/teams', TeamsRouter);
app.use('/api/drafting', DraftingRouter);
app.use('/api/stocks', Stocks);

const server = createServer(app);

const draftServer = new io.Server<
  DraftingSocketClientToServer,
  DraftingSocketServerToClient,
  {},
  {}
>(server, {
  path: DRAFT_SOCKET_PATH,
  cors: {
    origin: '*', // TODO only allow FE to connect
  },
});
draftServer.on('connection', (socket: io.Socket) => {
  console.log('got new connection ');
  socket.on('register', handleSocketConnection.bind({ socket, server: draftServer }));
  socket.on('pick', handleDraftPick.bind({ socket, server: draftServer }));
  socket.on('hover', handleDraftHover.bind({ socket, server: draftServer }));
  socket.on('ready', handleReady.bind({ socket, server: draftServer }));
  socket.on('unready', handleUnready.bind({ socket, server: draftServer }));
});

server.listen(port, () => {
  // console.log(`Example app listening on port ${port}`)
  logger.debug(`Example app listening on port ${port}`);
});

module.exports = server;