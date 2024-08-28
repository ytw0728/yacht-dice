import { map } from 'nanostores'

import { UserState } from 'components/user'

export type RecordKeys =
  | 'One'
  | 'Two'
  | 'Three'
  | 'Four'
  | 'Five'
  | 'Six'
  | 'Choice'
  | '4 of a Kind'
  | 'Full House'
  | 'S. Straight'
  | 'L. Straight'
  | 'Yacht'

export const BonusRecordKey = '> 63'
export const BonusScore = 35

export const RecordKeyArray: RecordKeys[] = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Choice',
  '4 of a Kind',
  'Full House',
  'S. Straight',
  'L. Straight',
  'Yacht',
]

export interface BoardState {
  records: Partial<
    Record<
      RecordKeys | typeof BonusRecordKey,
      {
        round: number
        score: number
      }
    >
  >
}

export function Board(): BoardState {
  const initial: BoardState = {
    records: {} as BoardState['records'],
  }
  return initial
}

const state = map<Record<UserState['info']['id'], ReturnType<typeof Board>>>()

export const $Boards = Object.assign(state, {
  register: (id: UserState['info']['id']): void => {
    const prev = state.get()
    if (Object.keys(prev).includes(id)) {
      return
    }

    state.setKey(id, Board())
  },
  erase: () => {
    const prev = state.get()
    for (const key of Object.keys(prev)) {
      state.setKey(key, Board())
    }
  },
  setRecord(
    id: UserState['info']['id'],
    key: RecordKeys | typeof BonusRecordKey,
    params: { round: number; score: number },
  ): void {
    const board = state.get()[id]
    if (board === undefined) {
      return
    }
    state.setKey(id, {
      ...board,
      records: {
        ...board.records,
        [key]: { ...params },
      },
    })
  },
  getAll: (id: UserState['info']['id']): ReturnType<typeof Board> | undefined => {
    return state.get()[id]
  },
  getByKey: (
    id: UserState['info']['id'],
    key: RecordKeys,
  ): ReturnType<typeof Board>['records'][RecordKeys] | undefined => {
    const board = state.get()[id]
    if (board === undefined) {
      return
    }
    return board.records[key]
  },
})
