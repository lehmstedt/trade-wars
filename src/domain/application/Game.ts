import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'
import { CountryNotFoundError } from '@/domain/Errors'
import { CountryId, type Country, type ResourceInventory } from '@/domain/entities/Country'
import type { IPriceProvider } from '../IPriceProvider'
import { CountryPairPriceProvider } from '@/domain/CountryPairPriceProvider'

export class Game {
  countryRepository: ICountryPort
  resourceRepository: IResourcePort
  priceProvider: IPriceProvider
  constructor(
    countryRepository: ICountryPort,
    resourceRepository: IResourcePort,
    priceProvider: IPriceProvider = new CountryPairPriceProvider()
  ) {
    this.countryRepository = countryRepository
    this.resourceRepository = resourceRepository
    this.priceProvider = priceProvider
  }

  async listCountries(): Promise<Country[]> {
    return await this.countryRepository.list()
  }

  async listCountryInventory(id: CountryId): Promise<ResourceInventory[]> {
    const country = await this.tryGetCountry(id)

    return country.getResourceInventories()
  }

  private async tryGetCountry(countryId: CountryId) {
    const country = await this.countryRepository.getById(countryId)
    if (!country) {
      throw new CountryNotFoundError()
    }
    return country
  }
}
