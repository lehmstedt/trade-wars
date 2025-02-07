import type { Resource } from "@/domain/entities/Resource";

export interface ForValidatingTradeResource {
    getByName(name: string): Promise<Resource|undefined>
}