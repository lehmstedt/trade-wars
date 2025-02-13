import { TestConfigurator } from '@/configurator/TestConfigurator'
import { Game } from '@/domain/application/Game'
import { Country, CountryId } from '@/domain/entities/Country'
import { Resource } from '@/domain/entities/Resource'
import { InMemoryCountryRepository } from '@/infrastructure/InMemoryCountryRepository'
import { InMemoryResourceRepository } from '@/infrastructure/InMemoryResourceRepository'
import { describe, expect, test } from 'vitest'

const testConfigurator = new TestConfigurator()

describe('countries', () => {
  test('No country is existing', async () => {

    const forListingCountries = testConfigurator.buildForListingCountries([])

    const countries = await forListingCountries.execute()
    expect(countries.length).toEqual(0)
  })

  test('One country is existing', async () => {
    const spain = new Country('Spain')

    const forListingCountries = testConfigurator.buildForListingCountries([spain])

    const countries = await forListingCountries.execute()
    expect(countries.length).toEqual(1)
    expect(countries[0].name).toEqual('Spain')
  })

  test('Various countries can be listed in not deterministic order', async () => {
    const countryRepository = new InMemoryCountryRepository()
    countryRepository.save(new Country('Spain'))
    countryRepository.save(new Country('France'))
    const resourceRepository = new InMemoryResourceRepository()

    const game = new Game(countryRepository, resourceRepository)

    const countries = await game.listCountries()
    expect(countries.length).toEqual(2)
    expect(countries.find((country) => country.id.equals(new CountryId('Spain'))))
    expect(countries.find((country) => country.id.equals(new CountryId('France'))))
  })

  test('A country inventory can be listed when attributing resources', async () => {
    const countryRepository = new InMemoryCountryRepository()
    const country = new Country('France')
    const wine = new Resource('Wine')
    const cheese = new Resource('Cheese')
    country.setResource(wine, 1)
    country.setResource(cheese, 2)
    await countryRepository.save(country)

    const resourceRepository = new InMemoryResourceRepository()
    resourceRepository.saveBulk([wine, cheese])

    const game = new Game(countryRepository, resourceRepository)

    const inventory = await game.listCountryInventory(country.id)

    expect(inventory).toContainEqual({ name: wine.name, qty: 1 })
    expect(inventory).toContainEqual({ name: cheese.name, qty: 2 })
  })
})
