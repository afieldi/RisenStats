import { GetDiscordAnnouncementsResponse } from '../../../Common/Interface/Internal/discord';
import { get } from './_call';

export const getDiscordAnnouncements = async(): Promise<GetDiscordAnnouncementsResponse> => {
  return await get('/discord/announcements');
};
