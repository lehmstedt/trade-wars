import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { CountryId, Goal } from '@/domain/entities/Country'

export class ForListingCountryGoals {
  forListingCountryGoals: ICountryPort

  constructor(forListingCountryGoals: ICountryPort) {
    this.forListingCountryGoals = forListingCountryGoals
  }

  async execute(countryId: CountryId): Promise<Goal[]> {
    const country = await this.forListingCountryGoals.getById(countryId)
    return country?.listGoals() ?? []
  }
}
