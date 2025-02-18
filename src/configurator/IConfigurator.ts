import type { ForListingCountryGoals } from '@/domain/drivingPorts/ForListingCountryGoals'

export interface IConfigurator {
  buildForListingCountryGoals(): ForListingCountryGoals
}
