import { ButtonOptions, FancyButton } from '@pixi/ui'
import { Graphics } from 'pixi.js'

import { FancyText } from 'ui/FancyText'

export class GhostButton extends FancyButton {
  constructor(text: FancyText, options?: ButtonOptions) {
    super(options)

    const padding = options?.padding ?? 4
    const view = new Graphics().rect(0, 0, text.width + padding, text.height + padding).fill(0xffffff)

    text.position.set((view.width - text.width) / 2, (view.height - text.height) / 2)
    this.addChild(view)
    this.addChild(text)
  }
}
