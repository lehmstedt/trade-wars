import { Country, CountryId } from '@/domain/entities/Country'
import { InMemoryCountryRepository } from '@/infrastructure/InMemoryCountryRepository'
import { describe, expect, it } from 'vitest'
import { SetTariff } from '@/domain/useCases/SetTariff'
import { CountryNotFoundError, ResourceNotFoundError } from '@/domain/Errors'
import { InMemoryResourceRepository } from '@/infrastructure/InMemoryResourceRepository'
import { Resource } from '@/domain/entities/Resource'

describe('setTariff', () => {
  it('should throw if country is not existing', async () => {
    const countryRepository = new InMemoryCountryRepository()
    const resourceRepository = new InMemoryResourceRepository()

    const setTariff = new SetTariff(countryRepository, resourceRepository)
    await expect(() =>
      setTariff.execute(new CountryId('notExisting'), 15, 'notExisting')
    ).rejects.toThrowError(CountryNotFoundError)
  })

  it('should throw if resource is not existing', async () => {
    const countryRepository = new InMemoryCountryRepository()
    const country = new Country()
    await countryRepository.save(country)
    const resourceRepository = new InMemoryResourceRepository()

    const setTariff = new SetTariff(countryRepository, resourceRepository)
    await expect(() => setTariff.execute(country.id, 15, 'notExisting')).rejects.toThrowError(
      ResourceNotFoundError
    )
  })

  it('should set a tariff of 15 percent for importing Wine', async () => {
    const countryRepository = new InMemoryCountryRepository()
    const resourceRepository = new InMemoryResourceRepository()

    const country = new Country()
    await countryRepository.save(country)

    const resource = new Resource('Wine')
    await resourceRepository.add(resource)

    const setTariff = new SetTariff(countryRepository, resourceRepository)
    await setTariff.execute(country.id, 15, resource.name)

    const countryAfter = (await countryRepository.getById(country.id)) as Country

    expect(countryAfter.getTariffOnResource(resource)).toEqual(15)
  })

  it('should add a 10 percent tariff on Cheese when country has already a tariff on Wine', async () => {
    const countryRepository = new InMemoryCountryRepository()
    const resourceRepository = new InMemoryResourceRepository()

    const wine = new Resource('Wine')
    const cheese = new Resource('Cheese')
    await resourceRepository.add(wine)
    await resourceRepository.add(cheese)

    const country = new Country()
    country.setTariff(15, wine)
    await countryRepository.save(country)

    const setTariff = new SetTariff(countryRepository, resourceRepository)
    await setTariff.execute(country.id, 10, cheese.name)

    const countryAfter = (await countryRepository.getById(country.id)) as Country

    expect(countryAfter.getTariffOnResource(wine)).toEqual(15)
    expect(countryAfter.getTariffOnResource(cheese)).toEqual(10)
  })
})
