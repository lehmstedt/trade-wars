import { Resource } from '@/domain/entities/Resource'
import { ResourceInventory, type ResourceInventoryEntry } from '@/domain/entities/ResourceInventory'
import { Tariff } from '@/domain/entities/Tariff'
import { UnknownGoalError } from '@/domain/Errors'

export type Goal = { resource: Resource; quantity: number }

export class CountryId {
  value: string

  constructor(value: string) {
    this.value = value
  }

  equals(id: CountryId) {
    return this.value === id.value
  }
}

export class Country {
  #resources: ResourceInventory
  id: CountryId
  tariffs: Map<string, number>
  name: string
  goals: Map<string, Goal>
  #stateResources: ResourceInventory

  constructor(name: string = 'unnamed') {
    this.#resources = new ResourceInventory()
    this.tariffs = new Map<string, number>()
    this.id = new CountryId(name)
    this.name = name
    this.goals = new Map<string, Goal>()
    this.#stateResources = new ResourceInventory()
  }

  setTariff(rate: number, resource: Resource) {
    this.tariffs.set(resource.name, rate)
  }

  getResourceQty(resource: Resource): number {
    return this.#resources.getQuantity(resource)
  }
  receiveResource(resource: Resource, resourceQty: number) {
    this.#resources.add(resource, resourceQty)
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
  getResourceInventories(): ResourceInventoryEntry[] {
    return this.#resources.list()
  }
  canTrade(offeredResource: Resource, offeredQty: number) {
    return offeredQty <= this.getResourceQty(offeredResource)
  }
  getTariffOnResource(resource: Resource) {
    return this.tariffs.get(resource.name) ?? 0
  }
  listTariffs(): Tariff[] {
    const tariffs = []
    for (const [resourceName, rate] of this.tariffs.entries()) {
      tariffs.push(new Tariff(resourceName, rate))
    }
    return tariffs
  }
  expressResourcePriceInGivenResource(resource: Resource, currency: Resource): number | undefined {
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
  setGoal(resource: Resource, quantity: number) {
    this.goals.set(resource.name, { resource, quantity })
  }

  listGoals(): Goal[] {
    return Array.from(this.goals.values())
  }
  hasReachedGoal(resource: Resource) {
    const goal = this.goals.get(resource.name)
    if (!goal) {
      throw new UnknownGoalError()
    }
    return this.getResourceQty(goal.resource) >= goal.quantity
  }
  hasReachedHisGoals() {
    const goals = this.listGoals()
    if (goals.length === 0) {
      return false
    }
    for (const goal of goals) {
      if (!this.hasReachedGoal(goal.resource)) {
        return false
      }
    }
    return true
  }
  payTariff(resource: Resource, amount: number) {
    this.#resources.moveTo(this.#stateResources, resource, amount)
  }
  getStateResourceQuantity(resource: Resource) {
    return this.#stateResources.getQuantity(resource)
  }
  listStateResources() {
    return this.#stateResources.list()
  }
  receiveStateResource(resource: Resource, quantity: number) {
    this.#stateResources.add(resource, quantity)
  }
}
