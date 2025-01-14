import type { Country } from "@/domain/entities/Country";

export interface ForCheckingIfACountryIsWinner {
    list(): Promise<Country[]>
}