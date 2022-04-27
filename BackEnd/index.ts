import express from "express";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

import CodesRouter from "./api/codes";

app.use("/api/codes", CodesRouter);

app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`)
  logger.debug(`Example app listening on port ${port}`);
})