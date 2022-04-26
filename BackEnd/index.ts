import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})