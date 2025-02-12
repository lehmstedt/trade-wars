import type { ICountryRepository } from '@/domain/drivenPorts/ICountryRepository'
import type { IResourceRepository } from '@/domain/drivenPorts/IResourceRepository'
import { CountryNotFoundError } from '@/domain/Errors'
import { CountryId, type Country, type ResourceInventory } from '@/domain/entities/Country'
import type { Resource } from '@/domain/entities/Resource'
import type { IPriceProvider } from '../IPriceProvider'
import { CountryPairPriceProvider } from '@/domain/CountryPairPriceProvider'

export class Game {
  countryRepository: ICountryRepository
  resourceRepository: IResourceRepository
  priceProvider: IPriceProvider
  constructor(
    countryRepository: ICountryRepository,
    resourceRepository: IResourceRepository,
    priceProvider: IPriceProvider = new CountryPairPriceProvider()
  ) {
    this.countryRepository = countryRepository
    this.resourceRepository = resourceRepository
    this.priceProvider = priceProvider
  }

  async listResourcePrices(countryId: CountryId) {
    const resources = await this.resourceRepository.list()
    const country = await this.tryGetCountry(countryId)
    const resourcePrices = new Map<string, Map<string, number | undefined>>()
    for (const expressedResource of resources) {
      const resourceEntry = new Map<string, number | undefined>()
      for (const comparedResource of resources) {
        resourceEntry.set(
          comparedResource.name,
          country.expressResourcePriceInGivenResource(expressedResource, comparedResource)
        )
      }
      resourcePrices.set(expressedResource.name, resourceEntry)
    }
    return resourcePrices
  }

  async listResources(): Promise<Resource[]> {
    return this.resourceRepository.list()
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
