import type { Resource } from "@/domain/entities/Resource";

export interface IPriceProvider {

    getPriceForResource(resource: Resource, currencyResource: Resource): Promise<number|undefined>
}