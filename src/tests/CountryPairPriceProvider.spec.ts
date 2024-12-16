import { CountryPairPriceProvider } from "@/domain/CountryPairPriceProvider";
import { Country } from "@/domain/entities/Country";
import { Resource } from "@/domain/entities/Resource";
import { describe, expect, it } from "vitest";

describe('CountryPairPriceProvider', () => {

    it('should return 1 when both countries cannot establish a local price', () => {
        const buyer = new Country('Buyer')
        const apple = new Resource('Apple')
        buyer.setResource(apple, 1)
        const seller = new Country('Seller')
        const banana = new Resource('Banana')
        seller.setResource(banana, 2)
    
        const provider = new CountryPairPriceProvider()
        const price = provider.getPrice(buyer, seller, apple, banana)
    
        expect(price).toEqual(1)
    })


    
})