import { Game } from '@/domain/application/Game'
import { Country } from '@/domain/entities/Country'
import { Resource } from '@/domain/entities/Resource'
import { InMemoryCountryRepository } from '@/infrastructure/InMemoryCountryRepository'
import { InMemoryResourceRepository } from '@/infrastructure/InMemoryResourceRepository'
import { describe, expect, test } from 'vitest'


describe('prices', () => {

  test('Wine, Beer and Chocolate can be expressed from each other when country has those resources in various quantities', async () => {
    const resourceRepository = new InMemoryResourceRepository()
    const wine = new Resource('Wine')
    const beer = new Resource('Beer')
    const chocolate = new Resource('Chocolate')
    await resourceRepository.saveBulk([wine, beer, chocolate])

    const countryRepository = new InMemoryCountryRepository()
    const country = new Country('')
    country.setResource(wine, 2)
    country.setResource(beer, 4)
    country.setResource(chocolate, 5)
    await countryRepository.save(country)

    const game = new Game(countryRepository, resourceRepository)

    const priceList = await game.listResourcePrices(country.id)

    expect(priceList.get(wine.name)?.get(wine.name)).toEqual(1)
    expect(priceList.get(wine.name)?.get(beer.name)).toEqual(2)
    expect(priceList.get(wine.name)?.get(chocolate.name)).toEqual(2.5)

    expect(priceList.get(beer.name)?.get(wine.name)).toEqual(0.5)
    expect(priceList.get(beer.name)?.get(beer.name)).toEqual(1)
    expect(priceList.get(beer.name)?.get(chocolate.name)).toEqual(1.25)
  })
})
