import type { Country } from "./entities/Country";
import type { Resource } from "./entities/Resource";
import type { IPriceProvider } from "./IPriceProvider";

export class CountryPairPriceProvider implements IPriceProvider {

    getPrice(buyer: Country, seller: Country, resource: Resource, currency: Resource): number {
        const sellerPrice = seller.expressResourcePriceInGivenResource(resource, currency)
        if(sellerPrice){
            return sellerPrice
        }
        const buyerPrice = buyer.expressResourcePriceInGivenResource(resource, currency)
        if(buyerPrice){
            return buyerPrice
        }
        return 1
    }


}