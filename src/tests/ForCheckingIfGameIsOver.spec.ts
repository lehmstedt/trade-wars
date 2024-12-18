import { Resource } from "@/domain/entities/Resource";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { describe, expect, it } from "vitest";
import { CountryBuilder } from "@/domain/entities/CountryBuilder";
import { ForCheckingIfGameIsOver } from "@/domain/drivingPorts/ForCheckingIfGameIsOver";


describe('For checking if game is over', () => {
    it('should not have any winner when no country has goal nor resource', async () => {
        const pinapple = new Resource('Pinapple')
        const country = new CountryBuilder().withGoal(pinapple, 10).build()

        const forCheckingIfACountryIsWinner = new InMemoryCountryRepository([country])

        const forCheckingIfGameIsOver = new ForCheckingIfGameIsOver(forCheckingIfACountryIsWinner)

        const gameState = await forCheckingIfGameIsOver.execute()

        expect(gameState.isGameOver).toBe(false)
        expect(gameState.winnerName).toBe(undefined)
    })

    it('should not have any winner when a country has less resource than its goal', async () => {
        const pinapple = new Resource('Pinapple')
        const country = new CountryBuilder()
            .withGoal(pinapple, 10)
            .withResource(pinapple, 9)
            .build()

        const forCheckingIfACountryIsWinner = new InMemoryCountryRepository([country])


        const forCheckingIfGameIsOver = new ForCheckingIfGameIsOver(forCheckingIfACountryIsWinner)

        const gameState = await forCheckingIfGameIsOver.execute()

        expect(gameState.isGameOver).toBe(false)
        expect(gameState.winnerName).toBe(undefined)
    })

    it('should have a winner when a country has required resources of its goal', async () => {
        const pinapple = new Resource('Pinapple')
        const country = new CountryBuilder()
            .withName('Pinapple')
            .withGoal(pinapple, 10)
            .withResource(pinapple, 10)
            .build()

        const forCheckingIfACountryIsWinner = new InMemoryCountryRepository([country])


        const forCheckingIfGameIsOver = new ForCheckingIfGameIsOver(forCheckingIfACountryIsWinner)

        const gameState = await forCheckingIfGameIsOver.execute()

        expect(gameState.isGameOver).toBe(true)
        expect(gameState.winnerName).toBe(country.name)
    })

    it('should not have a winner when a country has reached only one on multiple goals', async () => {
        const pinapple = new Resource('Pinapple')
        const apple = new Resource('Apple')

        const country = new CountryBuilder()
            .withName('NotAWinner')
            .withGoal(pinapple, 10)
            .withGoal(apple, 2)
            .withResource(pinapple, 10)
            .withResource(apple, 1)
            .build()

        const forCheckingIfACountryIsWinner = new InMemoryCountryRepository([country])


        const forCheckingIfGameIsOver = new ForCheckingIfGameIsOver(forCheckingIfACountryIsWinner)

        const gameState = await forCheckingIfGameIsOver.execute()

        expect(gameState.isGameOver).toBe(false)
        expect(gameState.winnerName).toBe(undefined)
    })
})