import { Game } from "@/domain/application/Game";
import { Country, CountryId } from "@/domain/entities/Country";
import { Resource } from "@/domain/entities/Resource";
import { CountryNotFoundError, ResourceNotFoundError } from "@/domain/Errors";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { describe, expect, test } from "vitest";

describe('trades', () => {
    test('A trade cannot be made without countries', async () => {
        const countryRepository = new InMemoryCountryRepository()
        const resourceRepository = new InMemoryResourceRepository()

        const game = new Game(countryRepository, resourceRepository)
        const unusedQuantity = 0

        await expect(() => game.trade(new CountryId('buyerNotDefined'), new CountryId('sellerNotDefined'), new Resource('nonExistingResource'), unusedQuantity)).rejects.toThrow(CountryNotFoundError)
    })

    test('A trade cannot be made without existing resources', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const countryRepository = new InMemoryCountryRepository([buyer, seller])
        
        const resourceRepository = new InMemoryResourceRepository()

        const game = new Game(countryRepository, resourceRepository)
        const unusedQuantity = 0

        await expect(() => game.trade(buyer.id, seller.id, new Resource('nonExistingResource'), unusedQuantity)).rejects.toThrow(ResourceNotFoundError)
    })
})