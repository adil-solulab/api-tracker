const config = require('../config')
const { GeneratePDF } = require('./pdf-creator.helper')
const { MongoClient } = require('mongodb')



class DatabaseService {
	private THRESHOLD_PERCENTAGE = App.Config.THRESHOLD_PERCENTAGE
	private URL = App.Config.SECONDARY_DB_URL
    private COLLECTION_NAME='reports'

	constructor() {
		this.URL = URL
		this.THRESHOLD_PERCENTAGE = this.THRESHOLD_PERCENTAGE
	}

	async connectToMongo() {
		const client = new MongoClient(this.URL)
		try {
			await client.connect()
			Logger.info('Secondary Database Connected Successfully.')
			return client
		} catch (error) {
			Logger.error(`Error Connecting to Secondary Database: ${error?.message}`)
			throw error
		}
	}

	async monitorAndCleanup() {
		try {
			const stats = await App.Models.Tracker.collection.stats({ scale: 1024 })
			const totalStorage = stats.storageSize
			const dataSize = stats.size
			const storageUsed = Math.round((dataSize / 460800) * 100)

			Logger.warn(`Storage Usage: ${storageUsed}%`)
			Logger.warn(`Used: ${(dataSize / 1024).toFixed(2)}MB`)

			if (storageUsed >= this.THRESHOLD_PERCENTAGE) {
				Logger.info('Database storage is full | Performing Delete operation')
				await this.moveDatabaseDocuments()
			}
		} catch (error) {
			Logger.error(error)
		}
	}

	async moveDatabaseDocuments() {
		const client = await this.connectToMongo()
		try {
			const db = client.db()
			const data = await GeneratePDF()
			const result = await db.collection(this.COLLECTION_NAME).insertMany(data)

			if (result) {
				await App.Models.Tracker.deleteMany()
			}
		} catch (error) {
			Logger.error(error)
		} finally {
			await client.close()
		}
	}

	async fetchArchivedData(dataObj) {
		const client = await this.connectToMongo()
		try {
			let { search, start, length, companyCode, startDate, endDate } = dataObj
			const orderBy = dataObj.columns[dataObj.order[0].column].data
			const orderByData = {}
			orderByData[orderBy] = dataObj.order[0].dir === 'asc' ? 1 : -1
			search = search.value !== '' ? search.value : false

			const db = client.db()
			const collection = db.collection(this.COLLECTION_NAME)

			let query = []

			if (startDate && endDate) {
				query.unshift({
					$match: {
						$or: [{ Date: startDate }, { Date: endDate }],
					},
				})
			}

			if (companyCode) {
				query.unshift({
					$match: { Company_Code: companyCode },
				})
			}

			query.push(
				{
					$group: {
						_id: {
							date: '$Date',
							companyCode: '$Company_Code',
						},
						'Hits/sec': { $first: '$Hits/sec' },
						Hits: { $first: '$Hits' },
					},
				},
				{
					$project: {
						_id: 0,
						Company_Code: '$_id.companyCode',
						Hits: 1,
						'Hits/sec': 1,
						Date: '$_id.date',
					},
				}
			)

			query.push({ $sort: orderByData })

			query.push({
				$facet: {
					list: [{ $skip: Number(start) || 0 }, { $limit: Number(length) || 10 }],
					totalRecords: [{ $count: 'count' }],
				},
			})

			const response = await collection.aggregate(query).toArray()
			const responseData = {
				draw: dataObj.draw,
				recordsTotal: response[0]?.totalRecords[0]?.count || 0,
				recordsFiltered: response[0]?.totalRecords[0]?.count || 0,
				data: response[0]?.list || [],
			}

			return responseData
		} catch (error) {
			Logger.error(error)
			return null
		} finally {
			await client.close()
		}
	}
}
