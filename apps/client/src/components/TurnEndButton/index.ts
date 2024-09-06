import { $Boards, BonusRecordKey, BonusScore, BonusThreshold, RecordKeyArray } from 'stores/board'
import { $Dice } from 'stores/dice'
import { $Game } from 'stores/game'
import { $TemporaryScore } from 'stores/temporary-score'
import { $Users } from 'stores/user'
import { FancyText } from 'ui/FancyText'
import { GraphicButton } from 'ui/GraphicButton'

export const TurnEndButton = new GraphicButton(
  new FancyText({
    text: '턴 종료',
    style: { fontSize: 32, fontWeight: 'bold' },
  }),
)
const onClick = () => {
  const dice = $Dice.get()
  if (dice.step === 0) return

  const current = $Game.get()
  if (current.turn === null) return

  const temporary = $TemporaryScore.get()
  if (temporary === null) return

  const currentBoard = $Boards.getAll(current.turn)
  console.log(temporary.key, temporary.score)

  $Boards.setRecord(current.turn, temporary.key, {
    round: current.round,
    score: temporary.score,
  })

  if (
    currentBoard &&
    RecordKeyArray.simple.reduce((prev, curr) => prev + (currentBoard.records[curr]?.score ?? 0), 0) >= BonusThreshold
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
}

TurnEndButton.onPress.connect(onClick)
TurnEndButton.on('touchstart', onClick)
