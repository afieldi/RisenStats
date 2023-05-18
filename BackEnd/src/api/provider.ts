import express, { Request, Router } from 'express';
import { CreateProviderRequest, CreateProviderResponse, GetProvidersResponse } from '../../../Common/Interface/Internal/provider';
import { TypedResponse, TypedRequest } from '../../../Common/Interface/Internal/responseUtil';
import { CreateTournamentProvider, GetTournamentProviders } from '../business/provider';
import logger from '../../logger';

const router: Router = express.Router();

router.post('/get/all', async(req: Request, res: TypedResponse<GetProvidersResponse>) => {
  try {
    logger.info('Touranment provider get all');
    const providers = await GetTournamentProviders();
    res.json({
      proivders: providers
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/create', async(req: TypedRequest<CreateProviderRequest>, res: TypedResponse<CreateProviderResponse>) => {
  const body = req.body;
  logger.debug(`Create provider ${JSON.stringify(body)}`);
  try {
    const newProvider = await CreateTournamentProvider(body.callback, body.region);
    res.json({
      provider: newProvider
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

export default router;
