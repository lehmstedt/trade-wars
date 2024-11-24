import { ICountryRepository } from "@/infrastructure/InMemoryCountryRepository";

export class SetTariff{

    countryRepo: ICountryRepository
    constructor(countryRepo: ICountryRepository){
        this.countryRepo = countryRepo
    }

    execute(countryId: CountryId, rate: number, resource: Resource){
        
    }
}