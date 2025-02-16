import type { ICountryPort } from "@/domain/drivenPorts/ICountryPort"
import type { CountryId, ResourceInventory } from "@/domain/entities/Country"
import { CountryNotFoundError } from "@/domain/Errors"

export class ForListingCountryInventory {

    forGettingExistingCountryWithInventory: ICountryPort

    constructor(forGettingExistingCountryWithInventory: ICountryPort){
        this.forGettingExistingCountryWithInventory = forGettingExistingCountryWithInventory
    }

    async execute(id: CountryId): Promise<ResourceInventory[]> {
        const country = await this.tryGetCountry(id)
    
        return country.getResourceInventories()
      }
    
      private async tryGetCountry(countryId: CountryId) {
        const country = await this.forGettingExistingCountryWithInventory.getById(countryId)
        if (!country) {
          throw new CountryNotFoundError()
        }
        return country
      }
}