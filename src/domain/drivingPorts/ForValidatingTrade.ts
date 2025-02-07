import { BuyerCountryNotFoundError, BuyerResourceNotFoundError, InsufficientResourceFromBuyerError, InsufficientResourceFromSellerError, NoPriceEstablishedError, SellerCountryNotFoundError, SellerResourceNotFoundError, type ITradeError } from "@/domain/Errors"
import type { ForValidatingTradeCountry } from "@/domain/drivenPorts/ForValidatingTradeCountry"
import type { ForValidatingTradeResource } from "@/domain/drivenPorts/ForValidatingTradeResource"
import type { ForCalculatingPrice } from "@/domain/drivenPorts/ForCalculatingPrice"
import type { TradeRequest } from "@/domain/entities/TradeRequest"
import { TradeValidation, TradeValidationStatus } from "@/domain/entities/TradeValidation"


export class ForValidatingTrade {

    forValidatingTradeCountry : ForValidatingTradeCountry
    forValidatingTradeResource: ForValidatingTradeResource
    forCalculatingPrice: ForCalculatingPrice

    constructor(forValidatingTradeCountry: ForValidatingTradeCountry, forValidatingTradeResource: ForValidatingTradeResource, forCalculatingPrice: ForCalculatingPrice){
        this.forValidatingTradeCountry = forValidatingTradeCountry
        this.forValidatingTradeResource = forValidatingTradeResource
        this.forCalculatingPrice = forCalculatingPrice
    }

    async execute(request: TradeRequest): Promise<TradeValidation>{

        const buyer = await this.forValidatingTradeCountry.getById(request.buyer.id)
        if(!buyer){
            return new TradeValidation(TradeValidationStatus.BuyerCountryNotFound)
        }
        const seller = await this.forValidatingTradeCountry.getById(request.seller.id)
        if(!seller){
            return new TradeValidation(TradeValidationStatus.SellerCountryNotFound)
        }

        const sellerResource = await this.forValidatingTradeResource.getByName(request.soldResource.name)
        if(!sellerResource){
            return new TradeValidation(TradeValidationStatus.SellerResourceNotFound)
        }

        const buyerResource = await this.forValidatingTradeResource.getByName(request.currency.name)
        if(!buyerResource){
            return new TradeValidation(TradeValidationStatus.BuyerResourceNotFound)
        }

        if(seller.getResourceQty(request.soldResource) < request.soldQuantity){
            return new TradeValidation(TradeValidationStatus.InsufficientResourceFromSeller)
        }

        const unitPrice = this.forCalculatingPrice.getPrice(buyer, seller, request.soldResource, request.currency)
        if(!unitPrice){
            return new TradeValidation(TradeValidationStatus.NoPriceEstablished)
        }

        const price = unitPrice * request.soldQuantity

        if(buyer.getResourceQty(buyerResource) < price){
            return new TradeValidation(TradeValidationStatus.InsufficientResourceFromBuyer, price)
        }

        return new TradeValidation(TradeValidationStatus.OK, price)
    }
}