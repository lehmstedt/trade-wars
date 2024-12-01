import { CountryNotFoundError, ResourceNotFoundError } from "@/domain/Errors"
import type { ICountryRepository } from "@/domain/interfaces/ICountryRepository"
import type { Country, CountryId } from "@/domain/entities/Country"
import type { IResourceRepository } from "@/domain/interfaces/IResourceRepository"

export class SetTariff{

    countryRepo: ICountryRepository
    resourceRepo: IResourceRepository
    constructor(countryRepo: ICountryRepository, resourceRepo: IResourceRepository){
        this.countryRepo = countryRepo
        this.resourceRepo = resourceRepo
    }

    async execute(countryId: CountryId, rate: number, resourceName: string){
        const country = await this.countryRepo.getById(countryId)

        if(!country){
            throw new CountryNotFoundError()
        }

        const resource = await this.resourceRepo.getByName(resourceName)
        if(!resource){
            throw new ResourceNotFoundError()
        }

        country.setTariff(rate, resource)

        await this.countryRepo.save(country)

    }
}