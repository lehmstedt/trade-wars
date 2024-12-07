import { Game } from "@/domain/application/Game";
import { Resource } from "@/domain/entities/Resource";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { InMemoryResourceRepository } from "@/infrastructure/InMemoryResourceRepository";
import { describe, expect, it } from "vitest";

describe('Resources', () => {
    it('should list no resource when no resource is existing', async() => {
        const countryRepository = new InMemoryCountryRepository()
        const resourceRepository = new InMemoryResourceRepository()

        const game = new Game(countryRepository, resourceRepository)

        const resourceList = await game.listResources()

        expect(resourceList.length).toEqual(0)

    })

    it('should list one resource when one resource is existing', async() => {
        const countryRepository = new InMemoryCountryRepository()
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(new Resource('Pinapple'))

        const game = new Game(countryRepository, resourceRepository)

        const resourceList = await game.listResources()

        expect(resourceList.length).toEqual(1)
        expect(resourceList[0].name).toEqual('Pinapple')

    })

    it('should list multiple resource when multiple resource are existing, in no specific order', async() => {
        const countryRepository = new InMemoryCountryRepository()
        const resourceRepository = new InMemoryResourceRepository()
        await resourceRepository.add(new Resource('Pinapple'))
        await resourceRepository.add(new Resource('Banana'))
        await resourceRepository.add(new Resource('Pear'))

        const game = new Game(countryRepository, resourceRepository)

        const resourceList = await game.listResources()

        expect(resourceList.length).toEqual(3)
        expect(resourceList.find(resource => resource.name === 'Pinapple')).toBeTruthy()
        expect(resourceList.find(resource => resource.name === 'Banana')).toBeTruthy()
        expect(resourceList.find(resource => resource.name === 'Pear')).toBeTruthy()

    })
})