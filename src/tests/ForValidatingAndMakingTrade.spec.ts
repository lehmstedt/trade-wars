import { Country } from '@/domain/entities/Country'
import { Resource } from '@/domain/entities/Resource'
import { describe, expect, it, test } from 'vitest'
import { TestConfigurator } from '@/configurator/TestConfigurator'
import { TradeRequest } from '@/domain/entities/TradeRequest'
import { TradeValidationStatus } from '@/domain/entities/TradeValidation'

const testConfigurator = new TestConfigurator()

describe('For validating and making trade', () => {
  it('Cannot be made when seller is not existing', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')

    const forValidatingTrade = testConfigurator.buildForValidatingTrade([buyer], [])

    const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(false)
    expect(validation.status).toEqual(TradeValidationStatus.SellerCountryNotFound)

    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer], [])
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(false)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.SellerCountryNotFound)
  })

  it('Cannot be made when buyer is not existing', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')

    const forValidatingTrade = testConfigurator.buildForValidatingTrade([seller], [])

    const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(false)
    expect(validation.status).toEqual(TradeValidationStatus.BuyerCountryNotFound)

    const forMakingTrade = testConfigurator.buildForMakingTrade([seller], [])
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(false)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.BuyerCountryNotFound)
  })

  it('Cannot be made when buyer resource is not existing', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')

    const apple = new Resource('apple')
    const banana = new Resource('Banana')

    const forValidatingTrade = testConfigurator.buildForValidatingTrade([buyer, seller], [apple])

    const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(false)
    expect(validation.status).toEqual(TradeValidationStatus.BuyerResourceNotFound)

    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [apple])
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(false)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.BuyerResourceNotFound)
  })

  it('Cannot be made when sold resource is not existing', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')

    const apple = new Resource('apple')
    const banana = new Resource('Banana')

    const forValidatingTrade = testConfigurator.buildForValidatingTrade([buyer, seller], [banana])

    const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(false)
    expect(validation.status).toEqual(TradeValidationStatus.SellerResourceNotFound)

    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [banana])
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(false)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.SellerResourceNotFound)
  })

  it('Cannot be made when the seller does not have asked resource', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')

    const apple = new Resource('Apple')
    const banana = new Resource('Banana')

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana]
    )

    const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(false)
    expect(validation.status).toEqual(TradeValidationStatus.InsufficientResourceFromSeller)

    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [apple, banana])
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(false)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.InsufficientResourceFromSeller)
  })

  it('Cannot be made when the seller does not have enough asked resource', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')
    seller.setResource(apple, 1)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana]
    )

    const tradeRequest = new TradeRequest(buyer, seller, apple, 2, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(false)
    expect(validation.status).toEqual(TradeValidationStatus.InsufficientResourceFromSeller)

    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [apple, banana])
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(false)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.InsufficientResourceFromSeller)
  })

  test('A trade cannot be made if the sold resource is not existing', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')
    seller.setResource(apple, 1)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade([buyer, seller], [banana])

    const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(false)
    expect(validation.status).toEqual(TradeValidationStatus.SellerResourceNotFound)

    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [banana])
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(false)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.SellerResourceNotFound)
  })

  test('A trade cannot be made if not price can be established', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')
    seller.setResource(apple, 1)
    buyer.setResource(banana, 2)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana]
    )

    const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(false)
    expect(validation.status).toEqual(TradeValidationStatus.NoPriceEstablished)

    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [apple, banana])
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(false)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.NoPriceEstablished)
  })

  test('A trade cannot be made if the buyer does not have the asked resource quantity', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')
    seller.setResource(apple, 1)
    buyer.setResource(banana, 2)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana],
      3
    )

    const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(false)
    expect(validation.status).toEqual(TradeValidationStatus.InsufficientResourceFromBuyer)

    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [apple, banana], 3)
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(false)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.InsufficientResourceFromBuyer)
  })

  it('can be made when countries and resources exist, and both trade legs have enough resources in stock', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')
    seller.setResource(apple, 4)
    buyer.setResource(banana, 4)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana],
      3
    )

    const tradeRequest = new TradeRequest(buyer, seller, apple, 1, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(true)
    expect(validation.status).toEqual(TradeValidationStatus.OK)

    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [apple, banana], 3)
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(true)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.OK)

    const buyerAfter = (await testConfigurator.countryRepository.getById(buyer.id)) as Country

    expect(buyerAfter).toBeDefined()

    expect(buyerAfter.getResourceQty(banana)).toEqual(1)
    expect(buyerAfter.getResourceQty(apple)).toEqual(1)

    const sellerAfter = (await testConfigurator.countryRepository.getById(seller.id)) as Country

    expect(sellerAfter.getResourceQty(banana)).toEqual(3)
    expect(sellerAfter.getResourceQty(apple)).toEqual(3)
  })

  it('can be made when countries and resources exist, and both trade legs have enough resources in stock, and quantity is greater than 1', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')
    seller.setResource(apple, 4)
    buyer.setResource(banana, 7)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana],
      3
    )
    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [apple, banana], 3)

    const tradeRequest = new TradeRequest(buyer, seller, apple, 2, banana)

    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(true)
    expect(validation.price).toEqual(6)

    await forMakingTrade.execute(tradeRequest)

    const buyerAfter = (await testConfigurator.countryRepository.getById(buyer.id)) as Country

    expect(buyerAfter).toBeDefined()

    expect(buyerAfter.getResourceQty(banana)).toEqual(1)
    expect(buyerAfter.getResourceQty(apple)).toEqual(2)

    const sellerAfter = (await testConfigurator.countryRepository.getById(seller.id)) as Country

    expect(sellerAfter.getResourceQty(banana)).toEqual(6)
    expect(sellerAfter.getResourceQty(apple)).toEqual(2)
  })
})
