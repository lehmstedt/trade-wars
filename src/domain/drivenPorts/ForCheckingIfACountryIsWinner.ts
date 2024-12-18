import type { Country, CountryId } from "@/domain/entities/Country";

export interface ForCheckingIfACountryIsWinner {
    getById(countryId: CountryId): Promise<Country|undefined>
}