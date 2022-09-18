import express, { Request, Response, Router } from "express";
import { DoAuth } from '../src/business/auth';
import logger from "../logger";
import NodeCache from 'node-cache';

const router: Router = express.Router();
const userCache = new NodeCache();

router.get('/callback', (req, res) => {
  logger.info(`Login called with code: ${req.query.code}`);
  try {
    DoAuth(req.query.code as string, req.headers.host).then(userObj => {
      let d = new Date();
      d.setDate(new Date().getDate() + 7);
      userCache.set(userObj.auth, userObj, 7 * 24 * 60 * 60);
      res.clearCookie('auth', { secure: true, sameSite: 'none' });
      res.cookie('auth', userObj.auth, { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: 'none'});
      if (req.get('origin')) {
        res.redirect(302, `${req.get('origin')}`);
      }
      else {
        res.redirect(302, `${process.env.WEBSITE_BASE.split(',')[0]}`);
      }
    }, (err) => {
      logger.error(err);
      res.status(500).send("Failed");
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send("Failed");
  }
})

router.get('/redirect', (req: Request, res: Response) => {
  const client_id = "737851599778742405";
  let redirect = req.headers.host + "/api/auth/callback";
  if (process.env.NODE_ENV === "production") {
    redirect = "https%3A%2F%2F" + redirect;
  }
  else {
    redirect = "http%3A%2F%2F" + redirect;
  }
  res.send(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${client_id}&scope=identify&redirect_uri=${redirect}&prompt=identify%20guilds%20guilds.members.read`);
});

router.get('/verify', (req, res) => {
  logger.info(`Checking if code ${req.cookies.auth} is valid`);
  const user = userCache.get(req.cookies.auth);
  if (user) {
    logger.info(`Found user ${user}`);
    res.send(user);
  }
  else {
    logger.info("No user found");
    res.status(404).send("Code not found!");
  }
})

router.post('/logout', (req, res) => {
  logger.info("Logging out");
  let options = {};
  options = { secure: true, sameSite: 'none'};
  res.clearCookie('auth', options).json("logged out");
})

export default router;
