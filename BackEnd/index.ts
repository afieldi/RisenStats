import express, { application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./logger";
import cookieParser from "cookie-parser";
import yargs from 'yargs/yargs';

interface Argv {
  prod?: boolean;
  stg?: boolean;
}

const argv: Argv = yargs(process.argv.slice(2)).argv as Argv;

let envFile = ".env.development";
if (argv.prod) {
    process.env.NODE_ENV = 'production';
    envFile = ".env.production";
}
else if (argv.stg) {
    process.env.NODE_ENV = 'development';
    envFile = ".env.staging";
}
else {
    process.env.NODE_ENV = 'development';
}
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 3000;
// const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: (origin: any, callback: any) => {
    callback(null, origin)
      // if (process.env.WEBSITE_BASE.includes(origin))
      //     callback(null, origin)
      // else {
      //     callback(null, "")
      // }
  },
  credentials: true,
  // allowedHeaders: 'Content-Type,Authorization,auth',
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

import CodesRouter from "./src/api/codes";
import ProviderRouter from "./src/api/provider";
import SeasonRouter from "./src/api/season";
import PlayerRouter from "./src/api/player";
import GamesRouter from "./src/api/games";
import AuthRouter from "./src/api/auth";
import StreamRouter from "./src/api/stream";
import ChartRouter from "./src/api/charts";
import PlayerStatsRouter from "./src/api/playerstats";
import ChampionStatsRouter from './src/api/championstats';
import LeaderboardsRouter from './src/api/leaderboards';


app.use("/api/codes", CodesRouter);
app.use("/api/provider", ProviderRouter);
app.use("/api/season", SeasonRouter);
app.use("/api/player", PlayerRouter);
app.use("/api/games", GamesRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/stream", StreamRouter);
app.use("/api/charts", ChartRouter);
app.use("/api/stats/player", PlayerStatsRouter);
app.use("/api/stats/champions", ChampionStatsRouter);
app.use("/api/stats/leaderboards", LeaderboardsRouter);


app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`)
  logger.debug(`Example app listening on port ${port}`);
});