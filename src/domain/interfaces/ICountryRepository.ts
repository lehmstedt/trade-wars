import { Country, CountryId } from "@/domain/entities/Country"

export interface ICountryRepository {
    save(country: Country): Promise<void>
    getById(countryId: CountryId): Promise<Country|undefined>
}