import express from "express";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 3000;
// const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

import CodesRouter from "./api/codes";
import ProviderRouter from "./api/provider";
import SeasonRouter from "./api/season";

app.use("/api/codes", CodesRouter);
app.use("/api/provider", ProviderRouter);
app.use("/api/season", SeasonRouter);

app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`)
  logger.debug(`Example app listening on port ${port}`);
})