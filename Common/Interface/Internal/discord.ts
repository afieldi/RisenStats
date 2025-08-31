export interface GetDiscordAnnouncementsResponse {
  messages: DiscordMessage[];
}

export interface DiscordMessage {
  id: string;
  content: string;
  author: {
    username: string;
    avatar: string;
  };
  timestamp: string;
}
