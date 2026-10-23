import DiscordOauth2 from 'discord-oauth2';
import { NextFunction, Request, Response } from 'express';
import NodeCache from 'node-cache';
import logger from '../../logger';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

export const userCache = new NodeCache();
const oauth = new DiscordOauth2();

export interface AuthUser {
  user: string
  auth: string
  level: number
  name: string
}

async function getGuildUser(userId: string): Promise<{ roles: string[] }> {
  const guildId = process.env.DISCORD_SERVER_ID?.trim();
  const botToken = process.env.DISCORD_TOKEN?.trim();
  if (!guildId || !botToken) {
    throw new Error('Discord role lookup requires DISCORD_SERVER_ID and DISCORD_TOKEN');
  }
  const response = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bot ${botToken}`
    }
  });
  if (!response.ok) {
    const detail = response.status === 401
      ? '; set DISCORD_TOKEN to a valid bot token from the Discord Developer Portal Bot page (without a Bot or Bearer prefix)'
      : '';
    throw new Error(`Discord guild member lookup failed (HTTP ${response.status})${detail}`);
  }
  const member = await response.json();
  if (!Array.isArray(member.roles) || !member.roles.every((role: unknown) => typeof role === 'string')) {
    throw new Error('Discord guild member lookup returned invalid roles');
  }
  return member;
}

export function getAuthUser(auth: string): AuthUser | undefined {
  const user = userCache.get(auth);
  if (user) {
    return user as AuthUser;
  }
  return undefined;
}

// Lower level means more privilege, matching the roleMap in DoAuth.
export const ADMIN_LEVEL = 1;
export const CODE_MANAGER_LEVEL = 4;

function getAuthTokenFromRequest(req: Request): string | undefined {
  const header = req.get('authorization');
  if (header?.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim();
  }
  return req.cookies?.auth?.toString() ?? req.body?.auth?.toString();
}

export function requireAuthLevel(maxLevel: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = getAuthTokenFromRequest(req);
    const user = token ? getAuthUser(token) : undefined;
    if (!user) {
      res.status(401).send('Not logged in');
      return;
    }
    if (user.level > maxLevel) {
      logger.info(`Denied ${req.method} ${req.originalUrl} for user ${user.user} with level ${user.level}`);
      res.status(403).send('Forbidden');
      return;
    }
    next();
  };
}

export async function DoAuth(code: string, host: string): Promise<AuthUser> {
  const redirectUri = (process.env.NODE_ENV === 'production' ? `https://${host}` : 'http://localhost:4000') + '/api/auth/callback';
  logger.info(`Redirect URI: ${redirectUri}`);
  const clientSecret = process.env.DISCORD_CLIENT_SECRET?.trim();
  if (!clientSecret) {
    throw new Error('Discord login requires DISCORD_CLIENT_SECRET');
  }
  return await oauth.tokenRequest({
    clientId: '737851599778742405',
    clientSecret,
    code,
    grantType: 'authorization_code',
    scope: 'identify guilds',
    redirectUri
  }).then(async userAuth => {
    logger.info('Received Discord authorization');
    const roleMap: { [key: string]: number } = {
      '293099704785305600': 1, // Sr, Admin
      '980589721904361592': 1, // Admin
      '778687457083260928': 1, // Developer
      '385541928143421444': 3, // Staff
      '401841718569205771': 5, // Casters
      '616647423485542428': 10 // Verified
    };

    // @ts-expect-error Bro idk
    function isValidRole(value: string): value is keyof typeof roleMap {
      return value in roleMap;
    }
    return await oauth.getUser(userAuth.access_token).then(async user => {
      const guildMember = await getGuildUser(user.id);
      let priv = 99;
      for (const role of guildMember.roles) {
        if (isValidRole(role)) {
          const roleVal = roleMap[role];
          if (roleVal < priv) priv = roleVal;
        }
      }
      logger.info(`Assigned permission level ${priv} to Discord user ${user.id} in guild ${process.env.DISCORD_SERVER_ID}; roles: ${JSON.stringify(guildMember.roles)}`);
      return {
        user: user.id,
        auth: uuidv4(),
        level: priv,
        name: user.username
      } as AuthUser;
    }, (err) => { throw new Error(err); });
  }, (err) => {
    console.log('err');
    throw new Error(err);
  });
}
