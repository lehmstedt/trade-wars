import type { ICountryRepository } from "@/domain/drivenPorts/ICountryRepository";
import type { IResourceRepository } from "@/domain/drivenPorts/IResourceRepository";
import { CountryNotFoundError, ResourceNotFoundError } from "@/domain/Errors";
import { CountryId, type Country, type ResourceInventory } from "@/domain/entities/Country";
import type { Resource } from "@/domain/entities/Resource";
import type { IPriceProvider } from "../IPriceProvider";
import { CountryPairPriceProvider } from "@/domain/CountryPairPriceProvider";


export class Game {
    countryRepository: ICountryRepository
    resourceRepository: IResourceRepository
    priceProvider: IPriceProvider
    constructor(countryRepository: ICountryRepository, resourceRepository: IResourceRepository, priceProvider: IPriceProvider = new CountryPairPriceProvider){
        this.countryRepository = countryRepository
        this.resourceRepository = resourceRepository
        this.priceProvider = priceProvider
    }

    async getResourcePrice(resourceName: string, expressedResourceName: string, countryId: CountryId): Promise<number>{
        const resource = await this.resourceRepository.getByName(resourceName)
        if(!resource){
            throw new ResourceNotFoundError()
        }
        const country = await this.tryGetCountry(countryId)
        if(resource.name === expressedResourceName){
            return 1
        }
        const expressedResource = await this.resourceRepository.getByName(expressedResourceName)
        if(!expressedResource){
            throw new ResourceNotFoundError()
        }

        return country.expressResourcePriceInGivenResource(resource, expressedResource)
    }

    async listResourcePrices(countryId: CountryId){
        const resources = await this.resourceRepository.list()
        const country = await this.tryGetCountry(countryId)
        const resourcePrices = new Map<string, Map<string, number>>()
        for (const expressedResource of resources){
            const resourceEntry = new Map<string, number>()
            for (const comparedResource of resources){
                resourceEntry.set(comparedResource.name, country.expressResourcePriceInGivenResource(expressedResource, comparedResource))
            }
            resourcePrices.set(expressedResource.name, resourceEntry)
        }
        return resourcePrices
    }

    async listResources(): Promise<Resource[]>{
        return this.resourceRepository.list()
    }

    async listCountries(): Promise<Country[]>{
        return await this.countryRepository.list()
    }

    async listCountryInventory(id: CountryId): Promise<ResourceInventory[]>{
        const country = await this.tryGetCountry(id)

        return country.getResourceInventories()
    }

    private async tryGetCountry(countryId: CountryId){
        const country = await this.countryRepository.getById(countryId)
        if(!country){
            throw new CountryNotFoundError()
        }
        return country
    }
    
}