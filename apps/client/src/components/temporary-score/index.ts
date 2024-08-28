import { atom } from 'nanostores'

import { RecordKeys } from 'components/board'

const initial = {
  scores: null,
  checkedKey: null,
}

const state = atom<{ scores: Record<RecordKeys, number> | null; checkedKey: RecordKeys | null }>({ ...initial })
export const $TemporaryScore = Object.assign(state, {
  reset: () => {
    state.set({ ...initial })
  },
})
