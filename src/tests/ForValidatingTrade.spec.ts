import { TestConfigurator } from '@/configurator/TestConfigurator'
import { CountryBuilder } from '@/domain/entities/CountryBuilder'
import { Resource } from '@/domain/entities/Resource'
import { TradeRequest } from '@/domain/entities/TradeRequest'
import { TradeValidationStatus } from '@/domain/entities/TradeValidation'
import { describe, expect, it } from 'vitest'

const testConfigurator = new TestConfigurator()

describe('For validating trade', () => {
  it('should not be valid when seller has just enough resources to sell but also a tariff on buyer resource', async () => {
    const buyerRes = new Resource('Buyer res')
    const sellerRes = new Resource('Seller res')

    const buyer = new CountryBuilder().withName('Buyer').withResource(buyerRes, 1).build()

    const seller = new CountryBuilder()
      .withName('Seller')
      .withResource(sellerRes, 1)
      .withTariff(buyerRes, 12)
      .build()

    const tradeRequest = new TradeRequest(buyer.id, seller.id, sellerRes, 1, buyerRes)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      1
    )
    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid).toBe(false)
    expect(validation.sellerTariff).toEqual(0.12)
    expect(validation.status).toEqual(TradeValidationStatus.InsufficientResourceFromSeller)
  })

  it('Cannot be made when the buyer has just enough resource but a 5 percent tariff is set on it', async () => {
    const buyerRes = new Resource('Buyer res')
    const sellerRes = new Resource('Seller res')

    const buyer = new CountryBuilder()
      .withName('Buyer')
      .withResource(buyerRes, 1)
      .withTariff(sellerRes, 5)
      .build()

    const seller = new CountryBuilder().withName('Seller').withResource(sellerRes, 1).build()

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      1
    )

    const validation = await forValidatingTrade.execute(
      new TradeRequest(buyer.id, seller.id, sellerRes, 1, buyerRes)
    )

    expect(validation.isValid).toBe(false)
    expect(validation.buyerTariff).toEqual(0.05)
    expect(validation.status).toEqual(TradeValidationStatus.InsufficientResourceFromBuyer)
  })

  it('should validate a trade where the seller pay a tariff when it has one set on sold resource, and resources have not the same price', async () => {
    const buyerRes = new Resource('Buyer res')
    const sellerRes = new Resource('Seller res')

    const buyer = new CountryBuilder().withName('Buyer').withResource(buyerRes, 2).build()

    const seller = new CountryBuilder()
      .withName('Seller')
      .withResource(sellerRes, 2)
      .withTariff(buyerRes, 10)
      .build()

    const tradeRequest = new TradeRequest(buyer.id, seller.id, sellerRes, 1, buyerRes)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      2
    )

    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid)
    expect(validation.sellerTariff).toEqual(0.2)
  })

  it('should validate a trade where the buyer pay a tariff when it has one set on sold resource, and resources have not the same price', async () => {
    const buyerRes = new Resource('Buyer res')
    const sellerRes = new Resource('Seller res')

    const buyer = new CountryBuilder()
      .withName('Buyer')
      .withResource(buyerRes, 2)
      .withTariff(sellerRes, 15)
      .build()

    const seller = new CountryBuilder().withName('Seller').withResource(sellerRes, 1).build()

    const tradeRequest = new TradeRequest(buyer.id, seller.id, sellerRes, 1, buyerRes)

    const forValidatingTrade = testConfigurator.buildForValidatingTrade(
      [buyer, seller],
      [buyerRes, sellerRes],
      2
    )

    const validation = await forValidatingTrade.execute(tradeRequest)

    expect(validation.isValid)
    expect(validation.buyerTariff).toEqual(0.15)
  })

  it('Should validate a trade where the buyer have a tariff on sold resource', async () => {
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
    expect(validation.buyerTariff).toEqual(0.05)
  })
})
