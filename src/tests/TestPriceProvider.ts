import type { Resource } from "@/domain/entities/Resource";
import type { IPriceProvider } from "@/domain/IPriceProvider";

export class TestPriceProvider implements IPriceProvider {

    price?: number

    async getPriceForResource(resource: Resource, currencyResource: Resource): Promise<number | undefined> {
        return this.price
    }

    setPriceForAnyResource(price: number|undefined){
        this.price = price
    }

}