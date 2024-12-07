import { Game } from "@/domain/application/Game";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { Resource } from "@/domain/entities/Resource";
import { Country } from "@/domain/entities/Country";

export class GameFactory {

    async buildInMemoryGame(): Promise<Game> {
        const countryRepo = new InMemoryCountryRepository()
        const resourceRepo = new InMemoryResourceRepository()


        const iron = new Resource('Iron')
        const charcoal = new Resource('Charcoal')
        const whool = new Resource('Whool')

        resourceRepo.add(iron)
        resourceRepo.add(charcoal)
        resourceRepo.add(whool)

        const playerCountry = new Country('Player')

        playerCountry.setResource('Iron', 12)
        playerCountry.setResource('Charcoal', 240)

        const anotherCountry = new Country('Great-Britain')
        anotherCountry.setResource('Iron', 30)
        anotherCountry.setResource('Whool', 10)

        countryRepo.save(playerCountry)
        countryRepo.save(anotherCountry)

        return new Game(countryRepo, resourceRepo)
    }
}