export class Tariff{

    resourceName: string
    rate: number
    constructor(resourceName: string, rate: number) {
        this.resourceName = resourceName
        this.rate = rate
    }
}