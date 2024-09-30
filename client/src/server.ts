import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import config from './core/config'
import cookieParser from 'cookie-parser'
import routers from './routes/'
import Logger from './core/logger'
import expressEjsLayouts from 'express-ejs-layouts'
import session from 'express-session'
import MongoStore from 'connect-mongo'

const app = express()

/** EJS Layout Configurations */
app.use(expressEjsLayouts)
app.set('layout extractScripts', true)
app.set('style extractStyles', true)
app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use(
	session({
		secret: 'asd!ajsfkjuih12h3u1h',
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl:
				process.env.MONGO_URL,
		}),
	})
)

/** Middlewares */
app.use(cors({ credentials: true, origin: true }))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/** Default static file directory */
app.use(express.static(__dirname + '/assets'))

/** Start server */
app.listen(config.port || 4000, () => {
	Logger.info(`Server Listing At ${config.host}`)
	routers(app)
})

export default app
