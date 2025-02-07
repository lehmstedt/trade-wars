import { CountryNotFoundError } from "@/domain/Errors";
import type { CountryId } from "@/domain/entities/Country";
import { Tariff } from "@/domain/entities/Tariff";
import type { ForListingCountryTariffs } from "../drivenPorts/ForListingCountryTariffs";

export class ForListingTariffs {
    forListingCountryTariffs: ForListingCountryTariffs
    constructor(forListingCountryTariffs: ForListingCountryTariffs){
        this.forListingCountryTariffs = forListingCountryTariffs
    }

    async execute(id: CountryId): Promise<Tariff[]>{
        const country = await this.forListingCountryTariffs.getById(id)

        if(!country){
            throw new CountryNotFoundError()
        }

        return country.listTariffs()
        
    }
}