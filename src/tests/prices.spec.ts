import { Game } from "@/domain/application/Game";
import { Country, CountryId } from "@/domain/entities/Country";
import { Resource } from "@/domain/entities/Resource";
import { CountryNotFoundError, ResourceNotFoundError } from "@/domain/Errors";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { describe, expect, test } from "vitest";

describe('prices', () => {
    test('an resource price is 1 expressed in terms of itself when there is only one resource', async () => {
        const countryRepository = new InMemoryCountryRepository()
        const country = new Country()
        await countryRepository.save(country)

        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(new Resource('TheOneAndOnlyResource'))

        const game = new Game(countryRepository, resourceRepository)

        const price = await game.getResourcePrice('TheOneAndOnlyResource', 'TheOneAndOnlyResource', country.id)
        expect(price).toEqual(1)

    })

    test('A non existing resource cannot have a price', async () => {
        const countryRepository = new InMemoryCountryRepository()
        const country = new Country()
        await countryRepository.save(country)

        const resourceRepository = new InMemoryResourceRepository()

        const game = new Game(countryRepository, resourceRepository)

        await expect(() => game.getResourcePrice('NonExistingResource', 'NonExistingResource', country.id)).rejects.toThrow(ResourceNotFoundError)
    })

    test('An existing resource cannot have a price in a non existing country', async () => {
        const countryRepository = new InMemoryCountryRepository()

        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(new Resource('TheOneAndOnlyResource'))

        const game = new Game(countryRepository, resourceRepository)

        await expect(() => game.getResourcePrice('TheOneAndOnlyResource', 'TheOneAndOnlyResource', new CountryId('nonExistingCountry'))).rejects.toThrow(CountryNotFoundError)
    })

    test('Wine price is infinite when expressed in Beer, when the country only has Beer', async () => {

        const resourceRepository = new InMemoryResourceRepository()
        const wine = new Resource('Wine')
        const beer = new Resource('Beer')
        await resourceRepository.add(wine)
        await resourceRepository.add(beer)

        const countryRepository = new InMemoryCountryRepository()
        const country = new Country()
        country.setResource('Beer', 1)
        await countryRepository.save(country)
        

        const game = new Game(countryRepository, resourceRepository)

        const price = await game.getResourcePrice('Wine', 'Beer', country.id)

        expect(price).toEqual(Infinity)
    })

    test('A resource price cannot be expressed from a non existing resource', async() => {
        const countryRepository = new InMemoryCountryRepository()
        const country = new Country()
        await countryRepository.save(country)

        const resourceRepository = new InMemoryResourceRepository()
        const wood = new Resource('wood')
        await resourceRepository.add(wood)

        const game = new Game(countryRepository, resourceRepository)

        await expect(() => game.getResourcePrice('wood', 'NonExistingResource', country.id)).rejects.toThrow(ResourceNotFoundError)
    })
})