import type { ICountryRepository } from "@/domain/interfaces/ICountryRepository";
import type { IResourceRepository } from "@/domain/interfaces/IResourceRepository";
import { CountryNotFoundError, ResourceNotFoundError } from "@/domain/Errors";
import type { CountryId } from "@/domain/entities/Country";

export class Game {
    countryRepository: ICountryRepository
    resourceRepository: IResourceRepository
    constructor(countryRepository: ICountryRepository, resourceRepository: IResourceRepository){
        this.countryRepository = countryRepository
        this.resourceRepository = resourceRepository
    }

    async getResourcePrice(resourceName: string, countryId: CountryId): Promise<number>{
        const resource = await this.resourceRepository.getByName(resourceName)
        if(!resource){
            throw new ResourceNotFoundError()
        }

        const country = await this.countryRepository.getById(countryId)
        if(!country){
            throw new CountryNotFoundError()
        }


        return 1
    }
}