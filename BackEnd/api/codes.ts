import express, { Request, Router } from 'express'
import { CreateCodesRequest, GetCodesResponse } from '../../Common/Interface/Internal/codes'
import { TypedRequest, TypedResponse } from '../../Common/Interface/Internal/responseUtil'
import { CreateCodes, GetAllCodes, GetCodesBySeasonId } from '../src/business/codes'
import logger from '../logger'

const router: Router = express.Router()

router.post('/get/all', async(req: Request, res: TypedResponse<GetCodesResponse>) => {
  // This function should be pretty simple. Heavy lifing should be done in the
  // business logic file with the same name.
  // Use a try catch to ensure a respone is always sent.

  try {
    logger.info('Codes get all')
    const codes = await GetAllCodes()
    res.json({
      codes
    })
  } catch (error) {
    logger.error(error)
    // .json is typed to GetCodesResponse here, so we use send.
    res.status(500).send('Something went wrong')
  }
})

router.post('/create', async(req: TypedRequest<CreateCodesRequest>, res: TypedResponse<GetCodesResponse>) => {
  const body = req.body
  logger.info(`Create codes ${JSON.stringify(body)}`)

  try {
    const newCodes = await CreateCodes(body.seasonId, body.count)
    res.json({
      codes: newCodes
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.post('/get/by-season/:seasonId', async(req: Request, res: TypedResponse<GetCodesResponse>) => {
  const seasonId = Number(req.params.seasonId)
  logger.info(`Codes get by season ${seasonId}`)
  try {
    const codes = await GetCodesBySeasonId(seasonId)
    res.json({
      codes
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send('Something went wrong')
  }
})

export default router
