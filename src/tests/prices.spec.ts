import { TestConfigurator } from '@/configurator/TestConfigurator'
import { Country } from '@/domain/entities/Country'
import { Resource } from '@/domain/entities/Resource'
import { describe, expect, test } from 'vitest'

const testConfigurator = new TestConfigurator()

describe('prices', () => {

  test('Wine, Beer and Chocolate can be expressed from each other when country has those resources in various quantities', async () => {
    const wine = new Resource('Wine')
    const beer = new Resource('Beer')
    const chocolate = new Resource('Chocolate')

    const country = new Country('')
    country.setResource(wine, 2)
    country.setResource(beer, 4)
    country.setResource(chocolate, 5)

    const forListingResourcePrices = testConfigurator.buildForListingResourcePrices([country], [wine, beer, chocolate])

    const priceList = await forListingResourcePrices.execute(country.id)

    expect(priceList.get(wine.name)?.get(wine.name)).toEqual(1)
    expect(priceList.get(wine.name)?.get(beer.name)).toEqual(2)
    expect(priceList.get(wine.name)?.get(chocolate.name)).toEqual(2.5)

    expect(priceList.get(beer.name)?.get(wine.name)).toEqual(0.5)
    expect(priceList.get(beer.name)?.get(beer.name)).toEqual(1)
    expect(priceList.get(beer.name)?.get(chocolate.name)).toEqual(1.25)
  })
})
