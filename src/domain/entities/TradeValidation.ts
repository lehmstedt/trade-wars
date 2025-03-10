export enum TradeValidationStatus {
  OK = 'OK',
  SellerCountryNotFound = 'SellerCountryNotFound',
  BuyerCountryNotFound = 'BuyerCountryNotFound',
  BuyerResourceNotFound = 'BuyerResourceNotFound',
  SellerResourceNotFound = 'SellerResourceNotFound',
  InsufficientResourceFromSeller = 'InsufficientResourceFromSeller',
  NoPriceEstablished = 'NoPriceEstablished',
  InsufficientResourceFromBuyer = 'InsufficientResourceFromBuyer'
}

export class TradeValidation {
  isValid: Boolean = false
  price?: number = 0
  status: TradeValidationStatus
  sellerTariff: number = 0
  buyerTariff: number = 0

  constructor(
    status: TradeValidationStatus,
    price?: number,
    sellerTariff: number = 0,
    buyerTariff: number = 0
  ) {
    this.price = price
    this.status = status
    this.sellerTariff = sellerTariff
    this.buyerTariff = buyerTariff

    if (this.status === TradeValidationStatus.OK) {
      this.isValid = true
    }
  }
}
