import type { Country } from "@/domain/entities/Country"
import type { Resource } from "@/domain/entities/Resource"

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