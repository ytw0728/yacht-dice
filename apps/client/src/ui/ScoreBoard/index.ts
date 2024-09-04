import { FancyButton } from '@pixi/ui'
import Table from 'pixi-table-layout'
import { Container, Graphics } from 'pixi.js'

import { BoardState, BonusThreshold, RecordKeyArray, RecordKeys } from 'components/board'
import { DiceState } from 'components/dice'
import { $TemporaryScore } from 'components/temporary-score'
import { UserState } from 'components/user'
import { FancyText } from 'ui/FancyText'
import { getScoreOf } from 'utils/caculator'

export class ScoreBoard extends Container {
  public render(): void {
    const wrapper = new Graphics().roundRect(0, 0, 120, 315, 4).fill(0xffffff).stroke({ color: 0x000000, width: 2 })

    const table = new Table()
    table
      .row(20)
      .cell()
      .element(
        new FancyText({
          text: this.user.info.nickname,
          style: {
            fontSize: 8,
            fontWeight: 'bold',
          },
        }),
        'shrink',
      )

    const subtotal = RecordKeyArray.simple.reduce((prev, curr) => prev + (this.board.records[curr]?.score ?? 0), 0)
    const total =
      Object.values(this.board.records).reduce((prev, curr) => prev + curr.score, 0) +
      (subtotal >= BonusThreshold ? 35 : 0)

    const dices = this.diceInfo?.dices ?? []
    const step = this.diceInfo?.step ?? 0

    const tempScores =
      step > 0 && (dices.length ?? 0 > 0)
        ? [...RecordKeyArray.simple, ...RecordKeyArray.combination].reduce(
            (prev, key) => {
              const score = getScoreOf(key, dices ?? [])
              return { ...prev, [key]: score }
            },
            {} as Record<RecordKeys, number | undefined>,
          )
        : ({} as Record<RecordKeys, number | undefined>)

    const selected = $TemporaryScore.get()?.key

    const drawRecord = (key: RecordKeys): void => {
      const value = this.board.records[key]?.score.toString()
      const element = value
        ? new FancyText({ text: value, style: { fontWeight: 'bold' } })
        : tempScores[key] !== undefined
          ? (() => {
              const text = new FancyText({
                text: tempScores[key],
                style: { fill: selected === key ? 0x333333 : 0xcccccc },
              })
              const button = new FancyButton({ textOffset: { x: text.width / 2, y: text.height / 2 } })

              button.addChild(text)
              button.on('click', () => {
                $TemporaryScore.set({
                  key,
                  score: tempScores[key] ?? 0,
                })
              })
              return button
            })()
          : new FancyText({ text: value })
      table
        .row(20)
        .cell()
        .element(new FancyText({ text: key, style: { fontWeight: 'bold' } }), 'shrink')
        .cell()
        .element(element)
    }

    RecordKeyArray.simple.forEach(drawRecord)
    table
      .row(30)
      .cell()
      .element(
        new FancyText({
          text: `+35 Bonus \n(${subtotal} / ${BonusThreshold})`,
          style: { fontWeight: 'bold', fill: subtotal >= BonusThreshold ? 0x0699fb : 0x888888 },
        }),
        'shrink',
      )

    RecordKeyArray.combination.forEach(drawRecord)
    table
      .row(20)
      .cell()
      .element(new FancyText({ text: `총 점수 : ${total}`, style: { fontSize: 8, fontWeight: 'bold' } }), 'shrink')

    // NOTE: resize에 update 로직이 포함되어 있어, 데이터구조 지정 후 setSize를 호출해야 함
    table.setSize(120, 200)
    // table.debug = process.env.NODE_ENV === 'development'
    wrapper.addChild(table)
    this.addChild(wrapper)
  }

  public setBoard(board: BoardState): void {
    this.board = board
    this.render()
  }

  public setDice(diceInfo: { dices: DiceState[]; step: number } | null): void {
    this.diceInfo = diceInfo
    this.render()
  }

  public get id(): string {
    return this.user.info.id
  }

  public get nickname(): string {
    return this.user.info.nickname
  }

  constructor(user: UserState, board: BoardState) {
    super()
    this.user = user
    this.board = board
    this.diceInfo = null

    this.render()
  }

  private readonly user: UserState
  private board: BoardState
  private diceInfo: { dices: DiceState[]; step: number } | null
}
