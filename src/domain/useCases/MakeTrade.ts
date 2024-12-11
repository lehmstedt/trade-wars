import type { ICountryRepository } from "@/domain/ports/ICountryRepository";
import type { IResourceRepository } from "@/domain/ports/IResourceRepository";
import type { Resource } from "@/domain/entities/Resource";
import { 
    BuyerResourceNotFoundError,
    CountryNotFoundError,
    InsufficientResourceFromBuyerError,
    InsufficientResourceFromSellerError,
    NoPriceEstablishedError,
    SellerResourceNotFoundError } from "@/domain/Errors";
import type { Country, CountryId } from "@/domain/entities/Country";
import type { IPriceProvider } from "@/domain/IPriceProvider";


export class TradeLeg {
    countryId: CountryId
    resource: Resource
    quantity?: number
    constructor(country: Country, proposedResource: Resource, quantity?: number){
        this.countryId = country.id
        this.resource = proposedResource
        this.quantity = quantity
    }
}

export class TradeRequest {
    buyer: TradeLeg
    seller: TradeLeg

    constructor(buyer: TradeLeg, seller: TradeLeg){
        this.buyer = buyer
        this.seller = seller
    }
}

export class MakeTrade {

    countryRepository: ICountryRepository
    resourceRepository: IResourceRepository
    priceProvider: IPriceProvider

    constructor(countryRepository: ICountryRepository, resourceRepository: IResourceRepository, priceProvider: IPriceProvider){
        this.countryRepository = countryRepository
        this.resourceRepository = resourceRepository
        this.priceProvider = priceProvider
    }

    async execute(request: TradeRequest): Promise<void>{
        const buyer = await this.tryGetCountry(request.buyer.countryId)
        const seller = await this.tryGetCountry(request.seller.countryId)

        const sellerResource = await this.resourceRepository.getByName(request.seller.resource.name)
        if(!sellerResource){
            throw new SellerResourceNotFoundError()
        }

        const buyerResource = await this.resourceRepository.getByName(request.buyer.resource.name)
        if(!buyerResource){
            throw new BuyerResourceNotFoundError()
        }

        if(request.seller.quantity && seller.getResourceQty(request.seller.resource.name) < request.seller.quantity){
            throw new InsufficientResourceFromSellerError()
        }

        const price = await this.priceProvider.getPriceForResource(request.seller.resource, request.buyer.resource)
        if(!price){
            throw new NoPriceEstablishedError()
        }

        if(buyer.getResourceQty(buyerResource.name) < price){
            throw new InsufficientResourceFromBuyerError()
        }

    }

    private async tryGetCountry(countryId: CountryId){
        const country = await this.countryRepository.getById(countryId)
        if(!country){
            throw new CountryNotFoundError()
        }
        return country
    }
}