import type { Country, CountryId } from "@/domain/entities/Country";

export interface ForValidatingTradeCountry {
    getById(countryId: CountryId): Promise<Country|undefined>
}