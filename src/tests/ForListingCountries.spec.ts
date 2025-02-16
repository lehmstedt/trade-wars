import { TestConfigurator } from '@/configurator/TestConfigurator'
import { Country, CountryId } from '@/domain/entities/Country'
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
    const forListingCountries = testConfigurator.buildForListingCountries([
      new Country('Spain'),
      new Country('France')
    ])

    const countries = await forListingCountries.execute()
    expect(countries.length).toEqual(2)
    expect(countries.find((country) => country.id.equals(new CountryId('Spain'))))
    expect(countries.find((country) => country.id.equals(new CountryId('France'))))
  })
})
