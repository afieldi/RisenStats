import { afterAll, beforeEach, expect, jest, test } from '@jest/globals';
import fetch, { Response } from 'node-fetch';
import { DoAuth } from '../../src/business/auth';

jest.mock('node-fetch');
jest.mock('discord-oauth2', () => jest.fn().mockImplementation(() => ({
  tokenRequest: jest.fn(async() => ({ access_token: 'test-access-token' })),
  getUser: jest.fn(async() => ({ id: 'test-user', username: 'tester' }))
})));
jest.mock('../../logger', () => ({
  __esModule: true,
  default: { info: jest.fn() }
}));

const fetchMock = jest.mocked(fetch);
const originalGuildId = process.env.DISCORD_SERVER_ID;
const originalBotToken = process.env.DISCORD_TOKEN;

beforeEach(() => {
  fetchMock.mockReset();
  process.env.DISCORD_SERVER_ID = 'test-guild';
  process.env.DISCORD_TOKEN = ' test-bot-token ';
});

afterAll(() => {
  if (originalGuildId === undefined) delete process.env.DISCORD_SERVER_ID;
  else process.env.DISCORD_SERVER_ID = originalGuildId;
  if (originalBotToken === undefined) delete process.env.DISCORD_TOKEN;
  else process.env.DISCORD_TOKEN = originalBotToken;
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
