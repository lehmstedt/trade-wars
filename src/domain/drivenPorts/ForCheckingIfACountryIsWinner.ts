import type { Country, CountryId } from "@/domain/entities/Country";

export interface ForCheckingIfACountryIsWinner {
    list(): Promise<Country[]>
}