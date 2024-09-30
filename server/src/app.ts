import '@core/declarations'
import express, { Request, Response, NextFunction } from 'express'
import { Global } from '@core/globals'
import cors from 'cors'
import helmet from 'helmet'
import morganLogger from 'morgan'
import { _registerResponders } from '@core/response-handler'
import { Database } from '@core/database'
import { AppRoutes } from './app.routes'
import { maintenanceMode } from '@middlewares/maintenance-mode'
import { Wrap } from '@core/utils'
import Paginator from '@helpers/pagination.helper'
import cron from 'node-cron'
import { DatabaseHelper } from '@helpers/database-cleaner.helper'

export class Application {
	private app: express.Application

	constructor() {
		this.app = express()
		Global.App.Http.app = this.app
		this.middleware()
		this.config()
		this.connectDatabase()
		this.registerResponders()
		this.registerRoutes()
		this.cron()
	}

	// Returns Express App
	express(): express.Application {
		return this.app
	}

	// Configuration and Setup
	private config(): void {
		this.app.set('port', App.Config.PORT || 9000)
		this.app.set('env', App.Config.ENVIRONMENT || 'development')
		this.app.disable('x-powered-by')
	}

	// Http(s) request middleware
	private middleware(): void {
		if (App.Config.ENVIRONMENT !== 'test') {
			this.app.use(
				morganLogger('dev', {
					stream: {
						write: (message: string) => Logger.info(message.slice(0, -1)),
					},
				})
			)
		}
		this.app.use(cors())
		this.app.use(helmet())
		this.app.use(express.json())
		this.app.use(express.urlencoded({ extended: true }))
	}

	// Register Responders Dynamically
	private async registerResponders(): Promise<void> {
		this.app.use(async (_request: Request, response: Response, next: NextFunction) => {
			await _registerResponders(response)
			next()
		})
	}

	// Register Routes
	private async registerRoutes(): Promise<void> {
		this.app.patch(
			'/server-stat',
			Wrap(async (req: Request, res: Response) => {
				const { name, value } = req.body

				const serverStat = await App.Models.ServerStat.findOne({ name })
				if (serverStat) {
					serverStat.value = value ?? serverStat.value
					await serverStat.save()
					return res.success({
						message: 'Server Stat updated successfully.',
						item: serverStat,
					})
				} else {
					return res.notFound({
						message: 'Server stat not found.',
					})
				}
			})
		)

		this.app.get(
			'/server-stat',
			Wrap(async (req: Request, res: Response) => {
				const { name, startIndex = 0, itemsPerPage = 10 } = req.query
				const options = {
					startIndex: +startIndex,
					itemsPerPage: +itemsPerPage,
					query: _.omitBy(
						{ name: name ? new RegExp(name.toString()) : undefined },
						_.isNil
					),
					projection: {
						name: 1,
						value: 1,
					},
					model: App.Models.ServerStat,
				}

				const result = await Paginator.Paginate(options)

				return res.success({ ...result })
			})
		)

		this.app.put('*', maintenanceMode)
		this.app.post('*', maintenanceMode)
		this.app.patch('*', maintenanceMode)
		this.app.delete('*', maintenanceMode)

		this.app.use('/api/v1/', AppRoutes)
		// Handle the 404 errors
		this.app.use((_req: Request, res: Response) => {
			return res.notFound()
		})
	}

	// Connect Database
	private async connectDatabase(): Promise<void> {
		const database = new Database({
			url: App.Config.DB_CONNECTION_STRING,
			connectionOptions: App.Config.DB_CONNECTION_OPTIONS,
		})
		await database.connect()
		Global.App.Database = database
	}

	private async cron() {
		cron.schedule('* * * * *', async () => {
			Logger.info('Cron service started.')
			await DatabaseHelper.monitorAndCleanup()
		})
	}

	// Do things after the server starts
	async onServerStart(): Promise<any> {
		Logger.info(`App is running at ${App.Config.HOST} in ${App.Config.ENVIRONMENT} mode.`)
		Logger.info('Press CTRL-C to stop')
	}
}

export default new Application()
