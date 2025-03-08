import type { TradeRequest } from '@/domain/entities/TradeRequest'
import { TradeValidation, TradeValidationStatus } from '@/domain/entities/TradeValidation'
import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'
import type { IPriceProvider } from '@/domain/IPriceProvider'
import { ValidateTrade } from '@/domain/entities/Trade'

export class ForValidatingTrade {
  forValidatingTradeCountry: ICountryPort
  forValidatingTradeResource: IResourcePort
  forCalculatingPrice: IPriceProvider

  constructor(
    forValidatingTradeCountry: ICountryPort,
    forValidatingTradeResource: IResourcePort,
    forCalculatingPrice: IPriceProvider
  ) {
    this.forValidatingTradeCountry = forValidatingTradeCountry
    this.forValidatingTradeResource = forValidatingTradeResource
    this.forCalculatingPrice = forCalculatingPrice
  }

  async execute(request: TradeRequest): Promise<TradeValidation> {
    const buyer = await this.forValidatingTradeCountry.getById(request.buyer)
    if (!buyer) {
      return new TradeValidation(TradeValidationStatus.BuyerCountryNotFound)
    }
    const seller = await this.forValidatingTradeCountry.getById(request.seller)
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

    return ValidateTrade(
      buyer,
      seller,
      sellerResource,
      request.soldQuantity,
      buyerResource,
      this.forCalculatingPrice
    )
  }
}
