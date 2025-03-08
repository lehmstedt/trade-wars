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
  tariff?: number = 0
  status: TradeValidationStatus

  constructor(status: TradeValidationStatus, price?: number, tariff?: number) {
    this.price = price
    this.status = status
    this.tariff = tariff

    if (this.status === TradeValidationStatus.OK) {
      this.isValid = true
    }
  }
}
