import { type Resource } from '@/domain/entities/Resource'
import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'

export class InMemoryResourceRepository implements IResourcePort {
  resources = new Map<string, Resource>()

  constructor(resources?: Resource[]) {
    if (resources) {
      for (const resource of resources) {
        this.resources.set(resource.name, resource)
      }
    }
  }

  async list(): Promise<Resource[]> {
    return Array.from(this.resources.values())
  }

  async saveBulk(resources: Resource[]): Promise<void> {
    for (const resource of resources) {
      this.resources.set(resource.name, resource)
    }
  }

  async add(resource: Resource): Promise<void> {
    this.resources.set(resource.name, resource)
  }
  async getByName(name: string): Promise<Resource | undefined> {
    return this.resources.get(name)
  }
  set(resources: Resource[]) {
    this.resources.clear()
    resources.forEach((resource) => this.resources.set(resource.name, resource))
  }
}
