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
        return new GameState()
    }
    
}