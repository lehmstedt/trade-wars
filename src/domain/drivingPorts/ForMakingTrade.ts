import type { TradeRequest } from '@/domain/entities/TradeRequest'
import { TradeValidation, TradeValidationStatus } from '@/domain/entities/TradeValidation'
import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'
import type { IPriceProvider } from '@/domain/IPriceProvider'
import { ValidateTrade } from '@/domain/entities/Trade'

export class ForMakingTrade {
  forApplyingTradeOnCountry: ICountryPort
  forValidatingTradeResource: IResourcePort
  forCalculatingPrice: IPriceProvider

  constructor(
    forApplyingTradeOnCountry: ICountryPort,
    forValidatingTradeResource: IResourcePort,
    forCalculatingPrice: IPriceProvider
  ) {
    this.forApplyingTradeOnCountry = forApplyingTradeOnCountry
    this.forValidatingTradeResource = forValidatingTradeResource
    this.forCalculatingPrice = forCalculatingPrice
  }

  async execute(request: TradeRequest): Promise<TradeValidation> {
    const buyer = await this.forApplyingTradeOnCountry.getById(request.buyer)
    if (!buyer) {
      return new TradeValidation(TradeValidationStatus.BuyerCountryNotFound)
    }
    const seller = await this.forApplyingTradeOnCountry.getById(request.seller)
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

    const validation = ValidateTrade(
      buyer,
      seller,
      sellerResource,
      request.soldQuantity,
      buyerResource,
      this.forCalculatingPrice
    )

    if (!validation.isValid) {
      return validation
    }

    buyer.tradeWith(
      seller,
      request.currency,
      validation.price ?? 0,
      request.soldResource,
      request.soldQuantity
    )

    if (validation.buyerTariff > 0) {
      buyer.payTariff(buyerResource, validation.buyerTariff)
    }

    if (validation.sellerTariff > 0) {
      seller.payTariff(sellerResource, validation.sellerTariff)
    }

    await this.forApplyingTradeOnCountry.save(buyer)
    await this.forApplyingTradeOnCountry.save(seller)

    return validation
  }
}
