import { FancyButton, List } from '@pixi/ui'
import { allTasks } from 'nanostores'
import { AnimatedSprite, Application, Assets, Spritesheet } from 'pixi.js'

import { RollDiceButton } from 'components/RollDiceButton'
import { StartButton } from 'components/StartButton'
import { TurnEndButton } from 'components/TurnEndButton'
import { UserAddButton } from 'components/UserAddButton'
import { $Boards } from 'stores/board'
import { $Dice, MAX_DICE_STEP } from 'stores/dice'
import { $Game, GameStage } from 'stores/game'
import { $TemporaryScore } from 'stores/temporary-score'
import { $Users } from 'stores/user'
import { FancyText } from 'ui/FancyText'
import { GraphicButton } from 'ui/GraphicButton'
import { ScoreBoard } from 'ui/ScoreBoard'
import { MAX_ROUND, PLAYER_COUNT, validate } from 'utils/validater'

const app = new Application()

export const sheet = new Spritesheet(await Assets.load('d6Red.png'), (await Assets.load('d6Red.json')).data)
await sheet.parse()

export const animations = {
  dice: [
    new AnimatedSprite(sheet.animations.roll01),
    new AnimatedSprite(sheet.animations.roll02),
    new AnimatedSprite(sheet.animations.roll03),
    new AnimatedSprite(sheet.animations.roll04),
    new AnimatedSprite(sheet.animations.roll05),
  ],
}

export const DiceList = new List<AnimatedSprite | FancyButton>({
  children: [],
  type: 'horizontal',
  elementsMargin: 16,
  padding: 10,
})
export const UserList = new List<ScoreBoard>({
  children: [],
  type: 'horizontal',
  elementsMargin: 16,
  padding: 10,
})
export const ActionList = new List<GraphicButton>({
  children: [],
  type: 'horizontal',
  elementsMargin: 16,
  padding: 10,
})

void app
  .init({
    resolution: Math.max(window.devicePixelRatio, 2),
    backgroundColor: 0xffffff,
    resizeTo: window,
  })
  .then(() => {
    document.getElementById('app')?.appendChild(app.canvas)
  })
  .then(() => {
    DiceList.on('childAdded', () => {
      DiceList.position.set((app.screen.width - DiceList.width) / 2, 800)
    })
    DiceList.on('childRemoved', () => {
      DiceList.position.set((app.screen.width - DiceList.width) / 2, 800)
    })

    UserList.on('childAdded', () => {
      UserList.position.set((app.screen.width - UserList.width) / 2, 30)
    })
    UserList.on('childRemoved', () => {
      UserList.position.set((app.screen.width - UserList.width) / 2, 30)
    })
    ActionList.on('childAdded', () => {
      ActionList.position.set((app.screen.width - ActionList.width) / 2, app.screen.height - ActionList.height - 60)
    })
    ActionList.on('childRemoved', () => {
      ActionList.position.set((app.screen.width - ActionList.width) / 2, app.screen.height - ActionList.height - 60)
    })
    app.stage.addChild(DiceList)
    app.stage.addChild(UserList)
    app.stage.addChild(ActionList)
  })
  .then(() => {
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

      const registeredUserID = UserList.children.map((child) => child.id)

      for (const [id, board] of Object.entries(boards)) {
        const target = users.find((user) => user.info.id === id)
        if (!target) {
          return
        }
        if (!registeredUserID.includes(id)) {
          const scoreBoard = new ScoreBoard(target, board)
          UserList.addChild(scoreBoard)
          return
        }

        UserList.children.find((value) => value.id === id)?.setBoard(board)
      }
    })

    $Game.subscribe(async (game) => {
      await allTasks()
      switch (game.stage) {
        case GameStage.WAITING:
          ActionList.removeChildren()
          ActionList.addChild(UserAddButton)
          return
        case GameStage.READY: {
          ActionList.removeChildren()
          ActionList.addChild(UserAddButton)
          ActionList.addChild(StartButton)
          break
        }
        case GameStage.PLAYING: {
          ActionList.removeChild(StartButton)
          ActionList.removeChild(UserAddButton)
          ActionList.addChild(RollDiceButton)
          ActionList.addChild(TurnEndButton)

          if (game.round >= MAX_ROUND) {
            $Game.set({
              ...game,
              stage: GameStage.FINISH,
              winner: validate({
                boards: $Boards.get(),
                currentRound: game.round - 1,
              }).userRank[0].userID,
            })
          } else {
            for (const child of UserList.children) {
              child.setTurn(game.turn ?? '')
            }
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
              style: { fontSize: 32, fontWeight: 'bold' },
            }),
          )
          endButton.position.set(50, 0)
          const onClick = () => {
            $Game.regame()
            $Boards.erase()
            $Dice.reset()
          }
          endButton.onPress.connect(onClick)
          endButton.on('touchstart', onClick)

          ActionList.removeChildren()
          ActionList.addChild(endButton)
          return
        }
      }
    })

    $Dice.subscribe(({ dices, step }) => {
      const currentGame = $Game.get()
      if (currentGame.stage !== GameStage.PLAYING) return
      if (currentGame.turn === null) return

      if (0 === step) {
        for (const child of UserList.children) {
          child.setDice(null)
        }
        DiceList.removeChildren()
      }
      if (0 < step && step <= MAX_DICE_STEP) {
        for (const child of UserList.children) {
          if (child.id === currentGame.turn) {
            console.log(
              dices.map(({ value }) => value),
              step,
            )
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
        for (const child of UserList.children) {
          if (game.turn === child.id) {
            child.render()
          }
        }
      }
    })
  })
