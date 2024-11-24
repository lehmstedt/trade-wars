import { describe, expect, it } from "vitest";
import MakePrivateOffer from "./MakePrivateOffer";

describe('privateDemand', () => {
    it('should ask the resource it has less', () => {
        const resA = 'A'
        const resAQty = 1

        const resB = 'B'
        const resBQty = 2

        const tradeOffer = MakePrivateOffer.makeOffer(resA, resAQty, resB, resBQty)
        expect(tradeOffer).toEqual(resA)
    })

    it('should ask for a resource it doesnt have yet', () => {
        
    })
})