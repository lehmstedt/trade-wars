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

    withResource(resource: Resource, quantity: number){
        this.country.setResource(resource, quantity)
        return this
    }

    withName(name: string){
        this.country.name = name
        return this
    }

    build(){
        return this.country
    }


}