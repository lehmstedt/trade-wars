import type { ICountryPort } from "@/domain/drivenPorts/ICountryPort"
import type { Country } from "@/domain/entities/Country"

export class ForListingCountries {

    forListingCountries: ICountryPort

    constructor(forListingCountries: ICountryPort){
        this.forListingCountries = forListingCountries
    }

    async execute(): Promise<Country[]> {
        return await this.forListingCountries.list()
      }
}