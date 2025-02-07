import type { Country } from "@/domain/entities/Country";
import type { Resource } from "@/domain/entities/Resource";

export interface ForCalculatingPrice {
    getPrice(buyer: Country, seller: Country, resource: Resource, currency: Resource): number
}