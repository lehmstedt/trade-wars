import type { Country } from "@/domain/entities/Country";

export interface ForApplyingTradeOnCountry {
    save(country: Country): Promise<void>
    getById(countryId: CountryId): Promise<Country|undefined>
}