const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { resolve } = require('path');

const argument = name => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);

function loadConfiguration() {
  const pm2App = argument('pm2');
  if (pm2App) {
    const { spawnSync } = require('child_process');
    const snapshot = spawnSync('pm2', ['jlist'], { encoding: 'utf8', timeout: 10000, maxBuffer: 10 * 1024 * 1024 });
    if (snapshot.error || snapshot.status !== 0) {
      throw new Error('Unable to read PM2 process settings; run as the same user that manages the backend');
    }
    // Never print jlist: it contains credentials for all managed apps.
    let apps;
    try { apps = JSON.parse(snapshot.stdout); }
    catch { throw new Error('PM2 did not return valid JSON process settings'); }
    const matches = apps.filter(app => app.name === pm2App);
    if (matches.length !== 1) throw new Error(`Expected one PM2 process named ${pm2App}; found ${matches.length}`);
    const app = matches[0];
    if (app.pm2_env.status !== 'online') throw new Error(`PM2 process ${pm2App} is not online`);
    const settings = { ...app.pm2_env.env, ...app.pm2_env };
    console.log(JSON.stringify({
      app: pm2App,
      pid: app.pid,
      script: app.pm2_env.pm_exec_path,
      cwd: app.pm2_env.pm_cwd,
      tokenSource: settings.DISCORD_TOKEN !== undefined ? 'PM2 registered environment' : 'missing',
      guildId: settings.DISCORD_SERVER_ID
    }));
    return settings;
  }

  const ecosystemFile = argument('ecosystem');
  if (ecosystemFile) {
    // Inspect the saved ecosystem settings, not the live PM2 process.
    // Skip dotenv so a development file cannot mask missing ecosystem values.
    const config = require(resolve(ecosystemFile));
    const appName = argument('app') || 'backend';
    const app = config.apps?.find(candidate => candidate.name === appName);
    if (!app) throw new Error(`No app named ${appName} in the ecosystem file`);
    const environment = argument('env');
    const environmentKey = environment ? `env_${environment}` : undefined;
    if (environmentKey && !app[environmentKey]) {
      throw new Error(`App ${appName} has no ${environmentKey} section`);
    }
    const appEnv = { ...app.env, ...(environmentKey ? app[environmentKey] : {}) };
    const settings = { ...process.env, ...appEnv };
    console.log(JSON.stringify({
      ecosystemFile: resolve(ecosystemFile),
      app: appName,
      selectedEnvironment: environment || 'env',
      tokenSource: appEnv.DISCORD_TOKEN !== undefined ? 'ecosystem file'
        : (process.env.DISCORD_TOKEN !== undefined ? 'process environment' : 'missing'),
      guildId: settings.DISCORD_SERVER_ID
    }));
    return settings;
  }

  // Run from the same working directory and with the same mode as the backend.
  const envFile = process.argv.includes('--prod') ? '.env.production'
    : process.argv.includes('--stg') ? '.env.staging' : '.env.development';
  const inheritedToken = process.env.DISCORD_TOKEN !== undefined;
  const result = dotenv.config({ path: envFile });
  const fileToken = result.parsed?.DISCORD_TOKEN;
  console.log(JSON.stringify({
    envFile: resolve(envFile),
    envFileLoaded: !result.error,
    tokenSource: inheritedToken ? 'process environment' : (fileToken !== undefined ? 'env file' : 'missing'),
    tokenMatchesEnvFile: fileToken !== undefined ? process.env.DISCORD_TOKEN === fileToken : null,
    guildId: process.env.DISCORD_SERVER_ID
  }));
  return process.env;
}

async function checkDiscord() {
  const settings = loadConfiguration();
  const token = settings.DISCORD_TOKEN?.trim();
  const guildId = settings.DISCORD_SERVER_ID?.trim();
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
