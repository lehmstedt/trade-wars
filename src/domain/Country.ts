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
    this.sendResource(country, resourceToOffer, resourceToOfferQty)
    country.sendResource(this, resourceToReceive, resourceToReceiveQty)
  }
  sendResource(country: Country, resourceName: string, qty: number) {
    this.receiveResource(resourceName, -qty)
    country.receiveResource(resourceName, qty)
  }
}
