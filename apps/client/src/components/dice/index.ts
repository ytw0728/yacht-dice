import { atom } from 'nanostores'

export interface DiceState {
  id: string
  fixed: boolean
  value: number
}

export const DICE_COINT = 5

const initial: DiceState[] = Array(DICE_COINT)
  .fill(undefined)
  .map(() => ({
    id: window.crypto.randomUUID(),
    fixed: false,
    value: 1,
  }))

const state = atom<DiceState[]>(initial)

export const $Dice = Object.assign(state, {
  reset: () => {
    state.set({ ...initial })
  },
  roll: () => {
    state.set(
      state.get().map((dice) => ({
        ...dice,
        value: dice.fixed ? dice.value : Math.floor((Math.random() * 10) % 6) + 1,
      })),
    )
  },
  fix: (id: string) => {
    state.set(
      state.get().map((dice) => ({
        ...dice,
        fixed: dice.id === id ? !dice.fixed : dice.fixed,
      })),
    )
  },
})
