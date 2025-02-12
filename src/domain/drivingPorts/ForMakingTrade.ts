import type { ForApplyingTradeOnCountry } from '@/domain/drivenPorts/ForApplyingTradeOnCountry'
import type { ForValidatingTradeResource } from '@/domain/drivenPorts/ForValidatingTradeResource'
import type { TradeRequest } from '@/domain/entities/TradeRequest'
import type { ForCalculatingPrice } from '@/domain/drivenPorts/ForCalculatingPrice'
import { TradeValidation, TradeValidationStatus } from '@/domain/entities/TradeValidation'

export class ForMakingTrade {
  forApplyingTradeOnCountry: ForApplyingTradeOnCountry
  forValidatingTradeResource: ForValidatingTradeResource
  forCalculatingPrice: ForCalculatingPrice

  constructor(
    forApplyingTradeOnCountry: ForApplyingTradeOnCountry,
    forValidatingTradeResource: ForValidatingTradeResource,
    forCalculatingPrice: ForCalculatingPrice
  ) {
    this.forApplyingTradeOnCountry = forApplyingTradeOnCountry
    this.forValidatingTradeResource = forValidatingTradeResource
    this.forCalculatingPrice = forCalculatingPrice
  }

  async execute(request: TradeRequest): Promise<TradeValidation> {
    const buyer = await this.forApplyingTradeOnCountry.getById(request.buyer.id)
    if (!buyer) {
      return new TradeValidation(TradeValidationStatus.BuyerCountryNotFound)
    }
    const seller = await this.forApplyingTradeOnCountry.getById(request.seller.id)
    if (!seller) {
      return new TradeValidation(TradeValidationStatus.SellerCountryNotFound)
    }

    const sellerResource = await this.forValidatingTradeResource.getByName(
      request.soldResource.name
    )
    if (!sellerResource) {
      return new TradeValidation(TradeValidationStatus.SellerResourceNotFound)
    }

    const buyerResource = await this.forValidatingTradeResource.getByName(request.currency.name)
    if (!buyerResource) {
      return new TradeValidation(TradeValidationStatus.BuyerResourceNotFound)
    }

    if (seller.getResourceQty(request.soldResource) < request.soldQuantity) {
      return new TradeValidation(TradeValidationStatus.InsufficientResourceFromSeller)
    }

    const unitPrice = this.forCalculatingPrice.getPrice(
      buyer,
      seller,
      request.soldResource,
      request.currency
    )
    if (!unitPrice) {
      return new TradeValidation(TradeValidationStatus.NoPriceEstablished)
    }

    const price = unitPrice * request.soldQuantity

    if (buyer.getResourceQty(buyerResource) < price) {
      return new TradeValidation(TradeValidationStatus.InsufficientResourceFromBuyer, price)
    }

    const validation = new TradeValidation(TradeValidationStatus.OK, price)

    request.buyer.tradeWith(
      request.seller,
      request.currency,
      validation.price ?? 0,
      request.soldResource,
      request.soldQuantity
    )

    await this.forApplyingTradeOnCountry.save(request.buyer)
    await this.forApplyingTradeOnCountry.save(request.seller)

    return validation
  }
}
