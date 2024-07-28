import type { Resource } from './Resource'

export class Country {
  constructor() {
    this.resource = undefined
  }
  resource?: Resource
  setResource(resource: Resource): void {
    this.resource = resource
  }
  getResourceQty(resourceName: string): number {
    if (this.resource) {
      return this.resource.qty
    }
    return 0
  }
  receiveResource(resourceToReceive: Resource) {
    if (this.resource) {
      this.resource.qty += resourceToReceive.qty
    }
  }
  tradeWith(
    country: Country,
    resourceToOffer: string,
    resourceToOfferQty: number,
    resourceToReceive: string,
    resourceToReceiveQty: number
  ) {}
}
