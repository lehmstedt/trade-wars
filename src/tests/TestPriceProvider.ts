import type { IPriceProvider } from "@/domain/IPriceProvider";

export class TestPriceProvider implements IPriceProvider {

    price?: number

    async getPrice(): Promise<number | undefined> {
        return this.price
    }

    setPriceForAnyResource(price: number|undefined){
        this.price = price
    }

}