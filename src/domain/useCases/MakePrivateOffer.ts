function makeOffer (resA: string, resAQty: number, resB: string, resBQty: number){
    if(resAQty > resBQty){
        return resB
    }
    return resA
}

export default {
    makeOffer
}