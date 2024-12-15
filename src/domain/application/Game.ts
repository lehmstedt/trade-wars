import type { ICountryRepository } from "@/domain/ports/ICountryRepository";
import type { IResourceRepository } from "@/domain/ports/IResourceRepository";
import { BuyerCountryNotFoundError, BuyerResourceNotFoundError, CountryNotFoundError, InsufficientResourceFromBuyerError, InsufficientResourceFromSellerError, NoPriceEstablishedError, ResourceNotFoundError, SellerCountryNotFoundError, SellerResourceNotFoundError, type ITradeError } from "@/domain/Errors";
import { CountryId, type Country, type ResourceInventory } from "@/domain/entities/Country";
import type { Resource } from "@/domain/entities/Resource";
import type { IPriceProvider } from "../IPriceProvider";

export class TradeId {

}

export class TradeValidation {
    isValid: Boolean = false
    price?: number = 0
    error?: ITradeError = {}

    constructor(error?: ITradeError, price?: number){

        this.price = price
        this.error = error
        
        if(!this.error){
            this.isValid = true
        }
    }
}

export class TradeRequest {
    buyer: Country
    seller: Country
    soldResource: Resource
    soldQuantity: number
    currency: Resource

    constructor(buyer: Country, seller: Country, soldResource: Resource, soldQuantity: number, currency: Resource){
        this.buyer = buyer
        this.seller = seller
        this.soldResource = soldResource
        this.soldQuantity = soldQuantity
        this.currency = currency
    }

}

export class Game {
    countryRepository: ICountryRepository
    resourceRepository: IResourceRepository
    priceProvider: IPriceProvider
    constructor(countryRepository: ICountryRepository, resourceRepository: IResourceRepository, priceProvider: IPriceProvider){
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

    async makeTrade(request: TradeRequest): Promise<void> {
        
        const validation = await this.validateTrade(request)
        if(!validation.isValid){
            throw validation.error
        }

        request.buyer.tradeWith(request.seller, request.currency, validation.price ?? 0, request.soldResource, request.soldQuantity)

        await this.countryRepository.save(request.buyer)
        await this.countryRepository.save(request.seller)
    }

    async validateTrade(request: TradeRequest): Promise<TradeValidation>{

        const buyer = await this.countryRepository.getById(request.buyer.id)
        if(!buyer){
            return new TradeValidation(new BuyerCountryNotFoundError())
        }
        const seller = await this.countryRepository.getById(request.seller.id)
        if(!seller){
            return new TradeValidation(new SellerCountryNotFoundError())
        }

        const sellerResource = await this.resourceRepository.getByName(request.soldResource.name)
        if(!sellerResource){
            return new TradeValidation(new SellerResourceNotFoundError())
        }

        const buyerResource = await this.resourceRepository.getByName(request.currency.name)
        if(!buyerResource){
            return new TradeValidation(new BuyerResourceNotFoundError())
        }

        if(seller.getResourceQty(request.soldResource) < request.soldQuantity){
            return new TradeValidation(new InsufficientResourceFromSellerError())
        }

        const unitPrice = await this.priceProvider.getPrice(seller, request.soldResource, request.currency)
        if(!unitPrice){
            return new TradeValidation(new NoPriceEstablishedError())
        }

        const price = unitPrice * request.soldQuantity

        if(buyer.getResourceQty(buyerResource) < price){
            return new TradeValidation(new InsufficientResourceFromBuyerError(), price)
        }

        return new TradeValidation(undefined, price)
    }

    private async tryGetCountry(countryId: CountryId){
        const country = await this.countryRepository.getById(countryId)
        if(!country){
            throw new CountryNotFoundError()
        }
        return country
    }
    
}