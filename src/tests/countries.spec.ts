import { Game } from "@/domain/application/Game";
import { Country, CountryId } from "@/domain/entities/Country";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { describe, expect, test } from "vitest";

describe('countries', () => {
    test('No country is existing', async() => {
        const countryRepository = new InMemoryCountryRepository()
        const resourceRepository = new InMemoryResourceRepository()

        const game = new Game(countryRepository, resourceRepository)

        const countries = await game.listCountries()
        expect(countries.length).toEqual(0)
    })

    test('One country is existing', async() => {
        const countryRepository = new InMemoryCountryRepository()
        const spain = new Country('Spain')
        countryRepository.save(spain)
        const resourceRepository = new InMemoryResourceRepository()

        const game = new Game(countryRepository, resourceRepository)

        const countries = await game.listCountries()
        expect(countries.length).toEqual(1)
        expect(countries[0].name).toEqual('Spain')
    })

    test('Various countries can be listed in not deterministic order', async() => {
        const countryRepository = new InMemoryCountryRepository()
        countryRepository.save(new Country('Spain'))
        countryRepository.save(new Country('France'))
        const resourceRepository = new InMemoryResourceRepository()

        const game = new Game(countryRepository, resourceRepository)

        const countries = await game.listCountries()
        expect(countries.length).toEqual(2)
        expect(countries.find(country => country.id.equals(new CountryId('Spain'))))
        expect(countries.find(country => country.id.equals(new CountryId('France'))))
    })
})