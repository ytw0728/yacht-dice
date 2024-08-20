import { atom, map, type PreinitializedWritableAtom } from 'nanostores'

import { UserState } from 'components/user'

export type RecordKeys =
  | 'one'
  | 'two'
  | 'three'
  | 'four'
  | 'five'
  | 'six'
  | 'Choice'
  | '4 of a Kind'
  | 'Full House'
  | 'S. Straight'
  | 'L. Straight'
  | 'Yacht'

export interface BoardState {
  records: {
    [key in RecordKeys]: {
      round: number
      score: number
    }
  }
}

export function Board(): PreinitializedWritableAtom<BoardState> {
  const initial: BoardState = {
    records: {} as BoardState['records'],
  }

  const state = atom<BoardState>(initial)
  return Object.assign(state, {
    set: (params: { key: RecordKeys; round: number; score: number }): void => {
      const prev = state.get()
      state.set({
        ...prev,
        [params.key]: { round: params.round, score: params.score },
      })
    },
    getAll: (): BoardState => {
      return state.get()
    },
    getByKey: (key: RecordKeys): BoardState['records'][RecordKeys] | undefined => {
      return state.get().records[key]
    },
  })
}

export const $Boards = map<Record<UserState['info']['id'], ReturnType<typeof Board>>>()
