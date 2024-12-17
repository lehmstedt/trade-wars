import type { Country } from "@/domain/entities/Country";
import type { Resource } from "@/domain/entities/Resource";
import type { IPriceProvider } from "@/domain/IPriceProvider";

export class CountryPriceProvider implements IPriceProvider {

    getPrice(owningCountry: Country, resource: Resource, currencyResource: Resource): number {
        return owningCountry.expressResourcePriceInGivenResource(resource, currencyResource) ?? 1
    }

}