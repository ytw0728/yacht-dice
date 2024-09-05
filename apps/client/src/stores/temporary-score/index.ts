import { atom } from 'nanostores'

import { RecordKeys } from 'stores/board'

const state = atom<{ score: number; key: RecordKeys } | null>(null)
export const $TemporaryScore = Object.assign(state, {
  reset: () => {
    state.set(null)
  },
})
