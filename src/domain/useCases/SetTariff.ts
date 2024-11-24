import { CountryNotFoundError, ResourceNotFoundError } from "@/domain/Errors"
import type { ICountryRepository } from "@/domain/interfaces/ICountryRepository"
import type { CountryId } from "@/domain/entities/Country"
import type { IResourceRepository } from "@/domain/interfaces/IResourceRepository"
import type { ResourceId } from "@/domain/entities/Resource"

export class SetTariff{

    countryRepo: ICountryRepository
    resourceRepo: IResourceRepository
    constructor(countryRepo: ICountryRepository, resourceRepo: IResourceRepository){
        this.countryRepo = countryRepo
        this.resourceRepo = resourceRepo
    }

    async execute(countryId: CountryId, rate: number, resourceId: ResourceId){
        const country = await this.countryRepo.getById(countryId)

        if(!country){
            throw new CountryNotFoundError()
        }

        const resource = await this.resourceRepo.getById(resourceId)
        if(!resource){
            throw new ResourceNotFoundError()
        }

    }
}