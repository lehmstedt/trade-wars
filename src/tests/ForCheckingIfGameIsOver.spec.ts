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

    it('should have a winner when a country has more than its resource goal', async () => {
        const pinapple = new Resource('Pinapple')
        const country = new CountryBuilder()
            .withName('Pinapple')
            .withGoal(pinapple, 10)
            .withResource(pinapple, 11)
            .build()

        const forCheckingIfACountryIsWinner = new InMemoryCountryRepository([country])


        const forCheckingIfGameIsOver = new ForCheckingIfGameIsOver(forCheckingIfACountryIsWinner)

        const gameState = await forCheckingIfGameIsOver.execute()

        expect(gameState.isGameOver).toBe(true)
        expect(gameState.winnerName).toBe(country.name)
    })

    it('should have a winner when a country has reached its goal, and another not', async () => {
        const pinapple = new Resource('Pinapple')

        const loser = new CountryBuilder()
            .withName('Pinapple')
            .withGoal(pinapple, 10)
            .withResource(pinapple, 9)
            .build()

        const winner = new CountryBuilder()
            .withName('Pinapple')
            .withGoal(pinapple, 10)
            .withResource(pinapple, 10)
            .build()

        const forCheckingIfACountryIsWinner = new InMemoryCountryRepository([loser, winner])


        const forCheckingIfGameIsOver = new ForCheckingIfGameIsOver(forCheckingIfACountryIsWinner)

        const gameState = await forCheckingIfGameIsOver.execute()

        expect(gameState.isGameOver).toBe(true)
        expect(gameState.winnerName).toBe(winner.name)
    })

    it('should not have a winner when a country has reached only one on two goals', async () => {
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

    it('should not have a winner when a country has reached only two on three goals', async () => {
        const pinapple = new Resource('Pinapple')
        const apple = new Resource('Apple')
        const table = new Resource('Table')

        const country = new CountryBuilder()
            .withName('NotAWinner')
            .withGoal(pinapple, 10)
            .withGoal(apple, 2)
            .withGoal(table, 3)
            .withResource(pinapple, 10)
            .withResource(apple, 2)
            .withResource(table, 2)
            .build()

        const forCheckingIfACountryIsWinner = new InMemoryCountryRepository([country])

        const forCheckingIfGameIsOver = new ForCheckingIfGameIsOver(forCheckingIfACountryIsWinner)


        const gameState = await forCheckingIfGameIsOver.execute()


        expect(gameState.isGameOver).toBe(false)
        expect(gameState.winnerName).toBe(undefined)
    })

    it('should be game over but no country is winner when two countries have reached theirs goal', async () => {
        const pinapple = new Resource('Pinapple')

        const country1 = new CountryBuilder()
            .withName('Country1')
            .withGoal(pinapple, 10)
            .withResource(pinapple, 10)
            .build()

        const country2 = new CountryBuilder()
            .withName('Country2')
            .withGoal(pinapple, 10)
            .withResource(pinapple, 10)
            .build()

        const forCheckingIfACountryIsWinner = new InMemoryCountryRepository([country1, country2])


        const forCheckingIfGameIsOver = new ForCheckingIfGameIsOver(forCheckingIfACountryIsWinner)

        const gameState = await forCheckingIfGameIsOver.execute()

        expect(gameState.isGameOver).toBe(true)
        expect(gameState.winnerName).toBeUndefined()
    })
})