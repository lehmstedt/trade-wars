import { Country } from '@/domain/entities/Country'
import { Resource } from '@/domain/entities/Resource'
import { describe, expect, it, test } from 'vitest'
import { TestConfigurator } from '@/configurator/TestConfigurator'
import { TradeRequest } from '@/domain/entities/TradeRequest'
import { TradeValidationStatus } from '@/domain/entities/TradeValidation'
import { CountryBuilder } from '@/domain/entities/CountryBuilder'

const testConfigurator = new TestConfigurator()

describe('For validating and making trade', () => {
  it('Cannot be made when seller is not existing', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')

    const forValidatingTrade = testConfigurator.buildForValidatingTrade([buyer], [])

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 1, banana)
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

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 1, banana)
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

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 1, banana)
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

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 1, banana)
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

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 1, banana)
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
    seller.receiveResource(apple, 1)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana]
    )

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 2, banana)
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
    seller.receiveResource(apple, 1)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade([buyer, seller], [banana])

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 1, banana)
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
    seller.receiveResource(apple, 1)
    buyer.receiveResource(banana, 2)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana]
    )

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 1, banana)
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
    seller.receiveResource(apple, 1)
    buyer.receiveResource(banana, 2)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana],
      3
    )

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 1, banana)
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
    seller.receiveResource(apple, 4)
    buyer.receiveResource(banana, 4)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana],
      3
    )

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 1, banana)
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(true)
    expect(validation.status).toEqual(TradeValidationStatus.OK)

    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [apple, banana], 3)
    const tradeExecution = await forMakingTrade.execute(tradeRequest)

    expect(tradeExecution.isValid).toBe(true)
    expect(tradeExecution.status).toEqual(TradeValidationStatus.OK)

    const buyerAfter = (await forMakingTrade.forApplyingTradeOnCountry.getById(buyer.id)) as Country

    expect(buyerAfter).toBeDefined()

    expect(buyerAfter.getResourceQty(banana)).toEqual(1)
    expect(buyerAfter.getResourceQty(apple)).toEqual(1)

    const sellerAfter = (await forMakingTrade.forApplyingTradeOnCountry.getById(
      seller.id
    )) as Country

    expect(sellerAfter.getResourceQty(banana)).toEqual(3)
    expect(sellerAfter.getResourceQty(apple)).toEqual(3)
  })

  it('can be made when countries and resources exist, and both trade legs have enough resources in stock, and quantity is greater than 1', async () => {
    const buyer = new Country('Buyer')
    const seller = new Country('Seller')
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')
    seller.receiveResource(apple, 4)
    buyer.receiveResource(banana, 7)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [apple, banana],
      3
    )
    const forMakingTrade = testConfigurator.buildForMakingTrade([buyer, seller], [apple, banana], 3)

    const tradeRequest = new TradeRequest(buyer.id, seller.id, apple, 2, banana)

    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.status).toBe(TradeValidationStatus.OK)
    expect(validation.isValid).toBe(true)
    expect(validation.price).toEqual(6)

    await forMakingTrade.execute(tradeRequest)

    const buyerAfter = (await forMakingTrade.forApplyingTradeOnCountry.getById(buyer.id)) as Country

    expect(buyerAfter).toBeDefined()

    expect(buyerAfter.getResourceQty(banana)).toEqual(1)
    expect(buyerAfter.getResourceQty(apple)).toEqual(2)

    const sellerAfter = (await forMakingTrade.forApplyingTradeOnCountry.getById(
      seller.id
    )) as Country

    expect(sellerAfter.getResourceQty(banana)).toEqual(6)
    expect(sellerAfter.getResourceQty(apple)).toEqual(2)
  })

  it('Should exchange trade resources and transfer tariff on country state resources when buyer has enough resources for trade and tariff', async () => {
    const buyerRes = new Resource('Buyer res')
    const sellerRes = new Resource('Seller res')

    const buyer = new CountryBuilder()
      .withName('Buyer')
      .withResource(buyerRes, 2)
      .withTariff(sellerRes, 5)
      .build()

    const seller = new CountryBuilder().withName('Seller').withResource(sellerRes, 1).build()

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      1
    )

    const tradeRequest = new TradeRequest(buyer.id, seller.id, sellerRes, 1, buyerRes)

    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(true)

    const forMakingTrade = testConfigurator.buildForMakingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      1
    )

    await forMakingTrade.execute(tradeRequest)

    const buyerAfter = await forMakingTrade.forApplyingTradeOnCountry.getById(buyer.id)

    expect(buyerAfter?.getResourceQty(buyerRes)).toEqual(0.95)
    expect(buyerAfter?.getStateResourceQuantity(buyerRes)).toEqual(0.05)

    const sellerAfter = await forMakingTrade.forApplyingTradeOnCountry.getById(seller.id)

    expect(sellerAfter?.getResourceQty(sellerRes)).toEqual(0)
  })

  it('Should only exchange traded resources when tariff is set on 0 on buyer for seller resource', async () => {
    const buyerRes = new Resource('Buyer res')
    const sellerRes = new Resource('Seller res')

    const buyer = new CountryBuilder()
      .withName('Buyer')
      .withResource(buyerRes, 2)
      .withTariff(sellerRes, 0)
      .build()

    const seller = new CountryBuilder().withName('Seller').withResource(sellerRes, 1).build()

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      1
    )

    const tradeRequest = new TradeRequest(buyer.id, seller.id, sellerRes, 1, buyerRes)

    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(true)

    const forMakingTrade = testConfigurator.buildForMakingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      1
    )

    await forMakingTrade.execute(tradeRequest)

    const buyerAfter = await forMakingTrade.forApplyingTradeOnCountry.getById(buyer.id)

    expect(buyerAfter?.getResourceQty(buyerRes)).toEqual(1)
    expect(buyerAfter?.getStateResourceQuantity(buyerRes)).toEqual(0)

    const sellerAfter = await forMakingTrade.forApplyingTradeOnCountry.getById(seller.id)

    expect(sellerAfter?.getResourceQty(sellerRes)).toEqual(0)
  })

  it('Should exchange trade resources and add tariff on already existing country state resources when buyer has enough resources for trade and tariff', async () => {
    const buyerRes = new Resource('Buyer res')
    const sellerRes = new Resource('Seller res')

    const buyer = new CountryBuilder()
      .withName('Buyer')
      .withResource(buyerRes, 2)
      .withTariff(sellerRes, 5)
      .withStateResource(buyerRes, 1)
      .build()

    const seller = new CountryBuilder().withName('Seller').withResource(sellerRes, 1).build()

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      1
    )

    const tradeRequest = new TradeRequest(buyer.id, seller.id, sellerRes, 1, buyerRes)

    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(true)

    const forMakingTrade = testConfigurator.buildForMakingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      1
    )

    await forMakingTrade.execute(tradeRequest)

    const buyerAfter = await forMakingTrade.forApplyingTradeOnCountry.getById(buyer.id)

    expect(buyerAfter?.getResourceQty(buyerRes)).toEqual(0.95)
    expect(buyerAfter?.getStateResourceQuantity(buyerRes)).toEqual(1.05)

    const sellerAfter = await forMakingTrade.forApplyingTradeOnCountry.getById(seller.id)

    expect(sellerAfter?.getResourceQty(sellerRes)).toEqual(0)
  })

  it('should make the seller pay a tariff when it has one set on sold resource', async () => {
    const buyerRes = new Resource('Buyer res')
    const sellerRes = new Resource('Seller res')

    const buyer = new CountryBuilder().withName('Buyer').withResource(buyerRes, 1).build()

    const seller = new CountryBuilder()
      .withName('Seller')
      .withResource(sellerRes, 2)
      .withTariff(buyerRes, 10)
      .build()

    const tradeRequest = new TradeRequest(buyer.id, seller.id, sellerRes, 1, buyerRes)

    const forMakingTrade = testConfigurator.buildForMakingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      1
    )

    await forMakingTrade.execute(tradeRequest)

    const sellerAfter = await forMakingTrade.forApplyingTradeOnCountry.getById(seller.id)

    expect(sellerAfter?.getResourceQty(sellerRes)).toEqual(0.9)
    expect(sellerAfter?.getStateResourceQuantity(sellerRes)).toEqual(0.1)
  })

  it('should make the seller pay a tariff when it has one set on sold resource, and resources have not the same price', async () => {
    const buyerRes = new Resource('Buyer res')
    const sellerRes = new Resource('Seller res')

    const buyer = new CountryBuilder().withName('Buyer').withResource(buyerRes, 2).build()

    const seller = new CountryBuilder()
      .withName('Seller')
      .withResource(sellerRes, 2)
      .withTariff(buyerRes, 10)
      .build()

    const tradeRequest = new TradeRequest(buyer.id, seller.id, sellerRes, 1, buyerRes)

    const forMakingTrade = testConfigurator.buildForMakingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      2
    )

    await forMakingTrade.execute(tradeRequest)

    const sellerAfter = await forMakingTrade.forApplyingTradeOnCountry.getById(seller.id)

    expect(sellerAfter?.getResourceQty(sellerRes)).toEqual(0.8)
    expect(sellerAfter?.getStateResourceQuantity(sellerRes)).toEqual(0.2)
  })

  it('should make the buyer pay a tariff when it has one on sold resource, and resources have not the same price', async () => {
    const buyerRes = new Resource('Buyer res')
    const sellerRes = new Resource('Seller res')

    const buyer = new CountryBuilder()
      .withName('Buyer')
      .withResource(buyerRes, 3)
      .withTariff(sellerRes, 25)
      .build()

    const seller = new CountryBuilder().withName('Seller').withResource(sellerRes, 2).build()

    const tradeRequest = new TradeRequest(buyer.id, seller.id, sellerRes, 1, buyerRes)

    const forMakingTrade = testConfigurator.buildForMakingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      2
    )

    await forMakingTrade.execute(tradeRequest)

    const buyerAfter = await forMakingTrade.forApplyingTradeOnCountry.getById(buyer.id)

    expect(buyerAfter?.getResourceQty(buyerRes)).toEqual(0.75)
    expect(buyerAfter?.getStateResourceQuantity(buyerRes)).toEqual(0.25)
  })
})
