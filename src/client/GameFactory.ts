import { Game } from "@/domain/application/Game";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { Resource } from "@/domain/entities/Resource";
import { Country } from "@/domain/entities/Country";
import { CountryPriceProvider } from "./CountryPriceProvider";

export class GameFactory {

    async buildInMemoryGame(): Promise<Game> {

        const iron = new Resource('Iron')
        const charcoal = new Resource('Charcoal')
        const whool = new Resource('Whool')

        const playerCountry = new Country('Player')

        playerCountry.setResource(iron, 12)
        playerCountry.setResource(charcoal, 240)

        const anotherCountry = new Country('Great-Britain')
        anotherCountry.setResource(iron, 30)
        anotherCountry.setResource(whool, 10)

        const countryRepository = new InMemoryCountryRepository([playerCountry, anotherCountry])
        const resourceRepository = new InMemoryResourceRepository([iron, charcoal, whool])


        return new Game(countryRepository, resourceRepository, new CountryPriceProvider())
    }
}