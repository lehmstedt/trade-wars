import { Country, CountryId } from "@/domain/entities/Country";
import { type ICountryRepository } from "@/domain/drivenPorts/ICountryRepository";
import type { ForCheckingIfACountryIsWinner } from "@/domain/drivenPorts/ForCheckingIfACountryIsWinner";

export class InMemoryCountryRepository implements ICountryRepository, ForCheckingIfACountryIsWinner {

    countries = new Map<string, Country>()

    constructor(countries?: Country[]){
        if(countries){
            countries.forEach(country => this.countries.set(country.id.value, country))
        }
        
    }

    async list(): Promise<Country[]> {
        return Array.from(this.countries.values())
    }


    async save(country: Country): Promise<void> {
        this.countries.set(country.id.value, country)
    }
    async getById(countryId: CountryId): Promise<Country|undefined> {
        return this.countries.get(countryId.value)
    }

    set(countries: Country[]){
        this.countries.clear();
        countries.forEach(country => this.countries.set(country.id.value, country))
    }

}