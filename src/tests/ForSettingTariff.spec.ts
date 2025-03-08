import { Country, CountryId } from '@/domain/entities/Country'
import { describe, expect, it } from 'vitest'
import { CountryNotFoundError, ResourceNotFoundError } from '@/domain/Errors'
import { Resource } from '@/domain/entities/Resource'
import { TestConfigurator } from '@/configurator/TestConfigurator'

const testConfigurator = new TestConfigurator()

describe('For setting tariff', () => {
  it('should throw if country is not existing', async () => {
    const forSettingTariff = testConfigurator.buildForSettingTariff([], [])
    await expect(() =>
      forSettingTariff.execute(new CountryId('notExisting'), 15, 'notExisting')
    ).rejects.toThrowError(CountryNotFoundError)
  })

  it('should throw if resource is not existing', async () => {
    const country = new Country()

    const forSettingTariff = testConfigurator.buildForSettingTariff([country], [])
    await expect(() =>
      forSettingTariff.execute(country.id, 15, 'notExisting')
    ).rejects.toThrowError(ResourceNotFoundError)
  })

  it('should set a tariff of 15 percent for importing Wine', async () => {
    const country = new Country()
    const resource = new Resource('Wine')

    const forSettingTariff = testConfigurator.buildForSettingTariff([country], [resource])
    await forSettingTariff.execute(country.id, 15, resource.name)

    const countryAfter = (await forSettingTariff.forSettingTariffOnCountry.getById(
      country.id
    )) as Country

    expect(countryAfter.getTariffOnResource(resource)).toEqual(15)
  })

  it('should add a 10 percent tariff on Cheese when country has already a tariff on Wine', async () => {
    const wine = new Resource('Wine')
    const cheese = new Resource('Cheese')

    const country = new Country()
    country.setTariff(15, wine)

    const forSettingTariff = testConfigurator.buildForSettingTariff([country], [wine, cheese])
    await forSettingTariff.execute(country.id, 10, cheese.name)

    const countryAfter = (await forSettingTariff.forSettingTariffOnCountry.getById(
      country.id
    )) as Country

    expect(countryAfter.getTariffOnResource(wine)).toEqual(15)
    expect(countryAfter.getTariffOnResource(cheese)).toEqual(10)
  })
})
