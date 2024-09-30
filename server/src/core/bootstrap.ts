import '@core/declarations'
import '@core/globals'
import { Application } from 'app'
import JWTHelper from '@helpers/jwt.helper'
import { MAINTENANCE_MODE_ENUM } from '@models/server-stat'

export default async (app: Application) => {
	// eslint-disable-line
	try {
		await Promise.all([
			CreateServerStateDefaults(),
			JWTHelper.GenerateKeys(), // #2 Generate Public and Private Keys if don't exist
		])
	} catch (error) {
		Logger.error(error)
	}
}

const CreateServerStateDefaults = async () => {
	const defaultServerStat = [
		{
			name: 'maintenance-mode',
			value: MAINTENANCE_MODE_ENUM.OFF,
		},
	]

	for (const stat of defaultServerStat) {
		const maintenanceModeState = await App.Models.ServerStat.findOne({
			name: stat.name,
		})
			.select('_id')
			.lean()

		if (!maintenanceModeState) {
			await App.Models.ServerStat.create(stat)
		}
	}
}
