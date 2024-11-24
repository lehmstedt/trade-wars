import { Country, CountryId } from "@/domain/entities/Country";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { describe, expect, it } from "vitest";
import { SetTariff } from "@/domain/useCases/SetTariff";
import { CountryNotFoundError, ResourceNotFoundError } from "@/domain/Errors";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { Resource, ResourceId } from "@/domain/entities/Resource";

describe('setTariff', () => {

    it('should throw if country is not existing', async() => {

        const countryRepository = new InMemoryCountryRepository()
        const resourceRepository = new InMemoryResourceRepository()

        const setTariff = new SetTariff(countryRepository, resourceRepository)
        await expect(() => setTariff.execute(new CountryId(1), 15, new ResourceId())).rejects.toThrowError(CountryNotFoundError)

    })

    it('should throw if resource is not existing', async() => {

        const countryRepository = new InMemoryCountryRepository()
        const countryId = await countryRepository.add(new Country())
        const resourceRepository = new InMemoryResourceRepository()

        const setTariff = new SetTariff(countryRepository, resourceRepository)
        await expect(() => setTariff.execute(countryId, 15, new ResourceId())).rejects.toThrowError(ResourceNotFoundError)

    })

    it('should set a tariff of 15 percent for importing Wine', async() => {

        const countryRepository = new InMemoryCountryRepository()
        const resourceRepository = new InMemoryResourceRepository()

        const countryId = await countryRepository.add(new Country())

        const resource = new Resource('Wine')
        await resourceRepository.add(resource)


        const setTariff = new SetTariff(countryRepository, resourceRepository)
        setTariff.execute(countryId, 15, resource.id)

        const country = await countryRepository.getById(countryId) as Country

        expect(country.getTariffOnResource('Wine')).toEqual(15)

    })
}) 