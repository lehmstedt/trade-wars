import { Country, CountryId } from "@/domain/entities/Country";
import { type ICountryRepository } from "@/domain/interfaces/ICountryRepository";

export class InMemoryCountryRepository implements ICountryRepository {
    
    countries = new Map<string, Country>()

    async save(country: Country): Promise<void> {
        this.countries.set(country.id.value, country)
    }
    async getById(countryId: CountryId): Promise<Country|undefined> {
        return this.countries.get(countryId.value)
    }

}