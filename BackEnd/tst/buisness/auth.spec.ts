import { afterAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import fetch, { Response } from 'node-fetch';
import { DoAuth, requireAuthLevel, userCache } from '../../src/business/auth';

jest.mock('node-fetch');
jest.mock('discord-oauth2', () => jest.fn().mockImplementation(() => ({
  tokenRequest: jest.fn(async() => ({ access_token: 'test-access-token' })),
  getUser: jest.fn(async() => ({ id: 'test-user', username: 'tester' }))
})));
jest.mock('../../logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), error: jest.fn() }
}));

const fetchMock = jest.mocked(fetch);
const originalGuildId = process.env.DISCORD_SERVER_ID;
const originalBotToken = process.env.DISCORD_TOKEN;
const originalClientSecret = process.env.DISCORD_CLIENT_SECRET;

beforeEach(() => {
  fetchMock.mockReset();
  process.env.DISCORD_SERVER_ID = 'test-guild';
  process.env.DISCORD_TOKEN = ' test-bot-token ';
  process.env.DISCORD_CLIENT_SECRET = 'test-client-secret';
});

afterAll(() => {
  if (originalGuildId === undefined) delete process.env.DISCORD_SERVER_ID;
  else process.env.DISCORD_SERVER_ID = originalGuildId;
  if (originalBotToken === undefined) delete process.env.DISCORD_TOKEN;
  else process.env.DISCORD_TOKEN = originalBotToken;
  if (originalClientSecret === undefined) delete process.env.DISCORD_CLIENT_SECRET;
  else process.env.DISCORD_CLIENT_SECRET = originalClientSecret;
});

test('reads roles with the bot token and selects the highest permission', async() => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async() => ({ roles: ['616647423485542428', '385541928143421444', '980589721904361592'] })
  } as unknown as Response);

  await expect(DoAuth('test-code', 'localhost:4000')).resolves.toMatchObject({
    user: 'test-user', level: 1
  });
  expect(fetchMock).toHaveBeenCalledWith(
    'https://discord.com/api/guilds/test-guild/members/test-user',
    { method: 'GET', headers: { Authorization: 'Bot test-bot-token' } }
  );
});

test('reports an invalid bot credential without trying to read roles', async() => {
  const json = jest.fn(async() => ({ message: '401: Unauthorized', code: 0 }));
  fetchMock.mockResolvedValue({ ok: false, status: 401, json } as unknown as Response);

  await expect(DoAuth('test-code', 'localhost:4000')).rejects.toThrow(
    'Discord guild member lookup failed (HTTP 401); set DISCORD_TOKEN to a valid bot token'
  );
  expect(json).not.toHaveBeenCalled();
});

test('rejects malformed guild membership instead of assigning permissions', async() => {
  fetchMock.mockResolvedValue({ ok: true, json: async() => ({ message: 'not a guild member' }) } as unknown as Response);

  await expect(DoAuth('test-code', 'localhost:4000')).rejects.toThrow('returned invalid roles');
});

test('reports missing bot configuration without making a guild request', async() => {
  delete process.env.DISCORD_TOKEN;

  await expect(DoAuth('test-code', 'localhost:4000')).rejects.toThrow(
    'Discord role lookup requires DISCORD_SERVER_ID and DISCORD_TOKEN'
  );
  expect(fetchMock).not.toHaveBeenCalled();
});

test('refuses to log in without a configured client secret', async() => {
  delete process.env.DISCORD_CLIENT_SECRET;

  await expect(DoAuth('test-code', 'localhost:4000')).rejects.toThrow('Discord login requires DISCORD_CLIENT_SECRET');
  expect(fetchMock).not.toHaveBeenCalled();
});

describe('requireAuthLevel', () => {
  function runMiddleware(maxLevel: number, req: object) {
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();
    requireAuthLevel(maxLevel)({ get: (): undefined => undefined, method: 'POST', originalUrl: '/x', ...req } as any, res as any, next);
    return { res, next };
  }

  beforeEach(() => {
    userCache.flushAll();
    userCache.set('admin-token', { user: 'a', auth: 'admin-token', level: 1, name: 'admin' });
    userCache.set('caster-token', { user: 'c', auth: 'caster-token', level: 5, name: 'caster' });
  });

  test('rejects requests without a valid session', () => {
    const { res, next } = runMiddleware(4, {});
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();

    const unknown = runMiddleware(4, { get: () => 'Bearer not-a-session' });
    expect(unknown.res.status).toHaveBeenCalledWith(401);
  });

  test('rejects users above the required level', () => {
    const { res, next } = runMiddleware(4, { get: () => 'Bearer caster-token' });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('allows privileged users via bearer header or cookie', () => {
    expect(runMiddleware(4, { get: () => 'Bearer admin-token' }).next).toHaveBeenCalled();
    expect(runMiddleware(4, { cookies: { auth: 'admin-token' } }).next).toHaveBeenCalled();
  });
});
