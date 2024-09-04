import { FancyButton, List } from '@pixi/ui'
import { allTasks } from 'nanostores'
import { AnimatedSprite, Application, Assets, Graphics, Sprite, Spritesheet } from 'pixi.js'

import { $Boards, BonusRecordKey, BonusScore, BonusThreshold, RecordKeyArray } from 'components/board'
import { $Dice, MAX_DICE_STEP } from 'components/dice'
import { $Game, GameStage } from 'components/game'
import { $TemporaryScore } from 'components/temporary-score'
import { $Users } from 'components/user'
import { FancyText } from 'ui/FancyText'
import { GraphicButton } from 'ui/GraphicButton'
import { ScoreBoard } from 'ui/ScoreBoard'
import { MAX_ROUND, PLAYER_COUNT, validate } from 'utils/validater'

const app = new Application()

await app.init({ resolution: Math.max(window.devicePixelRatio, 2), backgroundColor: 0xffffff, resizeTo: window })
document.getElementById('app')?.appendChild(app.canvas)

const sheet = new Spritesheet(await Assets.load('public/d6Red.png'), (await Assets.load('public/d6Red.json')).data)
await sheet.parse()

const animations = {
  dice: [
    new AnimatedSprite(sheet.animations.roll01),
    new AnimatedSprite(sheet.animations.roll02),
    new AnimatedSprite(sheet.animations.roll03),
    new AnimatedSprite(sheet.animations.roll04),
    new AnimatedSprite(sheet.animations.roll05),
  ],
}

const diceList = new List<AnimatedSprite | FancyButton>({
  children: [],
  type: 'horizontal',
  elementsMargin: 16,
  padding: 10,
})
diceList.position.set(0, 335)
app.stage.addChild(diceList)

const userList = new List<ScoreBoard>({
  children: [],
  type: 'horizontal',
  elementsMargin: 16,
  padding: 10,
})
userList.position.set(0, 10)
app.stage.addChild(userList)

const actionList = new List<GraphicButton>({
  children: [],
  type: 'horizontal',

  elementsMargin: 16,
  padding: 10,
})
actionList.position.set(0, 420)
app.stage.addChild(actionList)

const userAddButton = new GraphicButton(
  new FancyText({
    text: '플레이어 추가',
    style: { fontSize: 12, fontWeight: 'bold' },
  }),
)
userAddButton.onPress.connect(() => $Users.add())

$Users.subscribe((users) => {
  if (users.length === 0) {
    $Game.reset()
  }
  if (users.length >= PLAYER_COUNT.min && users.length <= PLAYER_COUNT.max) {
    $Game.ready()
  }
  users.map((user) => $Boards.register(user.info.id))
})

$Boards.subscribe((boards) => {
  const users = $Users.get()

  const registeredUserID = userList.children.map((child) => child.id)

  for (const [id, board] of Object.entries(boards)) {
    const target = users.find((user) => user.info.id === id)
    if (!target) {
      return
    }
    if (!registeredUserID.includes(id)) {
      const scoreBoard = new ScoreBoard(target, board)
      userList.addChild(scoreBoard)
      return
    }

    userList.children.find((value) => value.id === id)?.setBoard(board)
  }
})

$Game.subscribe(async (game) => {
  await allTasks()
  switch (game.stage) {
    case GameStage.WAITING:
      actionList.removeChildren()
      actionList.addChild(userAddButton)
      return
    case GameStage.READY: {
      actionList.removeChildren()
      actionList.addChild(userAddButton)
      actionList.addChild(startButton)
      break
    }
    case GameStage.PLAYING: {
      actionList.removeChild(startButton)
      actionList.removeChild(userAddButton)
      actionList.addChild(rollDiceButton)
      actionList.addChild(turnEndButton)

      if (game.round >= MAX_ROUND) {
        $Game.set({
          ...game,
          stage: GameStage.FINISH,
          winner: validate({
            boards: $Boards.get(),
            currentRound: game.round - 1,
          }).userRank[0].userID,
        })
      }
      return
    }

    case GameStage.FINISH: {
      const user = $Users.get().find((u) => u.info.id === game.winner)
      const nickname = user?.info.nickname ?? ''
      const score = Object.values($Boards.getAll(user?.info.id ?? '')?.records ?? {}).reduce(
        (prev, curr) => prev + curr.score,
        0,
      )

      const endButton = new GraphicButton(
        new FancyText({
          text: `${nickname} 승리! (${score} 점)`,
          style: { fontSize: 12, fontWeight: 'bold' },
        }),
      )
      endButton.position.set(50, 0)
      endButton.onPress.connect(() => {
        $Game.regame()
        $Boards.erase()
        $Dice.reset()
      })
      actionList.removeChildren()
      actionList.addChild(endButton)
      return
    }
  }
})

$Dice.subscribe(({ dices, step }) => {
  const currentGame = $Game.get()
  if (currentGame.stage !== GameStage.PLAYING) return
  if (currentGame.turn === null) return

  if (0 === step) {
    for (const child of userList.children) {
      child.setDice(null)
    }
    diceList.removeChildren()
  }
  if (0 < step && step <= MAX_DICE_STEP) {
    for (const child of userList.children) {
      if (child.id === currentGame.turn) {
        child.setDice({ dices, step })
      } else {
        child.setDice(null)
      }
    }
  }
})

$TemporaryScore.subscribe(async (temporary) => {
  await allTasks()

  const game = $Game.get()
  if (temporary) {
    for (const child of userList.children) {
      if (game.turn === child.id) {
        child.render()
      }
    }
  }
})

const startButton = new GraphicButton(
  new FancyText({
    text: '시작',
    style: { fontSize: 12, fontWeight: 'bold' },
  }),
)
startButton.onPress.connect(() => {
  const prev = $Game.get()
  if (prev.stage !== GameStage.READY) {
    return
  }
  const users = $Users.get()
  $Game.startGame(users[0].info.id)

  userList.children.forEach((child) => {
    if (child.id === users[0].info.id) {
      const { dices, step } = $Dice.get()
      child.setDice({ dices, step })
    } else {
      child.setDice(null)
    }
  })
})

const rollDiceButton = new GraphicButton(
  new FancyText({
    text: '주사위 굴리기',
    style: { fontSize: 12, fontWeight: 'bold' },
  }),
)
rollDiceButton.onDown.connect(() => {
  const { dices, step } = $Dice.get()
  if (step >= MAX_DICE_STEP) {
    return
  }
  for (let i = 0; i < animations.dice.length; i++) {
    const roll = animations.dice[i]
    if (dices[i].fixed) {
      continue
    }

    roll.animationSpeed = 0.1666 * 2
    roll.play()

    if (diceList.children.length > i) {
      diceList.removeChildAt(i)
    }
    diceList.addChildAt(roll, i)
  }
})
rollDiceButton.onUp.connect(async () => {
  const { step } = $Dice.get()
  if (step >= MAX_DICE_STEP) {
    return
  }
  $Dice.roll()
  await allTasks()

  const current = $Dice.get().dices
  const dices: FancyButton[] = []
  for (const dice of current) {
    const item = new Sprite(
      sheet.textures[
        (() => {
          switch (dice.value) {
            case 1:
              return '0000.png'
            case 2:
              return '0021.png'
            case 3:
              return '0024.png'
            case 4:
              return '0001.png'
            case 5:
              return '0033.png'
            case 6:
              return '0048.png'
            default:
              return '0048.png'
          }
        })()
      ],
    )

    const wrapper = new Graphics().roundRect(6, 6, 48, 48, 8).fill(dice.fixed ? 0x000000 : 0xffffff)
    wrapper.addChild(item)

    const button = new FancyButton({
      defaultView: wrapper,
    })

    button.onPress.connect(async () => {
      $Dice.toggle(dice.id)
      await allTasks()
      const fixed = $Dice.get().dices.find((d) => d.id === dice.id)?.fixed ?? false

      const wrapper = new Graphics().roundRect(6, 6, 48, 48, 8).fill(fixed ? 0x000000 : 0xffffff)
      wrapper.addChild(item)
      button.defaultView = wrapper
    })
    dices.push(button)
  }
  diceList.removeChildren()
  diceList.addChild(...dices)
})

const turnEndButton = new GraphicButton(
  new FancyText({
    text: '턴 종료',
    style: { fontSize: 12, fontWeight: 'bold' },
  }),
)
turnEndButton.onPress.connect(() => {
  const dice = $Dice.get()
  if (dice.step === 0) return

  const current = $Game.get()
  if (current.turn === null) return

  const temporary = $TemporaryScore.get()
  if (temporary === null) return

  const currentBoard = $Boards.getAll(current.turn)
  $Boards.setRecord(current.turn, temporary.key, {
    round: current.round,
    score: temporary.score,
  })

  if (
    currentBoard &&
    [...RecordKeyArray.simple, ...RecordKeyArray.combination].reduce(
      (prev, curr) => prev + (currentBoard.records[curr]?.score ?? 0),
      0,
    ) >= BonusThreshold
  ) {
    $Boards.setRecord(current.turn, BonusRecordKey, {
      round: current.round,
      score: BonusScore,
    })
  }

  const users = $Users.get()
  const currentUserIndex = users.findIndex((user) => user.info.id === current.turn)

  if (currentUserIndex + 1 === users.length) {
    $Game.nextRound(users[0].info.id)
    $Dice.reset()
    $TemporaryScore.reset()
    return
  }

  $Game.setTurn(users[(currentUserIndex + 1) % users.length].info.id)
  $Dice.reset()
  $TemporaryScore.reset()
})
