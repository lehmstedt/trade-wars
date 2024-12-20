import { Resource } from "@/domain/entities/Resource";
import { Tariff } from "@/domain/entities/Tariff";
import { UnknownGoalError } from "@/domain/Errors";

export type ResourceInventory = { name: string; qty: number }
type Goal = {resource: Resource, quantity: number }

export class CountryId{
  value: string

  constructor(value: string){
      this.value = value
  }

  equals(id: CountryId){
    return this.value === id.value
  }
}

export class Country {
  
  resources: Map<string, number>
  id: CountryId
  tariffs: Map<string, number>
  name: string
  goals: Map<string, Goal>

  constructor(name: string) {
    this.resources = new Map<string, number>()
    this.tariffs = new Map<string, number>()
    this.id = new CountryId(name)
    this.name = name
    this.goals = new Map<string, Goal>()
  }

  setTariff(rate: number, resource: Resource) {
    this.tariffs.set(resource.name, rate)
  }

  setResource(resource: Resource, resourceQty: number): void {
    this.resources.set(resource.name, resourceQty)
  }

  getResourceQty(resource: Resource): number {
    return this.resources.get(resource.name) ?? 0
  }
  receiveResource(resource: Resource, resourceQty: number) {
    const qty = this.getResourceQty(resource) + resourceQty
    this.setResource(resource, qty)
  }
  tradeWith(
    country: Country,
    resourceToOffer: Resource,
    resourceToOfferQty: number,
    resourceToReceive: Resource,
    resourceToReceiveQty: number
  ) {
    this.sendResource(country, resourceToOffer, resourceToOfferQty)
    country.sendResource(this, resourceToReceive, resourceToReceiveQty)
  }
  sendResource(country: Country, resource: Resource, qty: number) {
    this.receiveResource(resource, -qty)
    country.receiveResource(resource, qty)
  }
  getResourceInventories(): ResourceInventory[] {
    const inventories: ResourceInventory[] = []
    for (const [name, qty] of this.resources) {
      inventories.push({ name, qty })
    }
    return inventories
  }
  canTrade(offeredResource: Resource, offeredQty: number) {
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
  expressResourcePriceInGivenResource(resource: Resource, currency: Resource): number|undefined {
    const resourceQty = this.getResourceQty(resource)
    const expressedResourceQty = this.getResourceQty(currency)
    if (resourceQty === expressedResourceQty) {
      return 1
    }
    if (resourceQty === 0 || expressedResourceQty === 0) {
      return undefined
    }
    return expressedResourceQty / resourceQty
  }
  setGoal(resource: Resource, quantity: number){
    this.goals.set(resource.name, {resource, quantity})
  }

  listGoals(): Goal[]{
    return Array.from(this.goals.values())
  }
  hasReachedGoal(resource: Resource){
    const goal = this.goals.get(resource.name)
    if(!goal){
      throw new UnknownGoalError()
    }
    return this.getResourceQty(goal.resource) >= goal.quantity
  }
  hasReachedHisGoals() {
    const goals = this.listGoals()
    for (const goal of goals) {
      if (!this.hasReachedGoal(goal.resource)) {
        return false
      }
       
    }
    return true
  }
}
