import { Country, CountryId } from "@/domain/entities/Country";
import { type ICountryRepository } from "@/domain/interfaces/ICountryRepository";

export class InMemoryCountryRepository implements ICountryRepository {

    countries: Map<CountryId, Country> = new Map<CountryId, Country>()
    async add(country: Country): Promise<CountryId> {
        const id = new CountryId(1)
        this.countries.set(id, country)
        return id
    }
    async getById(countryId: CountryId): Promise<Country|undefined> {
        return this.countries.get(countryId)
    }

}