import { ResourceId, type Resource } from "@/domain/entities/Resource";
import type { IResourceRepository } from "@/domain/interfaces/IResourceRepository";

export class InMemoryResourceRepository implements IResourceRepository{
    resources = new Map<ResourceId, Resource>()
    async add(resource: Resource): Promise<void> {
        this.resources.set(resource.id, resource)
    }
    async getById(id: ResourceId): Promise<Resource|undefined> {
        return this.resources.get(id)
    }

}