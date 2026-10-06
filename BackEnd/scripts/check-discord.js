const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { resolve } = require('path');

// Run from the same working directory and with the same mode as the backend.
// This checks this command's environment; PM2 startup logs show its environment.
const envFile = process.argv.includes('--prod') ? '.env.production'
  : process.argv.includes('--stg') ? '.env.staging' : '.env.development';
const inheritedToken = process.env.DISCORD_TOKEN !== undefined;
const result = dotenv.config({ path: envFile });
const fileToken = result.parsed?.DISCORD_TOKEN;
const token = process.env.DISCORD_TOKEN?.trim();
const guildId = process.env.DISCORD_SERVER_ID?.trim();

console.log(JSON.stringify({
  envFile: resolve(envFile),
  envFileLoaded: !result.error,
  tokenSource: inheritedToken ? 'process environment' : (fileToken !== undefined ? 'env file' : 'missing'),
  tokenMatchesEnvFile: fileToken !== undefined ? process.env.DISCORD_TOKEN === fileToken : null,
  guildId
}));

async function checkDiscord() {
  if (!token || !guildId) throw new Error('DISCORD_TOKEN and DISCORD_SERVER_ID are required');
  if (/^(Bot|Bearer)\s/i.test(token)) {
    throw new Error('DISCORD_TOKEN contains an authorization prefix; store only the raw bot token');
  }
  const headers = { Authorization: `Bot ${token}` };
  const identity = await fetch('https://discord.com/api/v10/users/@me', { headers, timeout: 10000 });
  console.log(`Bot identity: HTTP ${identity.status}`);
  if (!identity.ok) {
    throw new Error('Discord rejected the loaded bot credential; guild roles have not been checked');
  }
  const bot = await identity.json();
  console.log(JSON.stringify({ botId: bot.id, username: bot.username, bot: bot.bot }));
  if (!bot.bot) throw new Error('The loaded credential does not identify a bot');

  const guild = await fetch(`https://discord.com/api/v10/guilds/${encodeURIComponent(guildId)}`, { headers, timeout: 10000 });
  console.log(`Guild access: HTTP ${guild.status}`);
  if (!guild.ok) throw new Error('The credential is valid, but this bot cannot access the configured guild');

  const userId = process.argv.find(arg => arg.startsWith('--user='))?.slice('--user='.length);
  if (userId) {
    const member = await fetch(`https://discord.com/api/v10/guilds/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}`, { headers, timeout: 10000 });
    console.log(`Guild member: HTTP ${member.status}`);
    if (!member.ok) throw new Error('Guild access succeeded, but the member lookup failed');
    const data = await member.json();
    if (!Array.isArray(data.roles)) throw new Error('Guild member response did not contain roles');
    console.log(JSON.stringify({ userId, roles: data.roles }));
  } else {
    console.log('Member lookup skipped: pass --user=<Discord user ID> to inspect permission roles');
  }
}

checkDiscord().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
