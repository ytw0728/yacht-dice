import { ButtonOptions, FancyButton } from '@pixi/ui'
import { Graphics } from 'pixi.js'

import { FancyText } from 'ui/FancyText'

export class GraphicButton extends FancyButton {
  constructor(text: FancyText, options?: ButtonOptions) {
    super(options)

    const padding = options?.padding ?? 24
    const view = new Graphics()
      .roundRect(0, 0, text.width + padding, text.height + padding, 8)
      .stroke({ color: 0x000000, width: 2 })
      .fill(0xffffff)
    view.addChild(text)
    text.position.set((view.width - text.width) / 2, (view.height - text.height) / 2)
    this.addChild(view)
  }
}
