import { describe, expect, it } from 'vitest'
import { CountryNotFoundError } from '@/domain/Errors'
import { Country, CountryId } from '@/domain/entities/Country'
import { Resource } from '@/domain/entities/Resource'
import { TestConfigurator } from '@/configurator/TestConfigurator'

const testConfigurator = new TestConfigurator()

describe('For listing tariffs', () => {
  it('should throw when country is not existing', async () => {
    const forListingTariffs = testConfigurator.buildForListingTariffs([])
    await expect(() =>
      forListingTariffs.execute(new CountryId('notExisting'))
    ).rejects.toThrowError(CountryNotFoundError)
  })

  it('should return empty when country has not tariff set', async () => {
    const country = new Country('')

    const forListingTariffs = testConfigurator.buildForListingTariffs([country])
    const tariffList = await forListingTariffs.execute(country.id)

    expect(tariffList.length).toEqual(0)
  })

  it('should return one tariff of 10 on Wood', async () => {
    // ARRANGE
    const wood = new Resource('Wood')
    const country = new Country('')
    const forSettingTariff = testConfigurator.buildForSettingTariff([country], [wood])

    await forSettingTariff.execute(country.id, 10, wood.name)

    // ACT
    const forListingTariffs = testConfigurator.buildForListingTariffs([country])
    const tariffList = await forListingTariffs.execute(country.id)

    // ASSERT
    expect(tariffList.length).toEqual(1)
    expect(tariffList[0].rate).toEqual(10)
    expect(tariffList[0].resourceName).toEqual(wood.name)
  })
})
