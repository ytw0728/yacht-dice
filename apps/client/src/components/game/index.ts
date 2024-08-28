import { atom } from 'nanostores'

import { UserState } from 'components/user'

export enum GameStage {
  WAITING = 0,
  READY = 1,
  PLAYING = 2,
  FINISH = 3,
}

interface GameStatus {
  stage: GameStage
  turn: UserState['info']['id'] | null
  round: number
  winner: UserState['info']['id'] | null
}

const initial: GameStatus = {
  stage: GameStage.WAITING,
  turn: null,
  round: -1,
  winner: null,
}

const state = atom<GameStatus>(initial)

export const $Game = Object.assign(state, {
  ready: () => {
    const prev = state.get()
    state.set({ ...prev, stage: GameStage.READY })
  },
  startGame: (userID: UserState['info']['id']) => {
    const prev = state.get()
    if (prev.stage !== GameStage.READY) {
      throw new Error('The game is not ready')
    }

    state.set({ ...prev, stage: GameStage.PLAYING, turn: userID, round: 0 })
  },
  setTurn: (userID: UserState['info']['id'] | null): void => {
    const prev = state.get()
    const { stage, turn } = prev
    if (stage !== GameStage.PLAYING) {
      throw new Error('The game is not started')
    }
    if (turn === null) {
      throw new Error('The turn is not set')
    }

    state.set({ ...prev, turn: userID })
  },
  nextRound: (userID: UserState['info']['id']): void => {
    const prev = state.get()
    const { stage } = prev
    if (stage !== GameStage.PLAYING) {
      throw new Error('The game is not started')
    }

    state.set({ ...prev, round: prev.round + 1, turn: userID })
  },
  setWinner: (userID: UserState['info']['id'] | null): void => {
    const prev = state.get()
    const { stage } = prev
    if (!(stage === GameStage.PLAYING || stage === GameStage.FINISH)) {
      throw new Error('The game is not finished')
    }

    state.set({ ...prev, winner: userID })
  },
  reset: (): void => {
    state.set({ ...initial })
  },
  regame: (): void => {
    state.set({ ...initial, stage: GameStage.READY })
  },
})
