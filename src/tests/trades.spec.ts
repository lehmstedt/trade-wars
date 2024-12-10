import { Country, CountryId } from "@/domain/entities/Country";
import { Resource } from "@/domain/entities/Resource";
import { CountryNotFoundError, InsufficientResourceError, ResourceNotFoundError } from "@/domain/Errors";
import { Trade } from "@/domain/useCases/Trade";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { describe, expect, test } from "vitest";

describe('trades', () => {

    test('A trade cannot be made without countries', async () => {
        const countryRepository = new InMemoryCountryRepository()
        const resourceRepository = new InMemoryResourceRepository()

        const trade = new Trade(countryRepository, resourceRepository)
        const unusedQuantity = 0

        await expect(() => trade.execute(new CountryId('buyerNotDefined'), new CountryId('sellerNotDefined'), new Resource('nonExistingResource'), unusedQuantity)).rejects.toThrow(CountryNotFoundError)
    })

    test('A trade cannot be made without existing resources', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        await countryRepository.save(seller)
        
        const resourceRepository = new InMemoryResourceRepository()

        const trade = new Trade(countryRepository, resourceRepository)
        const unusedQuantity = 0

        await expect(() => trade.execute(buyer.id, seller.id, new Resource('nonExistingResource'), unusedQuantity)).rejects.toThrow(ResourceNotFoundError)
    })

    test('A buyer cannot buy a resource the seller does not have', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        await countryRepository.save(seller)

        const apple = new Resource('Apple')
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(apple)

        const trade = new Trade(countryRepository, resourceRepository)

        await expect(() => trade.execute(buyer.id, seller.id, apple, 1)).rejects.toThrow(InsufficientResourceError)


    })
})