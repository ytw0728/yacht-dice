// - [ ]  유저 정보 구현
//     - [ ]  유저 상태
//         1. 접속 상태 (접속 완료, 접속 중 등)
//         2. 플레이 상태 (준비 완료, 플레이 중 등)
//     - [ ]  유저 식별 정보
//         1. 아이디, 닉네임 등
//     - [ ]  요트 다이스 보드 기입 정보 및 점수 등

import { atom } from 'nanostores'

export enum ConnectionStatus {
  CONNECTED = 0,
  CONNECTING = 1,
  DISCONNECTED = 2,
}

export enum PlayStatus {
  PLAYING = 0,
  READY = 1,
}

export interface UserState {
  status: {
    connection: ConnectionStatus
    play: PlayStatus
  }

  info: {
    id: string
    nickname: string
  }
}

const initial: UserState[] = []
const state = atom<UserState[]>(initial)

export const $Users = Object.assign(state, {
  add: (user: UserState): void => {
    state.set([...state.get(), user])
  },
  remove: (id: string): void => {
    state.set(state.get().filter((user) => user.info.id !== id))
  },
  update: (id: string, user: Partial<UserState>): void => {
    state.set(state.get().map((prev) => (prev.info.id === id ? { ...prev, ...user } : prev)))
  },
})
