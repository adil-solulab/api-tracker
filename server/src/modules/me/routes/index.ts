import '@core/declarations'
import { Wrap } from '@core/utils'
import { Router } from 'express'
import MeController from '../controllers'

const router = Router()

const controller = new MeController()
router.get('/', Wrap(controller.Get))

export const MeRouter = router
