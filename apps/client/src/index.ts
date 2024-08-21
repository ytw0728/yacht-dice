// import { io } from 'socket.io-client'

import { $Boards, Board } from 'components/board'
import { $Dice } from 'components/dice'
import { $Game } from 'components/game'
import { $Users, ConnectionStatus, PlayStatus } from 'components/user'

// const socket = io('http://localhost:3000', {
//   transports: ['websocket'],
// })
// socket.on('connect', () => console.log('connected'))
;(function main() {
  const root = document.querySelector('div#app')!

  // const actionPanel = document.createElement('div')
  // actionPanel.id = 'actions'

  const userAddButton = document.createElement('button')
  userAddButton.textContent = 'Add User'

  const countDiv = document.createElement('div')

  // const rollDice = document.createElement('button')
  // rollDice.textContent = 'Roll Dice'

  const userPanel = document.createElement('div')
  userPanel.id = 'users'

  root.appendChild(userAddButton)
  root.appendChild(countDiv)
  root.appendChild(userPanel)

  // const game = $Game.get()
  // const dice = $Dice.get()
  // const users = $Users.get()
  // const boards = $Boards.get()

  // 1. Add User 버튼을 클릭하면 유저가 추가되게 하기
  userAddButton.addEventListener('click', () => {
    $Users.add(`자주색 비치 발리볼 ${Math.random()}`)
  })

  // 2. 유저가 추가되면, 유저 목록을 화면에 표시하기
  $Users.subscribe((newUsers) => {
    // list clear
    userPanel.innerHTML = ''

    newUsers.map((user) => {
      const elem = document.createElement('div')
      elem.textContent = user.info.nickname
      userPanel.appendChild(elem)
    })
  })

  $Users.subscribe((newUsers) => {
    newUsers.map((user) => $Boards.register(user.info.id))
  })

  // 보드 정보 업데이트될때마다 보드의 갯수를 countDiv에 그려주기
  $Boards.subscribe((newBoards) => {
    countDiv.textContent = ''
    countDiv.textContent = `Board Count: ${Object.keys(newBoards).length}`
  })
})()
