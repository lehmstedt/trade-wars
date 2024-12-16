import type { Resource } from "@/domain/entities/Resource";
import type { Country } from "@/domain/entities/Country";

export interface IPriceProvider {

    getPrice(buyer: Country, seller: Country, resource: Resource, currency: Resource): Promise<number
}