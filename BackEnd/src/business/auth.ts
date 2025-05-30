import DiscordOauth2 from 'discord-oauth2';
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

async function getGuildUser(userId: string): Promise<any> {
  return await fetch(`https://discord.com/api/guilds/${process.env.DISCORD_SERVER_ID}/members/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`
    }
  }).then(async data => await data.json());
}

export function getAuthUser(auth: string): AuthUser | undefined {
  const user = userCache.get(auth);
  if (user) {
    return user as AuthUser;
  }
  return undefined;
}

export async function DoAuth(code: string, host: string): Promise<AuthUser> {
  const redirectUri = (process.env.NODE_ENV === 'production' ? `https://${host}` : 'https://2117-64-46-29-171.ngrok-free.app') + '/api/auth/callback';
  logger.info(`Redirect URI: ${redirectUri}`);
  return await oauth.tokenRequest({
    clientId: '737851599778742405',
    clientSecret: 'UqS3MmEvL97P91GfH6RJV0UUNyuUkLjZ',
    code,
    grantType: 'authorization_code',
    scope: 'identify guilds',
    redirectUri
  }).then(async userAuth => {
    logger.info(`Received userAuth from discord ${JSON.stringify(userAuth)}`);
    const roleMap: { [key: string]: number } = {
      '293099704785305600': 1, // Sr, Admin
      '980589721904361592': 1, // Admin
      '778687457083260928': 1, // Developer
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
