import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'
import type { Resource } from '@/domain/entities/Resource'

export class ForListingResources {
  forListingResouces: IResourcePort

  constructor(forListingResources: IResourcePort) {
    this.forListingResouces = forListingResources
  }
  async execute(): Promise<Resource[]> {
    return this.forListingResouces.list()
  }
}
