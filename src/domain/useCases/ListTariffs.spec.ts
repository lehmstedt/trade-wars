import { describe, expect, it } from "vitest";
import { CountryNotFoundError } from "@/domain/Errors";
import { ForListingTariffs } from "@/domain/drivingPorts/ForListingTariffs";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { Country, CountryId } from "@/domain/entities/Country";
import { SetTariff } from "@/domain/useCases/SetTariff";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { Resource } from "@/domain/entities/Resource";

describe("ListTariffs", () => {
    it("should throw when country is not existing", async () => {
        const countryRepository = new InMemoryCountryRepository()
        const listTariffs = new ForListingTariffs(countryRepository)
        await expect(() => listTariffs.execute(new CountryId('notExisting'))).rejects.toThrowError(CountryNotFoundError)

    })

    it('should return empty when country has not tariff set', async() => {
        const countryRepository = new InMemoryCountryRepository()

        const country = new Country("")

        await countryRepository.save(country)

        const listTariffs = new ForListingTariffs(countryRepository)
        const tariffList = await listTariffs.execute(country.id)

        expect(tariffList.length).toEqual(0)
    })

    it('should return one tariff of 10 on Wood', async () => {
        // ARRANGE
        const countryRepository = new InMemoryCountryRepository()
        const resourceRepository = new InMemoryResourceRepository()

        const wood = new Resource('Wood')

        resourceRepository.add(wood)

        const country = new Country("")
        await countryRepository.save(country)
        const setTariff = new SetTariff(countryRepository, resourceRepository)

        await setTariff.execute(country.id, 10, wood.name)

        // ACT
        const listTariffs = new ForListingTariffs(countryRepository)
        const tariffList = await listTariffs.execute(country.id)

        // ASSERT
        expect(tariffList.length).toEqual(1)
        expect(tariffList[0].rate).toEqual(10)
        expect(tariffList[0].resourceName).toEqual(wood.name)
    })
})