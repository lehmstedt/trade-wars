import { Resource } from "@/domain/entities/Resource";
import { InMemoryCountryRepository } from "@/infrastructure/InMemoryCountryRepository";
import { describe, expect, it } from "vitest";
import { CountryBuilder } from "@/domain/entities/CountryBuilder";
import { ForCheckingIfGameIsOver } from "@/domain/drivingPorts/ForCheckingIfGameIsOver";


describe('For checking if game is over', () => {
    it('should not have any winner when both countries have one goal each and no resource', async () => {
        const pinapple = new Resource('Pinapple')
        const country1 = new CountryBuilder().withGoal(pinapple, 10).build()

        const banana = new Resource('Banana')
        const country2 = new CountryBuilder().withGoal(banana, 10).build()

        const forCheckingIfACountryIsWinner = new InMemoryCountryRepository([country1, country2])


        const forCheckingIfGameIsOver = new ForCheckingIfGameIsOver(forCheckingIfACountryIsWinner)

        const gameState = await forCheckingIfGameIsOver.execute()

        expect(gameState.isGameOver).toBe(false)
        expect(gameState.winnerName).toBe(undefined)
    })
})