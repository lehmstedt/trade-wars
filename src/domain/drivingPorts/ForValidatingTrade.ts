import type { TradeRequest } from '@/domain/entities/TradeRequest'
import { TradeValidation, TradeValidationStatus } from '@/domain/entities/TradeValidation'
import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'
import type { IPriceProvider } from '@/domain/IPriceProvider'

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
    const buyer = await this.forValidatingTradeCountry.getById(request.buyer.id)
    if (!buyer) {
      return new TradeValidation(TradeValidationStatus.BuyerCountryNotFound)
    }
    const seller = await this.forValidatingTradeCountry.getById(request.seller.id)
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

    const tariff = buyer.getTariffOnResource(buyerResource)

    if(tariff > 0){
      return new TradeValidation(TradeValidationStatus.InsufficientResourceFromBuyer)
    }

    if (buyer.getResourceQty(buyerResource) < price) {
      return new TradeValidation(TradeValidationStatus.InsufficientResourceFromBuyer, price)
    }

    return new TradeValidation(TradeValidationStatus.OK, price)
  }
}
