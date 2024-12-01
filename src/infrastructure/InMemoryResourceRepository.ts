import { type Resource } from "@/domain/entities/Resource";
import type { IResourceRepository } from "@/domain/interfaces/IResourceRepository";

export class InMemoryResourceRepository implements IResourceRepository{
    resources = new Map<string, Resource>()
    async add(resource: Resource): Promise<void> {
        this.resources.set(resource.name, resource)
    }
    async getByName(name: string): Promise<Resource|undefined> {
        return this.resources.get(name)
    }

}