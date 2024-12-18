import type { ForCheckingIfACountryIsWinner } from "@/domain/drivenPorts/ForCheckingIfACountryIsWinner"

class GameState {
    isGameOver: Boolean = false
    winnerName?: string = undefined
}

export class ForCheckingIfGameIsOver {

    forCheckingIfACountryIsWinner: ForCheckingIfACountryIsWinner

    constructor(forCheckingIfACountryIsWinner: ForCheckingIfACountryIsWinner){
        this.forCheckingIfACountryIsWinner = forCheckingIfACountryIsWinner
    }

    async execute(): Promise<GameState>{
        const countries = await this.forCheckingIfACountryIsWinner.list()
        const country = countries[0]

        const gameState = new GameState()

        const goals = country.listGoals()

        for(const goal of goals){
            if(country.getResourceQty(goal.resource) < goal.quantity){
                return gameState
            }
        }

        return {isGameOver: true, winnerName: country.name}
    }
    
}