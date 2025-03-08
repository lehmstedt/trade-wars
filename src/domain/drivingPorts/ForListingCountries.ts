import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { CountryId } from '@/domain/entities/Country'

export type CountryListEntry = { id: CountryId; name: string }

export class ForListingCountries {
  forListingCountries: ICountryPort

  constructor(forListingCountries: ICountryPort) {
    this.forListingCountries = forListingCountries
  }

  async execute(): Promise<CountryListEntry[]> {
    return await this.forListingCountries.list()
  }
}
