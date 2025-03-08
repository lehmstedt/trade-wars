import { TestConfigurator } from '@/configurator/TestConfigurator'
import { Country, CountryId } from '@/domain/entities/Country'
import { CountryBuilder } from '@/domain/entities/CountryBuilder'
import { Resource } from '@/domain/entities/Resource'
import { describe, expect, it, test } from 'vitest'

const testConfigurator = new TestConfigurator()

describe('For listing countries', () => {
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

  it('Should return state resources when there is', async () => {
    const resource = new Resource('Resource')

    const country = new CountryBuilder().withName('Country').withStateResource(resource, 1).build()

    const forListingCountries = testConfigurator.buildForListingCountries([country])
    const countries = await forListingCountries.execute()

    expect(countries[0].stateResources[0].name).toEqual(resource.name)
    expect(countries[0].stateResources[0].quantity).toEqual(1)
  })
})
