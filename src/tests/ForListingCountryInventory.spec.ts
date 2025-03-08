import { TestConfigurator } from '@/configurator/TestConfigurator'
import { Country } from '@/domain/entities/Country'
import { Resource } from '@/domain/entities/Resource'
import { describe, expect, test } from 'vitest'

const testConfigurator = new TestConfigurator()

describe('For listing country inventory', () => {
  test('A country inventory can be listed when attributing resources', async () => {
    const country = new Country('France')
    const wine = new Resource('Wine')
    const cheese = new Resource('Cheese')
    country.receiveResource(wine, 1)
    country.receiveResource(cheese, 2)

    const forListingCountryInventory = testConfigurator.buildForListingCountryInventory([country])

    const inventory = await forListingCountryInventory.execute(country.id)

    expect(inventory).toContainEqual({ name: wine.name, quantity: 1 })
    expect(inventory).toContainEqual({ name: cheese.name, quantity: 2 })
  })
})
