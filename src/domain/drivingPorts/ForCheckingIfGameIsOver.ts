import type { ForCheckingIfACountryIsWinner } from "@/domain/drivenPorts/ForCheckingIfACountryIsWinner"
import { Resource } from "../entities/Resource"

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

        if(country.hasReachedHisGoals()){
            return {isGameOver: true, winnerName: country.name}
        }

        return {isGameOver: false}
        
    }
    
}