import type { Resource } from "@/domain/entities/Resource"

export interface IResourceRepository {
    add(resource: Resource): Promise<void>
    getByName(name: string): Promise<Resource|undefined>
}