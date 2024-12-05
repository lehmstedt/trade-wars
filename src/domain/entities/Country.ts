import { Resource } from "@/domain/entities/Resource";
import { Tariff } from "@/domain/entities/Tariff";

type ResourceInventory = { name: string; qty: number }

export class CountryId{
  value: string

  constructor(value: string){
      this.value = value
  }
}

export class Country {
  
  resources: Map<string, number>
  id: CountryId
  tariffs: Map<string, number>

  constructor() {
    this.resources = new Map<string, number>()
    this.tariffs = new Map<string, number>()
    this.id = new CountryId("1")
  }

  setTariff(rate: number, resource: Resource) {
    this.tariffs.set(resource.name, rate)
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
  getResourceInventories(): ResourceInventory[] {
    const inventories: ResourceInventory[] = []
    for (const [name, qty] of this.resources) {
      inventories.push({ name, qty })
    }
    return inventories
  }
  canTrade(offeredResource: string, offeredQty: number) {
    return offeredQty <= this.getResourceQty(offeredResource)
  }
  getTariffOnResource(resource: Resource){
    return this.tariffs.get(resource.name)
  }
  listTariffs(): Tariff[]{
    const tariffs = []
    for (const [resourceName, rate] of this.tariffs.entries()){
      tariffs.push(new Tariff(resourceName, rate))
    }
    return tariffs
  }
}
