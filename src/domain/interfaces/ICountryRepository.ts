import { Country, CountryId } from "@/domain/entities/Country"

export interface ICountryRepository {
    add(country: Country): Promise<CountryId>
    getById(countryId: CountryId): Promise<Country|undefined>
}