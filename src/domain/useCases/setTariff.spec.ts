import { Country } from "@/domain/entities/Country";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { describe, expect, it } from "vitest";
import { SetTariff } from "@/domain/useCases/SetTariff";

describe('setTariff', () => {
    it('should set a tariff of 15 percent for importing Wine', () => {

        const countryRepository = new InMemoryCountryRepository()
        const countryId = countryRepository.add(new Country())

        const setTariff = new SetTariff(countryRepository)
        setTariff.execute(countryId, 15, 'Wine')

        const country = countryRepository.getById(countryId)

        expect(country.getTariffOnResource('Wine')).toEqual(15)

    })
})