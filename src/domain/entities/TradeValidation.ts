export enum TradeValidationStatus {
    OK,
    SellerCountryNotFound,
    BuyerCountryNotFound,
    BuyerResourceNotFound,
    SellerResourceNotFound,
    InsufficientResourceFromSeller,
    NoPriceEstablished,
    InsufficientResourceFromBuyer
}

export class TradeValidation {
    isValid: Boolean = false
    price?: number = 0
    status: TradeValidationStatus

    constructor(status: TradeValidationStatus, price?: number){

        this.price = price
        this.status = status
        
        if(this.status === TradeValidationStatus.OK){
            this.isValid = true
        }
    }
}