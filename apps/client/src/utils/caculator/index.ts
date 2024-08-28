import { BoardState, RecordKeys } from 'components/board'
import { DiceState } from 'components/dice'

export function isAchieveBonus(board: BoardState): boolean {
  if (
    (['One', 'Two', 'Three', 'Four', 'Five', 'Six'] as RecordKeys[])
      .map((key) => board.records[key]?.score ?? 0)
      .reduce((prev, curr) => prev + curr, 0) >= 63
  ) {
    return true
  }
  return false
}
export function getScoreOf(key: RecordKeys, dices: DiceState[]): number {
  const counts = [0, 0, 0, 0, 0, 0]
  for (const d of dices) {
    counts[d.value - 1] += 1
  }

  switch (key) {
    case 'One':
      return counts[0] * 1
    case 'Two':
      return counts[1] * 2
    case 'Three':
      return counts[2] * 3
    case 'Four':
      return counts[3] * 4
    case 'Five':
      return counts[4] * 5
    case 'Six':
      return counts[5] * 6
    case 'Choice':
      return dices.reduce((prev, dice) => prev + dice.value, 0)
    case '4 of a Kind':
      if (counts.includes(4) || counts.includes(5)) {
        return Math.max((counts.indexOf(4) + 1) * 4, (counts.indexOf(5) + 1) * 4)
      }
      return 0
    case 'S. Straight':
      for (let s = 0; s <= 2; s++) {
        if (counts.slice(s, s + 4).every((v) => v > 0)) {
          return 15
        }
      }
      return 0
    case 'L. Straight':
      for (let s = 0; s <= 1; s++) {
        if (counts.slice(s, s + 5).every((v) => v > 0)) {
          return 30
        }
      }
      return 0
    case 'Full House': {
      if (counts.includes(3) && counts.includes(2)) {
        return dices.reduce((prev, dice) => prev + dice.value, 0)
      }
      return 0
    }
    case 'Yacht':
      if (counts.includes(5)) {
        return 50
      }
      return 0
  }
}
