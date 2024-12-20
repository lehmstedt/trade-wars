import { type Resource } from "@/domain/entities/Resource";
import type { IResourceRepository } from "@/domain/drivenPorts/IResourceRepository";

export class InMemoryResourceRepository implements IResourceRepository{

    resources = new Map<string, Resource>()

    constructor(resources?: Resource[]){
        if(resources){
            for (const resource of resources){
                this.resources.set(resource.name, resource)
            }
        }
    }

    async list(): Promise<Resource[]> {
        return Array.from(this.resources.values())
    }

    async saveBulk(resources: Resource[]): Promise<void> {
        for (const resource of resources){
            this.resources.set(resource.name, resource)
        }
    }
    
    async add(resource: Resource): Promise<void> {
        this.resources.set(resource.name, resource)
    }
    async getByName(name: string): Promise<Resource|undefined> {
        return this.resources.get(name)
    }

}