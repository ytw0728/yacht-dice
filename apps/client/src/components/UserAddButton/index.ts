import { $Users } from 'stores/user'
import { FancyText } from 'ui/FancyText'
import { GraphicButton } from 'ui/GraphicButton'

export const UserAddButton = new GraphicButton(
  new FancyText({
    text: '플레이어 추가',
    style: { fontSize: 32, fontWeight: 'bold' },
  }),
)
const onClick = () => $Users.add()
UserAddButton.onPress.connect(onClick)
UserAddButton.on('touchstart', onClick)
