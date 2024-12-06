import { type Resource } from "@/domain/entities/Resource";
import type { IResourceRepository } from "@/domain/interfaces/IResourceRepository";

export class InMemoryResourceRepository implements IResourceRepository{

    async list(): Promise<Resource[]> {
        return Array.from(this.resources.values())
    }

    async saveBulk(resources: Resource[]): Promise<void> {
        for (const resource of resources){
            this.resources.set(resource.name, resource)
        }
    }
    resources = new Map<string, Resource>()
    async add(resource: Resource): Promise<void> {
        this.resources.set(resource.name, resource)
    }
    async getByName(name: string): Promise<Resource|undefined> {
        return this.resources.get(name)
    }

}