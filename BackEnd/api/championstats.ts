import express, { Response, Router } from 'express'
import { TypedRequest } from '../../Common/Interface/Internal/responseUtil'
import { CreatePlayerRadarWithName } from '../src/business/charts'
import logger from '../logger'
import { ChampionStatsSheetRequest } from '../../Common/Interface/Internal/championstats'
import { GetChampionStatsBySeason } from '../src/business/championstats'

const router: Router = express.Router()

router.post('/by-season', async(req: TypedRequest<ChampionStatsSheetRequest>, res: Response) => {
  logger.info(`Calling get champions stats for season: ${req.body.seasonId}`)
  try {
    res.send(await GetChampionStatsBySeason(req.body.seasonId))
  } catch (error) {
    logger.error(error)
    res.status(400).send('Something went wrong. SeasonId must be a number')
  }
})

export default router
