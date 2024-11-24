import type { Country } from "@/domain/entities/Country"
import type { CountryId } from "@/domain/entities/CountryId"

export interface ICountryRepository {
    add(country: Country): CountryId
    getById(countryId: CountryId): Country
}