
export class CountryNotFoundError {}
export class ResourceNotFoundError {}
export class InsufficientResourceFromSellerError {}
export class InsufficientResourceFromBuyerError {}
export class NoPriceEstablishedError {}
export class BuyerResourceNotFoundError {}

export interface ITradeError {}
export class SellerCountryNotFoundError implements ITradeError {}
export class BuyerCountryNotFoundError implements ITradeError {}
export class SellerResourceNotFoundError implements ITradeError {}