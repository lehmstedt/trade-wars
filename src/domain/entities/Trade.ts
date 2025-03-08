import type { Country } from '@/domain/entities/Country'
import type { Resource } from '@/domain/entities/Resource'
import { TradeValidation, TradeValidationStatus } from '@/domain/entities/TradeValidation'
import type { IPriceProvider } from '@/domain/IPriceProvider'

export function ValidateTrade(
  buyer: Country,
  seller: Country,
  soldResource: Resource,
  soldQuantity: number,
  currency: Resource,
  priceProvider: IPriceProvider
) {
  if (seller.getResourceQty(soldResource) < soldQuantity) {
    return new TradeValidation(TradeValidationStatus.InsufficientResourceFromSeller)
  }

  const unitPrice = priceProvider.getPrice(buyer, seller, soldResource, currency)
  if (!unitPrice) {
    return new TradeValidation(TradeValidationStatus.NoPriceEstablished)
  }

  const price = unitPrice * soldQuantity

  const tariffRate = buyer.getTariffOnResource(soldResource)
  const tariffValue = price * 0.01 * tariffRate

  if (buyer.getResourceQty(currency) < price + tariffValue) {
    return new TradeValidation(TradeValidationStatus.InsufficientResourceFromBuyer, price)
  }

  return new TradeValidation(TradeValidationStatus.OK, price, tariffValue)
}
