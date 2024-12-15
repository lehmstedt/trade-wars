import type { Country } from "@/domain/entities/Country";
import type { Resource } from "@/domain/entities/Resource";
import type { IPriceProvider } from "@/domain/IPriceProvider";

export class CountryPriceProvider implements IPriceProvider {

    async getPrice(owningCountry: Country, resource: Resource, currencyResource: Resource): Promise<number | undefined> {
        return owningCountry.expressResourcePriceInGivenResource(resource, currencyResource)
    }

}