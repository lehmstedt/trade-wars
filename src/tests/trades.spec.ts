import { Country } from "@/domain/entities/Country";
import { Resource } from "@/domain/entities/Resource";
import { BuyerCountryNotFoundError, BuyerResourceNotFoundError, InsufficientResourceFromBuyerError, InsufficientResourceFromSellerError, NoPriceEstablishedError, NoResourceQuantityAskedError, SellerCountryNotFoundError, SellerResourceNotFoundError } from "@/domain/Errors";
import { MakeTrade, TradeLeg, TradeRequest } from "@/domain/useCases/MakeTrade";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { describe, expect, it, test } from "vitest";
import { TestPriceProvider } from "@/tests/TestPriceProvider";

describe('trades', () => {

    it('Cannot be made when seller is not existing', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        const resourceRepository = new InMemoryResourceRepository()

        const trade = new MakeTrade(countryRepository, resourceRepository, new TestPriceProvider())
        const tradeRequest = new TradeRequest(
            new TradeLeg(buyer, new Resource('NotExisting')),
            new TradeLeg(seller, new Resource('NotExisting')),
            0
        )

        await expect(() => trade.execute(tradeRequest)).rejects.toThrow(SellerCountryNotFoundError)
    })

    it('Cannot be made when buyer is not existing', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(seller)
        const resourceRepository = new InMemoryResourceRepository()

        const trade = new MakeTrade(countryRepository, resourceRepository, new TestPriceProvider())
        const tradeRequest = new TradeRequest(
            new TradeLeg(buyer, new Resource('NotExisting')),
            new TradeLeg(seller, new Resource('NotExisting')),
            0
        )

        await expect(() => trade.execute(tradeRequest)).rejects.toThrow(BuyerCountryNotFoundError)
    })

    it('Cannot be made when buyer resource is not existing', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        await countryRepository.save(seller)
        
        const apple = new Resource('apple')
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(apple)

        const trade = new MakeTrade(countryRepository, resourceRepository, new TestPriceProvider())

        const tradeRequest = new TradeRequest(
            new TradeLeg(buyer, new Resource('NotExisting')),
            new TradeLeg(seller, apple),
            0
        )

        await expect(() => trade.execute(tradeRequest)).rejects.toThrow(BuyerResourceNotFoundError)
    })

    it('Cannot be made when seller resource is not existing', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        await countryRepository.save(seller)
        
        const apple = new Resource('apple')
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(apple)

        const trade = new MakeTrade(countryRepository, resourceRepository, new TestPriceProvider())

        const tradeRequest = new TradeRequest(
            new TradeLeg(buyer, apple),
            new TradeLeg(seller, new Resource('NotExisting')),
            0
        )

        await expect(() => trade.execute(tradeRequest)).rejects.toThrow(SellerResourceNotFoundError)
    })

    it('Cannot be made when the seller does not have asked resource', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        await countryRepository.save(seller)

        const apple = new Resource('Apple')
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(apple)

        const tradeRequest = new TradeRequest(
            new TradeLeg(buyer, apple),
            new TradeLeg(seller, apple),
            1
        )

        const makeTrade = new MakeTrade(countryRepository, resourceRepository, new TestPriceProvider())

        await expect(() => makeTrade.execute(tradeRequest)).rejects.toThrow(InsufficientResourceFromSellerError)

    })

    it('Cannot be made when the seller does not have enough asked resource', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        seller.setResource(apple, 1)
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        await countryRepository.save(seller)

        
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(apple)

        const tradeRequest = new TradeRequest(
            new TradeLeg(buyer, apple),
            new TradeLeg(seller, apple),
            2
        )

        const makeTrade = new MakeTrade(countryRepository, resourceRepository, new TestPriceProvider())

        await expect(() => makeTrade.execute(tradeRequest)).rejects.toThrow(InsufficientResourceFromSellerError)

    })

    test('A trade cannot me made if the resource given by the seller is not existing', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        seller.setResource(apple, 1)
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        await countryRepository.save(seller)

        
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(apple)

        const tradeRequest = new TradeRequest(
            new TradeLeg(buyer, apple),
            new TradeLeg(seller, new Resource('NotExisting')),
            1
        )

        const makeTrade = new MakeTrade(countryRepository, resourceRepository, new TestPriceProvider())

        await expect(() => makeTrade.execute(tradeRequest)).rejects.toThrow(SellerResourceNotFoundError)

    })

    test('A trade cannot me made if not price can be established', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        const banana = new Resource('Banana')
        seller.setResource(apple, 1)
        buyer.setResource(banana, 2)
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        await countryRepository.save(seller)

        
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(apple)
        await resourceRepository.add(banana)

        const tradeRequest = new TradeRequest(
            new TradeLeg(buyer, banana),
            new TradeLeg(seller, apple),
            1
        )

        const priceProvider = new TestPriceProvider()
        priceProvider.setPriceForAnyResource(undefined)

        const makeTrade = new MakeTrade(countryRepository, resourceRepository, priceProvider)

        await expect(() => makeTrade.execute(tradeRequest)).rejects.toThrow(NoPriceEstablishedError)

    })

    test('A trade cannot me made if the buyer does not have the asked resource quantity', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        const banana = new Resource('Banana')
        seller.setResource(apple, 1)
        buyer.setResource(banana, 2)
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        await countryRepository.save(seller)

        
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(apple)
        await resourceRepository.add(banana)

        const tradeRequest = new TradeRequest(
            new TradeLeg(buyer, banana),
            new TradeLeg(seller, apple),
            1
        )

        const priceProvider = new TestPriceProvider()
        priceProvider.setPriceForAnyResource(3)

        const makeTrade = new MakeTrade(countryRepository, resourceRepository, priceProvider)

        await expect(() => makeTrade.execute(tradeRequest)).rejects.toThrow(InsufficientResourceFromBuyerError)

    })

    it('can me made when countries and resources exist, and both trade legs have enough resources in stock', async () => {
        const buyer = new Country('Buyer')
        const seller = new Country('Seller')
        const apple = new Resource('Apple')
        const banana = new Resource('Banana')
        seller.setResource(apple, 4)
        buyer.setResource(banana, 4)
        const countryRepository = new InMemoryCountryRepository()
        await countryRepository.save(buyer)
        await countryRepository.save(seller)

        
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(apple)
        await resourceRepository.add(banana)

        const tradeRequest = new TradeRequest(
            new TradeLeg(buyer, banana),
            new TradeLeg(seller, apple),
            1
        )

        const priceProvider = new TestPriceProvider()
        priceProvider.setPriceForAnyResource(3)

        const makeTrade = new MakeTrade(countryRepository, resourceRepository, priceProvider)

        await makeTrade.execute(tradeRequest)

        const buyerAfter = await countryRepository.getById(buyer.id) as Country

        expect(buyerAfter).toBeDefined()

        expect(buyerAfter.getResourceQty(banana)).toEqual(1)
        expect(buyerAfter.getResourceQty(apple)).toEqual(1)

        const sellerAfter = await countryRepository.getById(seller.id) as Country

        expect(sellerAfter.getResourceQty(banana)).toEqual(3)
        expect(sellerAfter.getResourceQty(apple)).toEqual(3)
    })
})