import express, { Router } from 'express';
import { TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import { GetDiscordAnnouncementsResponse } from '../../../Common/Interface/Internal/discord';
import logger from '../../logger';
import { getDiscordAnnouncements } from '../business/discord';

const router: Router = express.Router();

router.get('/announcements', async(req, res: TypedResponse<GetDiscordAnnouncementsResponse>) => {
  logger.info('Get discord announcements');
  try {
    const messages = await getDiscordAnnouncements();
    res.json({
      messages
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

export default router;
