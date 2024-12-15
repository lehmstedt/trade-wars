import type { ICountryRepository } from "@/domain/ports/ICountryRepository";
import type { IResourceRepository } from "@/domain/ports/IResourceRepository";
import type { Resource } from "@/domain/entities/Resource";
import { 
    BuyerCountryNotFoundError,
    BuyerResourceNotFoundError,
    InsufficientResourceFromBuyerError,
    InsufficientResourceFromSellerError,
    NoPriceEstablishedError,
    SellerCountryNotFoundError,
    SellerResourceNotFoundError } from "@/domain/Errors";
import { Country, type CountryId } from "@/domain/entities/Country";
import type { IPriceProvider } from "@/domain/IPriceProvider";


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
        const buyer = await this.countryRepository.getById(request.buyer.countryId)
        if(!buyer){
            throw new BuyerCountryNotFoundError()
        }
        const seller = await this.countryRepository.getById(request.seller.countryId)
        if(!seller){
            throw new SellerCountryNotFoundError()
        }

        const sellerResource = await this.resourceRepository.getByName(request.seller.resource.name)
        if(!sellerResource){
            throw new SellerResourceNotFoundError()
        }

        const buyerResource = await this.resourceRepository.getByName(request.buyer.resource.name)
        if(!buyerResource){
            throw new BuyerResourceNotFoundError()
        }

        if(seller.getResourceQty(request.seller.resource) < request.askedQuantity){
            throw new InsufficientResourceFromSellerError()
        }

        const price = await this.priceProvider.getPrice(seller, request.seller.resource, request.buyer.resource)
        if(!price){
            throw new NoPriceEstablishedError()
        }

        if(buyer.getResourceQty(buyerResource) < price){
            throw new InsufficientResourceFromBuyerError()
        }

        buyer.tradeWith(seller, buyerResource, price, sellerResource, request.askedQuantity)

        await this.countryRepository.save(buyer)
        await this.countryRepository.save(seller)

    }
}