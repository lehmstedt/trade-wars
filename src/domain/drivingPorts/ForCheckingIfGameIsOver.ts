import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'

class GameState {
  constructor(numberOfProvisoryWinners: number, provisoryWinner?: string) {
    this.isGameOver = numberOfProvisoryWinners > 0
    this.winnerName = numberOfProvisoryWinners === 1 ? provisoryWinner : undefined
  }
  isGameOver: Boolean = false
  winnerName?: string = undefined
}

export class ForCheckingIfGameIsOver {
  forCheckingIfACountryIsWinner: ICountryPort

  constructor(forCheckingIfACountryIsWinner: ICountryPort) {
    this.forCheckingIfACountryIsWinner = forCheckingIfACountryIsWinner
  }

  async execute(): Promise<GameState> {
    const countries = await this.forCheckingIfACountryIsWinner.list()

    let numberOfCountriesWithReachedGoals = 0
    let winnerName: string | undefined
    for (const country of countries) {
      if (country.hasReachedHisGoals()) {
        numberOfCountriesWithReachedGoals++
        winnerName = country.name
      }
    }

    return new GameState(numberOfCountriesWithReachedGoals, winnerName)
  }
}
