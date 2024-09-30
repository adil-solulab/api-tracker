import { Express } from 'express'
import authRouter from './auth.routes'
import adminRouter from './admin.routes'

export default (app: Express) => {
    app.use('/', authRouter)
    app.use('/', adminRouter)
}