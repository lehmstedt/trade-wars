import { Country } from "@/domain/entities/Country";
import { CountryId } from "@/domain/entities/CountryId";
import type { ICountryRepository } from "@/domain/interfaces/ICountryRepository";

export class InMemoryCountryRepository implements ICountryRepository {

    country: Country = new Country()
    add(country: Country): CountryId {
        this.country = country
        return new CountryId(1)
    }
    getById(countryId: CountryId): Country {
        return this.country
    }

}