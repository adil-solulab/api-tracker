import dotenv from 'dotenv'
dotenv.config()
const APP_PORT: number = parseInt(process.env.DEV_PORT)
const DOMAIN_NAME: string = process.env.DOMAIN_NAME ?? 'localhost'
const HTTP_PROTOCOL: string = process.env.HTTP_PROTOCOL ?? 'http'

class config {
	port!: number
	host!: string
	sessionSecret!: string

	constructor() {
		this.port = APP_PORT
		this.host = process.env.HOST ?? `${HTTP_PROTOCOL}://${DOMAIN_NAME}${APP_PORT == 80 ? '' : `:${APP_PORT}`}`,
  
		this.sessionSecret = process.env.SESSION_SECRET || 'sessionsecretcarboncredit'
	}
}

export default new config()
