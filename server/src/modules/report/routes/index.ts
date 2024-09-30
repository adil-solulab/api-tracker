import '@core/declarations'
import { Wrap } from '@core/utils'
import { Router } from 'express'
import ReportController from '../controllers'

const router = Router()

const controller = new ReportController()

router.get('/', Wrap(controller.GetAll))
router.get('/details', Wrap(controller.Get))
router.get('/company-codes', Wrap(controller.GetCompanyCodes))
router.get('/graph-data', Wrap(controller.GetGraphData))

export const ReportRouter = router
