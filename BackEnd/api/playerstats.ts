import express, { json, Request, Router } from 'express'
import { GeneratePlayersCsv, GeneratePlayersCsvByFilter } from '../src/business/playerstats'
import { PlayerStatsTableRequest } from '../../Common/Interface/Internal/playerstats'
import { TypedRequest, TypedResponse } from '../../Common/Interface/Internal/responseUtil'
import logger from '../logger'
import { GetGamesRequest } from '../../Common/Interface/Internal/games'
import { GameRoles } from '../../Common/Interface/General/gameEnums'

const router: Router = express.Router()

router.post('/table', async(req: TypedRequest<PlayerStatsTableRequest>, res: TypedResponse<string>) => {
  const body = req.body
  logger.info(`Generating table stats for: ${body.playerNames.join(', ')}`)
  try {
    const data = await GeneratePlayersCsv(body.playerNames, body.games)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment;filename=myfilename.csv')
    // Must use send otherwise quotes appear around data when using .json
    res.send(data)
  } catch (error) {
    logger.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.post('/by-season', async(req: TypedRequest<GetGamesRequest>, res: TypedResponse<string>) => {
  const body = req.body
  logger.info(`Generating table stats season: ${body.seasonId}`)
  try {
    const data = await GeneratePlayersCsvByFilter(body.seasonId, body.risenOnly, GameRoles[req.body.roleId as keyof typeof GameRoles])
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment;filename=myfilename.csv')
    // Must use send otherwise quotes appear around data when using .json
    res.send(data)
  } catch (error) {
    logger.error(error)
    res.status(500).send('Something went wrong')
  }
})

export default router
