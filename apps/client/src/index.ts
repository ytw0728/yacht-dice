import { io } from 'socket.io-client'

import { $Boards } from 'components/board'
import { $Dice } from 'components/dice'
import { $Game } from 'components/game'
import { $Users } from 'components/user'

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
})
socket.on('connect', () => console.log('connected'))
;(function main() {
  const root = document.querySelector('div#app')!

  const actionPanel = document.createElement('div')
  actionPanel.id = 'actions'

  const userAdd = document.createElement('button')
  userAdd.textContent = 'Add User'
  userAdd.onclick = () => {}

  const rollDice = document.createElement('button')
  rollDice.textContent = 'Roll Dice'

  const userPanel = document.createElement('div')
  userPanel.id = 'users'

  // $Game, $Dice, $Users, $Boards
})()
