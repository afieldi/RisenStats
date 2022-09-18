import express, { Request, Router } from "express";
import fetch from 'node-fetch';
import { TypedResponse } from "../../Common/Interface/Internal/responseUtil";

const router: Router = express.Router();

router.route('/avail').get((req, res: TypedResponse<Number>) => {
  const base = "https://api.twitch.tv/kraken/streams/";
  fetch(base + process.env.TWITCH_MAIN, {
    method: "GET",
    headers: {
      Accept: "application/vnd.twitchtv.v5+json",
      "Client-ID": process.env.TWITCH_CLIENT
    }
  }).then(response => {
    if (response.ok) {
      response.json().then(data => {
        if (data.stream == null) {
          fetch(base + process.env.TWITCH_SECOND, {
            method: "GET",
            headers: {
              Accept: "application/vnd.twitchtv.v5+json",
              "Client-ID": process.env.TWITCH_CLIENT
            }
          }).then(response => {
            if (response.ok) {
              response.json().then(data => {
                if (data.stream == null) {
                  res.json(0);
                }
                else {
                  res.json(2);
                }
              });
            }
            else {
              res.json(-1);
            }
          });
        }
        else {
          res.json(1)
        }
      })
    }
    else {
      res.json(-1);
    }
  })
});

export default router;