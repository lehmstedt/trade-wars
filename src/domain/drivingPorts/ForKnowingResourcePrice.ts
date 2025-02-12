import type { CountryId } from "@/domain/entities/Country"
import type { IResourceRepository } from "@/domain/drivenPorts/IResourceRepository"
import type { ICountryRepository } from "@/domain/drivenPorts/ICountryRepository"
import { CountryNotFoundError, ResourceNotFoundError } from "@/domain/Errors"

export class ForKnowingResourcePrice {

    forCheckingIfResourceIsExisting: IResourceRepository
    forKnowingACountryResourcePrices: ICountryRepository

    constructor(forKnowingACountryResourcePrices: ICountryRepository, forCheckingIfResourceIsExisting: IResourceRepository){
        this.forCheckingIfResourceIsExisting = forCheckingIfResourceIsExisting
        this.forKnowingACountryResourcePrices = forKnowingACountryResourcePrices
    }

    async execute(
        resourceName: string,
        expressedResourceName: string,
        countryId: CountryId
      ): Promise<number | undefined> {
        const resource = await this.forCheckingIfResourceIsExisting.getByName(resourceName)
        if (!resource) {
          throw new ResourceNotFoundError()
        }
        const country = await this.tryGetCountry(countryId)
        if (resource.name === expressedResourceName) {
          return 1
        }
        const expressedResource = await this.forCheckingIfResourceIsExisting.getByName(expressedResourceName)
        if (!expressedResource) {
          throw new ResourceNotFoundError()
        }
    
        return country.expressResourcePriceInGivenResource(resource, expressedResource)
      }

      private async tryGetCountry(countryId: CountryId) {
          const country = await this.forKnowingACountryResourcePrices.getById(countryId)
          if (!country) {
            throw new CountryNotFoundError()
          }
          return country
        }

}

