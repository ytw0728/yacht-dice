import { atom } from 'nanostores'

export interface DiceState {
  id: string
  fixed: boolean
  value: number
}

export const DICE_COINT = 5
export const MAX_DICE_STEP = 3

function initial(): { dices: DiceState[]; step: number } {
  return {
    dices: Array(DICE_COINT)
      .fill(undefined)
      .map(() => ({
        id: window.crypto.randomUUID(),
        fixed: false,
        value: 1,
      })),
    step: 0,
  }
}

const state = atom<{ dices: DiceState[]; step: number }>(initial())

export const $Dice = Object.assign(state, {
  reset: () => {
    state.set(initial())
  },
  roll: () => {
    const prev = state.get()
    if (prev.step >= MAX_DICE_STEP) {
      return
    }

    state.set({
      dices: prev.dices.map((dice) => ({
        ...dice,
        value: dice.fixed ? dice.value : Math.floor((Math.random() * 10) % 6) + 1,
      })),
      step: prev.step + 1,
    })
  },
  toggle: (id: string) => {
    const prev = state.get()
    if (prev.step === 0) {
      return
    }
    state.set({
      dices: prev.dices.map((dice) => ({
        ...dice,
        fixed: dice.id === id ? !dice.fixed : dice.fixed,
      })),
      step: prev.step,
    })
  },
})
