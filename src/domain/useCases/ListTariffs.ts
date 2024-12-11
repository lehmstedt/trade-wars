import { CountryNotFoundError } from "@/domain/Errors";
import type { CountryId } from "@/domain/entities/Country";
import type { ICountryRepository } from "@/domain/ports/ICountryRepository";
import { Tariff } from "@/domain/entities/Tariff";

export class ListTariffs {
    countryRepository: ICountryRepository
    constructor(countryRepo: ICountryRepository){
        this.countryRepository = countryRepo
    }

    async execute(id: CountryId): Promise<Tariff[]>{
        const country = await this.countryRepository.getById(id)

        if(!country){
            throw new CountryNotFoundError()
        }

        return country.listTariffs()
        
    }
}