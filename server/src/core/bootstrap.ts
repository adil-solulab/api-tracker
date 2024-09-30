import '@core/declarations'
import '@core/globals'
import { Application } from 'app'
import JWTHelper from '@helpers/jwt.helper'
import { MAINTENANCE_MODE_ENUM } from '@models/server-stat'

export default async (app: Application) => {
  // eslint-disable-line
  try {
    
      const stats = await App.Models.Tracker.collection.stats({ scale: 1024 })
      const totalStorage = stats.storageSize;
      const dataSize = stats.size;
      const thresholdPercentage = 84
      const storageUsed = (Math.round((dataSize / 460800) * 100))

      Logger.warn(`Storage Usage: ${storageUsed}%`)
      Logger.warn(`Used: ${(dataSize / 1024).toFixed(2)}MB`)
      if (storageUsed >= thresholdPercentage) {
          Logger.info(`Database storage is full | Performing Delete operation`)
          
      }
   
  
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
