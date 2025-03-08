import type { Resource } from '@/domain/entities/Resource'

export type ResourceInventoryEntry = { name: string; quantity: number }

export class ResourceInventory {
  #map = new Map<string, number>()

  add(resource: Resource, quantity: number) {
    const previousQuantity = this.getQuantity(resource)
    this.#map.set(resource.name, quantity + previousQuantity)
  }

  getQuantity(resource: Resource) {
    return this.#map.get(resource.name) ?? 0
  }

  list(): ResourceInventoryEntry[] {
    return Array.from(this.#map.entries()).map((entry) => ({ name: entry[0], quantity: entry[1] }))
  }

  moveTo(inventory: ResourceInventory, resource: Resource, quantity: number) {
    inventory.add(resource, quantity)
    this.add(resource, -quantity)
  }
}
