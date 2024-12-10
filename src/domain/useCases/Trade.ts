import type { ICountryRepository } from "@/domain/interfaces/ICountryRepository";
import type { IResourceRepository } from "@/domain/interfaces/IResourceRepository";
import type { Resource } from "@/domain/entities/Resource";
import { CountryNotFoundError, InsufficientResourceError, ResourceNotFoundError } from "@/domain/Errors";
import type { CountryId } from "@/domain/entities/Country";

export class Trade {

    countryRepository: ICountryRepository
    resourceRepository: IResourceRepository

    constructor(countryRepository: ICountryRepository, resourceRepository: IResourceRepository){
        this.countryRepository = countryRepository
        this.resourceRepository = resourceRepository
    }

    async execute(buyerId: CountryId, sellerId: CountryId, resourceToBuy: Resource, quantity: number): Promise<void>{
        await this.tryGetCountry(buyerId)
        const seller = await this.tryGetCountry(sellerId)
        await this.tryGetResource(resourceToBuy)

        if(seller.getResourceQty(resourceToBuy.name) === 0){
            throw new InsufficientResourceError()
        }
    }

    private async tryGetCountry(countryId: CountryId){
        const country = await this.countryRepository.getById(countryId)
        if(!country){
            throw new CountryNotFoundError()
        }
        return country
    }

    private async tryGetResource(resource: Resource){
        const existingResource = await this.resourceRepository.getByName(resource.name)
        if(!existingResource){
            throw new ResourceNotFoundError()
        }
        return existingResource
    }
}