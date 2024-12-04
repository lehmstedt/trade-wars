import { describe, expect, it } from "vitest";
import { CountryNotFoundError } from "@/domain/Errors";
import { ListTariffs } from "@/domain/useCases/ListTariffs";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { Country, CountryId } from "@/domain/entities/Country";

describe("ListTariffs", () => {
    it("should throw when country is not existing", async () => {
        const countryRepository = new InMemoryCountryRepository()
        const listTariffs = new ListTariffs(countryRepository)
        await expect(() => listTariffs.execute(new CountryId('notExisting'))).rejects.toThrowError(CountryNotFoundError)

    })

    it('should return empty when country has not tariff set', async() => {
        const countryRepository = new InMemoryCountryRepository()

        const country = new Country()

        await countryRepository.save(country)

        const listTariffs = new ListTariffs(countryRepository)
        const tariffList = await listTariffs.execute(country.id)

        expect(tariffList.length).toEqual(0)
    })
})