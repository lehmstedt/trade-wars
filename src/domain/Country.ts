export class Country {
  resources: Map<string, number>

  constructor() {
    this.resources = new Map<string, number>()
  }

  setResource(resourceName: string, resourceQty: number): void {
    this.resources.set(resourceName, resourceQty)
  }

  getResourceQty(resourceName: string): number {
    return this.resources.get(resourceName) ?? 0
  }
  receiveResource(resourceName: string, resourceQty: number) {
    const qty = this.getResourceQty(resourceName) + resourceQty
    this.setResource(resourceName, qty)
  }
  tradeWith(
    country: Country,
    resourceToOffer: string,
    resourceToOfferQty: number,
    resourceToReceive: string,
    resourceToReceiveQty: number
  ) {
    this.setResource(resourceToOffer, 0)
    this.setResource(resourceToReceive, resourceToReceiveQty)

    country.setResource(resourceToOffer, resourceToOfferQty)
    country.setResource(resourceToReceive, 0)
  }
}
