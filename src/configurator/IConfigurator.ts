import type { ForCheckingIfGameIsOver } from '@/domain/drivingPorts/ForCheckingIfGameIsOver'
import type { ForListingCountryGoals } from '@/domain/drivingPorts/ForListingCountryGoals'

export interface IConfigurator {
  buildForListingCountryGoals(): ForListingCountryGoals
  buildForCheckingIfGameIsOver(): ForCheckingIfGameIsOver
}
