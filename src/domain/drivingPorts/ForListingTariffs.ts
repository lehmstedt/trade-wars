import { CountryNotFoundError } from "@/domain/Errors";
import type { CountryId } from "@/domain/entities/Country";
import type { ICountryRepository } from "@/domain/drivenPorts/ICountryRepository";
import { Tariff } from "@/domain/entities/Tariff";

export class ForListingTariffs {
    forListingCountryTariffs: ICountryRepository
    constructor(countryRepo: ICountryRepository){
        this.forListingCountryTariffs = countryRepo
    }

    async execute(id: CountryId): Promise<Tariff[]>{
        const country = await this.forListingCountryTariffs.getById(id)

        if(!country){
            throw new CountryNotFoundError()
        }

        return country.listTariffs()
        
    }
}