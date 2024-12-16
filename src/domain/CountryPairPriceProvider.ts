import type { Country } from "./entities/Country";
import type { Resource } from "./entities/Resource";
import type { IPriceProvider } from "./IPriceProvider";

export class CountryPairPriceProvider implements IPriceProvider {

    getPrice(buyer: Country, seller: Country, resource: Resource, currency: Resource): Promise<number> {
        return 1
    }


}