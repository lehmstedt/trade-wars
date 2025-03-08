import { CountryPairPriceProvider } from '@/domain/CountryPairPriceProvider'
import { Country } from '@/domain/entities/Country'
import { Resource } from '@/domain/entities/Resource'
import { describe, expect, it } from 'vitest'

describe('CountryPairPriceProvider', () => {
  it('should return 1 when both countries cannot establish a local price', () => {
    const buyer = new Country('Buyer')
    const apple = new Resource('Apple')
    buyer.receiveResource(apple, 1)
    const seller = new Country('Seller')
    const banana = new Resource('Banana')
    seller.receiveResource(banana, 2)

    const provider = new CountryPairPriceProvider()
    const price = provider.getPrice(buyer, seller, apple, banana)

    expect(price).toEqual(1)
  })

  it('should return the price of the buyer when it is the only one to have resource and currency', () => {
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')

    const buyer = new Country('Buyer')
    buyer.receiveResource(apple, 1)
    buyer.receiveResource(banana, 2)

    const seller = new Country('Seller')
    seller.receiveResource(banana, 2)

    const provider = new CountryPairPriceProvider()
    const price = provider.getPrice(buyer, seller, apple, banana)

    expect(price).toEqual(2)
  })

  it('should return the price of the seller when it does have resource and currency', () => {
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')

    const buyer = new Country('Buyer')
    buyer.receiveResource(apple, 1)
    buyer.receiveResource(banana, 2)

    const seller = new Country('Seller')
    seller.receiveResource(banana, 2)
    seller.receiveResource(apple, 3)

    const provider = new CountryPairPriceProvider()
    const price = provider.getPrice(buyer, seller, apple, banana)

    expect(price).toBeCloseTo(2 / 3)
  })
})
