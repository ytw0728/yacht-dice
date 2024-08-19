export interface DiceState {
  id: string
  fixed: boolean
  value: number
}

export const DICE_COINT = 5

export class Dice {
  public reset(): void {
    this.dices = Array(DICE_COINT)
      .fill(undefined)
      .map(() => ({
        id: window.crypto.randomUUID(),
        fixed: false,
        value: 1,
      }))
  }

  public roll(): DiceState[] {
    this.dices.forEach((dice) => {
      if (!dice.fixed) {
        dice.value = Math.floor((Math.random() * 10) % 6) + 1
      }
    })
    return this.dices
  }
  constructor() {
    this.reset()
  }
  private dices: DiceState[] = []
}
