import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { DiscordMessage } from '../../../Common/Interface/Internal/discord';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const token = process.env.DISCORD_BOT_TOKEN;
const channelId = '291315891214352384';

let announcements: DiscordMessage[] = [];

client.once('ready', async () => {
  console.log('Discord bot is ready!');
  const channel = await client.channels.fetch(channelId) as TextChannel;
  if (channel) {
    const messages = await channel.messages.fetch({ limit: 10 });
    announcements = messages.map(message => ({
      id: message.id,
      content: message.content,
      author: {
        username: message.author.username,
        avatar: message.author.displayAvatarURL(),
      },
      timestamp: message.createdAt.toISOString(),
    }));
  }
});

client.login(token);

export async function getDiscordAnnouncements(): Promise<DiscordMessage[]> {
  return announcements;
}
