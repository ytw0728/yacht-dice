import { $Game, GameStage } from 'stores/game'
import { $Users } from 'stores/user'
import { FancyText } from 'ui/FancyText'
import { GraphicButton } from 'ui/GraphicButton'

export const StartButton = new GraphicButton(
  new FancyText({
    text: '시작',
    style: { fontSize: 32, fontWeight: 'bold' },
  }),
)

const onClick = () => {
  const prev = $Game.get()
  if (prev.stage !== GameStage.READY) {
    return
  }
  const users = $Users.get()
  $Game.startGame(users[0].info.id)
}

StartButton.onPress.connect(onClick)
StartButton.on('touchstart', onClick)
