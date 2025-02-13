import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'
import type { Resource } from '@/domain/entities/Resource'

export class ForListingResources {
  forListingResources: IResourcePort

  constructor(forListingResources: IResourcePort) {
    this.forListingResources = forListingResources
  }
  async execute(): Promise<Resource[]> {
    return this.forListingResources.list()
  }
}
