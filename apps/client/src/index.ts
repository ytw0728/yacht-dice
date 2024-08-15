import { io } from 'socket.io-client'

import { test_validate } from 'validater'

test_validate()

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
})
socket.on('connect', () => console.log('connected'))
