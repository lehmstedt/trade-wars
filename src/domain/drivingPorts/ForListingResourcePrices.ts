import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'
import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { CountryId } from '@/domain/entities/Country'
import { CountryNotFoundError } from '@/domain/Errors'

export class ForListingResourcePrices {
  forCheckingIfCountryIsExisting: ICountryPort
  forListingExistingResources: IResourcePort

  constructor(
    forCheckingIfCountryIsExisting: ICountryPort,
    forListingExistingResources: IResourcePort
  ) {
    this.forCheckingIfCountryIsExisting = forCheckingIfCountryIsExisting
    this.forListingExistingResources = forListingExistingResources
  }

  async execute(countryId: CountryId) {
    const resources = await this.forListingExistingResources.list()
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

  private async tryGetCountry(countryId: CountryId) {
    const country = await this.forCheckingIfCountryIsExisting.getById(countryId)
    if (!country) {
      throw new CountryNotFoundError()
    }
    return country
  }
}
