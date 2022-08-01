import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./logger";

dotenv.config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 3000;
// const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

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

import CodesRouter from "./api/codes";
import ProviderRouter from "./api/provider";
import SeasonRouter from "./api/season";
import PlayerRouter from "./api/player";
import GamesRouter from "./api/games";

app.use("/api/codes", CodesRouter);
app.use("/api/provider", ProviderRouter);
app.use("/api/season", SeasonRouter);
app.use("/api/player", PlayerRouter);
app.use("/api/games", GamesRouter);

app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`)
  logger.debug(`Example app listening on port ${port}`);
});