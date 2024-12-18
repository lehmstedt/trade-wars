import { Country } from "@/domain/entities/Country";
import type { Resource } from "@/domain/entities/Resource";

export class CountryBuilder {

    country: Country
    constructor(){
        this.country = new Country(crypto.randomUUID())
    }

    withGoal(resource: Resource, quantity: number){
        this.country.setGoal(resource, quantity)
        return this
    }

    build(){
        return this.country
    }


}