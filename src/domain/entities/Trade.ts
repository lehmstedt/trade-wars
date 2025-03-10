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

  const buyerTariffRate = buyer.getTariffOnResource(soldResource)
  const buyerTariffValue = soldQuantity * 0.01 * buyerTariffRate

  if (buyer.getResourceQty(currency) < price + buyerTariffValue) {
    return new TradeValidation(
      TradeValidationStatus.InsufficientResourceFromBuyer,
      price,
      0,
      buyerTariffValue
    )
  }

  const sellerTariffRate = seller.getTariffOnResource(currency)
  const sellerTariffValue = price * 0.01 * sellerTariffRate

  if (seller.getResourceQty(soldResource) < soldQuantity + sellerTariffValue) {
    return new TradeValidation(
      TradeValidationStatus.InsufficientResourceFromSeller,
      price,
      sellerTariffValue
    )
  }

  return new TradeValidation(TradeValidationStatus.OK, price, sellerTariffValue, buyerTariffValue)
}
