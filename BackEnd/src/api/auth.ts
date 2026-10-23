import express, { Request, Response, Router } from 'express';
import { AuthUser, DoAuth, userCache } from '../business/auth';
import logger from '../../logger';

const router: Router = express.Router();

const DEV_WEBSITE_BASE = 'http://localhost:3000';

function getWebsiteBase(req: Request): string | undefined {
  if (req.get('origin')) {
    return req.get('origin');
  }
  const configured = process.env.WEBSITE_BASE?.split(',')[0]?.trim();
  if (configured) {
    return configured;
  }
  return process.env.NODE_ENV === 'production' ? undefined : DEV_WEBSITE_BASE;
}

router.get('/callback', async(req, res) => {
  logger.info('Login callback called');
  try {
    const websiteBase = getWebsiteBase(req);
    if (!websiteBase) {
      throw new Error('Login redirect requires WEBSITE_BASE');
    }
    const userObj = await DoAuth(req.query.code.toString(), req.headers.host);
    userCache.set(userObj.auth, userObj, 7 * 24 * 60 * 60);
    res.clearCookie('auth', { secure: true, sameSite: 'none' });
    res.cookie('auth', userObj.auth, { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: 'none' });
    res.redirect(302, `${websiteBase}?code=${userObj.auth}`);
  } catch (error) {
    logger.error(error);
    res.status(500).send('Failed');
  }
});

router.get('/redirect', (req: Request, res: Response) => {
  const clientId = '737851599778742405';
  let redirect = req.headers.host + '/api/auth/callback';
  if (process.env.NODE_ENV === 'production') {
    redirect = 'https%3A%2F%2F' + redirect;
  } else {
    redirect = 'http%3A%2F%2F' + redirect;
  }
  res.send(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${clientId}&scope=identify&redirect_uri=${redirect}&prompt=identify%20guilds%20guilds.members.read`);
});

router.get('/verify', (req, res) => {
  const code = req.cookies.auth.toString() ?? req.query.auth.toString();
  logger.info(`Checking if code ${code} is valid`);
  const user = userCache.get<AuthUser>(code);
  if (user) {
    logger.info(`Found user ${user.user} (${user.name}) with permission level ${user.level}`);
    res.send(user);
  } else {
    logger.info('No user found');
    res.status(404).send('Code not found!');
  }
});

router.post('/verify', (req, res) => {
  const code = req.cookies?.auth?.toString() ?? req.query?.auth?.toString();
  logger.info(`Checking if code ${code} is valid: `);
  const user = userCache.get<AuthUser>(code);
  if (user) {
    logger.info(`Found user ${user.user} (${user.name}) with permission level ${user.level}`);
    res.send(user);
  } else {
    logger.info('No user found');
    res.status(404).send('Code not found!');
  }
});

router.post('/logout', (req, res) => {
  logger.info('Logging out');
  let options = {};
  options = { secure: true, sameSite: 'none' };
  res.clearCookie('auth', options).json('logged out');
});

export default router;
