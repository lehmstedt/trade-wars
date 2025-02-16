import type { Country } from '@/domain/entities/Country'
import type { Resource } from '@/domain/entities/Resource'
import type { IPriceProvider } from '@/domain/IPriceProvider'

export class CountryPairPriceProvider implements IPriceProvider {
  getPrice(buyer: Country, seller: Country, resource: Resource, currency: Resource): number {
    const sellerPrice = seller.expressResourcePriceInGivenResource(resource, currency)
    if (sellerPrice) {
      return sellerPrice
    }
    const buyerPrice = buyer.expressResourcePriceInGivenResource(resource, currency)
    if (buyerPrice) {
      return buyerPrice
    }
    return 1
  }
}
