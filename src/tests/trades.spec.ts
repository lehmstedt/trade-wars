import { Country } from "@/domain/entities/Country";
import { Resource } from "@/domain/entities/Resource";
import { BuyerCountryNotFoundError, BuyerResourceNotFoundError, InsufficientResourceFromBuyer, InsufficientResourceFromBuyerError, InsufficientResourceFromSellerError, NoPriceEstablishedError, NoResourceQuantityAskedError, SellerCountryNotFound, SellerCountryNotFoundError, SellerResourceNotFoundError } from "@/domain/Errors";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { describe, expect, it, test } from "vitest";
import { TestPriceProvider } from "@/tests/TestPriceProvider";
import { Game, TradeRequest } from "@/domain/application/Game";

const buildGameFromEntities = (countries: Country[], resources: Resource[], transactionPrice?: number) => {
    const countryRepository = new InMemoryCountryRepository(countries)
    const resourceRepository = new InMemoryResourceRepository(resources)

    return new Game(countryRepository, resourceRepository, new TestPriceProvider(transactionPrice))
}

describe('trades', () => {

    it('Cannot be made when seller is not existing', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        const banana = new Resource('Banana')

        const game = buildGameFromEntities([buyer], [])

        const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)
        const validation = await game.validateTrade(tradeRequest)

        expect(validation.isValid).toBe(false)
        expect(validation.error).toBeInstanceOf(SellerCountryNotFoundError)

        await expect(() => game.makeTrade(tradeRequest)).rejects.toThrow(SellerCountryNotFoundError)
    })

    it('Cannot be made when buyer is not existing', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        const banana = new Resource('Banana')

        const game = buildGameFromEntities([seller], [])

        const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)

        const validation = await game.validateTrade(tradeRequest)

        expect(validation.isValid).toBe(false)
        expect(validation.error).toBeInstanceOf(BuyerCountryNotFoundError)

        await expect(() => game.makeTrade(tradeRequest)).rejects.toThrow(BuyerCountryNotFoundError)
    })

    it('Cannot be made when buyer resource is not existing', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        
        const apple = new Resource('apple')
        const banana = new Resource('Banana')

        const game = buildGameFromEntities([buyer, seller], [apple])

        const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)

        const validation = await game.validateTrade(tradeRequest)

        expect(validation.isValid).toBe(false)
        expect(validation.error).toBeInstanceOf(BuyerResourceNotFoundError)

        await expect(() => game.makeTrade(tradeRequest)).rejects.toThrow(BuyerResourceNotFoundError)
    })

    it('Cannot be made when sold resource is not existing', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        
        const apple = new Resource('apple')
        const banana = new Resource('Banana')

        const game = buildGameFromEntities([buyer, seller], [banana])

        const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)

        const validation = await game.validateTrade(tradeRequest)

        expect(validation.isValid).toBe(false)
        expect(validation.error).toBeInstanceOf(SellerResourceNotFoundError)

        await expect(() => game.makeTrade(tradeRequest)).rejects.toThrow(SellerResourceNotFoundError)
    })

    it('Cannot be made when the seller does not have asked resource', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')

        const apple = new Resource('Apple')
        const banana = new Resource('Banana')


        const game = buildGameFromEntities([buyer, seller], [apple, banana])

        const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)

        const validation = await game.validateTrade(tradeRequest)

        expect(validation.isValid).toBe(false)
        expect(validation.error).toBeInstanceOf(InsufficientResourceFromSellerError)

        await expect(() => game.makeTrade(tradeRequest)).rejects.toThrow(InsufficientResourceFromSellerError)

    })

    it('Cannot be made when the seller does not have enough asked resource', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        const banana = new Resource('Banana')
        seller.setResource(apple, 1)

        
        const game = buildGameFromEntities([buyer, seller], [apple, banana])

        const tradeRequest = new TradeRequest(buyer, seller, apple, 2, banana)

        const validation = await game.validateTrade(tradeRequest)

        expect(validation.isValid).toBe(false)
        expect(validation.error).toBeInstanceOf(InsufficientResourceFromSellerError)

        await expect(() => game.makeTrade(tradeRequest)).rejects.toThrow(InsufficientResourceFromSellerError)

    })

    test('A trade cannot be made if the sold resource is not existing', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        const banana = new Resource('Banana')
        seller.setResource(apple, 1)

        const game = buildGameFromEntities([buyer, seller], [banana])

        const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)

        const validation = await game.validateTrade(tradeRequest)

        expect(validation.isValid).toBe(false)
        expect(validation.error).toBeInstanceOf(SellerResourceNotFoundError)

        await expect(() => game.makeTrade(tradeRequest)).rejects.toThrow(SellerResourceNotFoundError)

    })

    test('A trade cannot be made if not price can be established', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        const banana = new Resource('Banana')
        seller.setResource(apple, 1)
        buyer.setResource(banana, 2)

        const game = buildGameFromEntities([buyer, seller], [apple, banana])

        const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)

        const validation = await game.validateTrade(tradeRequest)

        expect(validation.isValid).toBe(false)
        expect(validation.error).toBeInstanceOf(NoPriceEstablishedError)

        await expect(() => game.makeTrade(tradeRequest)).rejects.toThrow(NoPriceEstablishedError)

    })

    test('A trade cannot be made if the buyer does not have the asked resource quantity', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        const banana = new Resource('Banana')
        seller.setResource(apple, 1)
        buyer.setResource(banana, 2)


        const game = buildGameFromEntities([buyer, seller], [apple, banana], 3)

        const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)

        const validation = await game.validateTrade(tradeRequest)

        expect(validation.isValid).toBe(false)
        expect(validation.error).toBeInstanceOf(InsufficientResourceFromBuyerError)
        expect(validation.price).toEqual(3)

        await expect(() => game.makeTrade(tradeRequest)).rejects.toThrow(InsufficientResourceFromBuyerError)

    })

    it('can be made when countries and resources exist, and both trade legs have enough resources in stock', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        const banana = new Resource('Banana')
        seller.setResource(apple, 4)
        buyer.setResource(banana, 4)
        const countryRepository = new InMemoryCountryRepository([buyer, seller])
        const resourceRepository = new InMemoryResourceRepository([apple, banana])
  
        const game = new Game(countryRepository, resourceRepository, new TestPriceProvider(3))

        const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)

        const validation = await game.validateTrade(tradeRequest)

        expect(validation.isValid).toBe(true)
        expect(validation.price).toEqual(3)

        await game.makeTrade(tradeRequest)

        const buyerAfter = await countryRepository.getById(buyer.id) as Country

        expect(buyerAfter).toBeDefined()

        expect(buyerAfter.getResourceQty(banana)).toEqual(1)
        expect(buyerAfter.getResourceQty(apple)).toEqual(1)

        const sellerAfter = await countryRepository.getById(seller.id) as Country

        expect(sellerAfter.getResourceQty(banana)).toEqual(3)
        expect(sellerAfter.getResourceQty(apple)).toEqual(3)
    })
})