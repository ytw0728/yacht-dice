import { FancyButton } from '@pixi/ui'
import { allTasks } from 'nanostores'
import { Graphics, Sprite } from 'pixi.js'

import { animations, DiceList, sheet } from 'index'
import { $Dice, MAX_DICE_STEP } from 'stores/dice'
import { $TemporaryScore } from 'stores/temporary-score'
import { FancyText } from 'ui/FancyText'
import { GraphicButton } from 'ui/GraphicButton'

export const RollDiceButton = new GraphicButton(
  new FancyText({
    text: '주사위 굴리기',
    style: { fontSize: 32, fontWeight: 'bold' },
  }),
)
const onDown = () => {
  const { dices, step } = $Dice.get()
  if (step >= MAX_DICE_STEP) {
    return
  }
  for (let i = 0; i < animations.dice.length; i++) {
    const roll = animations.dice[i]
    roll.width = 60
    roll.height = 60
    if (dices[i].fixed) {
      continue
    }

    roll.animationSpeed = 0.1666 * 2
    roll.play()

    if (DiceList.children.length > i) {
      DiceList.removeChildAt(i)
    }
    DiceList.addChildAt(roll, i)
  }
  $TemporaryScore.reset()
}
RollDiceButton.onDown.connect(onDown)
RollDiceButton.on('touchstart', onDown)

const onUp = async () => {
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

    const onClick = async () => {
      $Dice.toggle(dice.id)
      await allTasks()
      const fixed = $Dice.get().dices.find((d) => d.id === dice.id)?.fixed ?? false

      const newWrapper = new Graphics().roundRect(6, 6, 48, 48, 8).fill(fixed ? 0x000000 : 0xffffff)
      newWrapper.addChild(item)
      button.defaultView = newWrapper
    }
    button.onPress.connect(onClick)
    button.on('touchstart', onClick)
    dices.push(button)
  }
  DiceList.removeChildren()
  DiceList.addChild(...dices)
}

RollDiceButton.onUp.connect(onUp)
RollDiceButton.on('touchend', onUp)
