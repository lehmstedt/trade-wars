import type { Resource, ResourceId } from "@/domain/entities/Resource"

export interface IResourceRepository {
    add(resource: Resource): Promise<void>
    getById(id: ResourceId): Promise<Resource|undefined>
}