import express, { Request, Router } from 'express'
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil'
import { CreateSeasonRequest, GetSeasonResponse, GetSeasonsResponse } from '../../../Common/Interface/Internal/season'
import { CreateSeason, GetSeasons } from '../business/season'
import logger from '../../logger'

const router: Router = express.Router()

router.post('/get/all', async(req: Request, res: TypedResponse<GetSeasonsResponse>) => {
  logger.debug('Season get all')

  try {
    const seasons = await GetSeasons(false)
    res.json({
      seasons
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.post('/get/active', async(req: Request, res: TypedResponse<GetSeasonsResponse>) => {
  logger.debug('Season get active')

  try {
    const seasons = await GetSeasons(true)
    res.json({
      seasons
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.post('/create', async(req: TypedRequest<CreateSeasonRequest>, res: TypedResponse<GetSeasonResponse>) => {
  logger.debug(`Season create ${JSON.stringify(req.body)}`)

  try {
    const body = req.body
    const season = await CreateSeason(body.seasonName, body.providerId)
    res.json({
      season
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send('Something went wrong')
  }
})

export default router
