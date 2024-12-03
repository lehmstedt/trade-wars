import { CountryNotFoundError } from "@/domain/Errors";

export class ListTariffs {
    async execute(){
        throw new CountryNotFoundError()
    }
}