import type { Resource } from "@/domain/entities/Resource";
import type { Country } from "@/domain/entities/Country";

export interface IPriceProvider {

    getPrice(owningCountry: Country, resource: Resource, currencyResource: Resource): Promise<number|undefined>
}