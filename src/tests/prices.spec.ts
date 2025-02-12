import { TestConfigurator } from '@/configurator/TestConfigurator'
import { Game } from '@/domain/application/Game'
import { Country, CountryId } from '@/domain/entities/Country'
import { Resource } from '@/domain/entities/Resource'
import { CountryNotFoundError, ResourceNotFoundError } from '@/domain/Errors'
import { InMemoryCountryRepository } from '@/infrastructure/InMemoryCountryRepository'
import { InMemoryResourceRepository } from '@/infrastructure/InMemoryResourceRepository'
import { describe, expect, test } from 'vitest'

const testConfigurator = new TestConfigurator()

describe('prices', () => {
  test('an resource price is 1 expressed in terms of itself when there is only one resource', async () => {
    const country = new Country('')

    const forKnowingResourcePrice = testConfigurator.buildForKnowingResourcePrice([country], [new Resource('TheOneAndOnlyResource')])

    const price = await forKnowingResourcePrice.execute('TheOneAndOnlyResource',
      'TheOneAndOnlyResource',
      country.id)
    expect(price).toEqual(1)
  })

  test('A non existing resource cannot have a price', async () => {
    const country = new Country('')

    const forKnowingResourcePrice = testConfigurator.buildForKnowingResourcePrice([country], [])

    await expect(() =>
      forKnowingResourcePrice.execute('NonExistingResource', 'NonExistingResource', country.id)
    ).rejects.toThrow(ResourceNotFoundError)
  })

  test('An existing resource cannot have a price in a non existing country', async () => {

    const forKnowingResourcePrice = testConfigurator.buildForKnowingResourcePrice([], [new Resource('TheOneAndOnlyResource')])

    await expect(() =>
      forKnowingResourcePrice.execute(
        'TheOneAndOnlyResource',
        'TheOneAndOnlyResource',
        new CountryId('nonExistingCountry')
      )
    ).rejects.toThrow(CountryNotFoundError)
  })

  test('Wine price is undefined when expressed in Beer, and Beer price is undefined when expressed in Wine, when the country only has Beer', async () => {
    const wine = new Resource('Wine')
    const beer = new Resource('Beer')
    const country = new Country('')
    country.setResource(beer, 1)

    const forKnowingResourcePrice = testConfigurator.buildForKnowingResourcePrice([country], [wine, beer])

    const winePriceInBeer = await forKnowingResourcePrice.execute('Wine', 'Beer', country.id)
    const beerPriceInWine = await forKnowingResourcePrice.execute('Beer', 'Wine', country.id)

    expect(winePriceInBeer).toEqual(undefined)
    expect(beerPriceInWine).toEqual(undefined)
  })

  test('A resource price cannot be expressed from a non existing resource', async () => {
    const country = new Country('')
    const wood = new Resource('wood')

    const forKnowingResourcePrice = testConfigurator.buildForKnowingResourcePrice([country], [wood])

    await expect(() =>
      forKnowingResourcePrice.execute('wood', 'NonExistingResource', country.id)
    ).rejects.toThrow(ResourceNotFoundError)
  })

  test('Wine price should be 1 expressed in Beer, and beer price 1 too expressed in Wine, when country has neither of those resources', async () => {
    const country = new Country('')

    const wine = new Resource('Wine')
    const beer = new Resource('Beer')

    const forKnowingResourcePrice = testConfigurator.buildForKnowingResourcePrice([country], [wine, beer])

    const winePriceInBeer = await forKnowingResourcePrice.execute('Wine', 'Beer', country.id)
    const beerPriceInWine = await forKnowingResourcePrice.execute('Beer', 'Wine', country.id)

    expect(winePriceInBeer).toEqual(1)
    expect(beerPriceInWine).toEqual(1)
  })

  test('Wine price should be 1 expressed in Beer, and beer price 1 too expressed in Wine, when country has those resources in same qty', async () => {
    const wine = new Resource('Wine')
    const beer = new Resource('Beer')

    const country = new Country('')
    country.setResource(wine, 2)
    country.setResource(beer, 2)

    const forKnowingResourcePrice = testConfigurator.buildForKnowingResourcePrice([country], [wine, beer])

    const winePriceInBeer = await forKnowingResourcePrice.execute('Wine', 'Beer', country.id)
    const beerPriceInWine = await forKnowingResourcePrice.execute('Beer', 'Wine', country.id)

    expect(winePriceInBeer).toEqual(1)
    expect(beerPriceInWine).toEqual(1)
  })

  test('Wine price should be 2 expressed in Beer, and beer price 0.5 expressed in Wine, when country has double beer qty than wine', async () => {
    const wine = new Resource('Wine')
    const beer = new Resource('Beer')

    const country = new Country('')
    country.setResource(wine, 2)
    country.setResource(beer, 4)

    const forKnowingResourcePrice = testConfigurator.buildForKnowingResourcePrice([country], [wine, beer])

    const winePriceInBeer = await forKnowingResourcePrice.execute('Wine', 'Beer', country.id)
    const beerPriceInWine = await forKnowingResourcePrice.execute('Beer', 'Wine', country.id)

    expect(winePriceInBeer).toEqual(2)
    expect(beerPriceInWine).toEqual(0.5)
  })

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
