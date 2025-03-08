import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { CountryId } from '@/domain/entities/Country'

export type ResourceListEntry = {name: string, quantity: number}

export type CountryListEntry = 
{ 
  id: CountryId;
  name: string,
  stateResources: ResourceListEntry[]
}

export class ForListingCountries {
  forListingCountries: ICountryPort

  constructor(forListingCountries: ICountryPort) {
    this.forListingCountries = forListingCountries
  }

  async execute(): Promise<CountryListEntry[]> {
    return (await this.forListingCountries.list())
    .map(country => ({
      id: country.id,
      name: country.name,
      stateResources: Array.from(country.stateResources.entries()).map(entry => ({name: entry[0], quantity: entry[1]}))
    }))
  }
}
