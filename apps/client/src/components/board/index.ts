export type RecordKeys =
  | 'one'
  | 'two'
  | 'three'
  | 'four'
  | 'five'
  | 'six'
  | 'Choice'
  | '4 of a Kind'
  | 'Full House'
  | 'S. Straight'
  | 'L. Straight'
  | 'Yacht'

export interface BoardState {
  records: {
    [key in RecordKeys]: {
      round: number
      score: number
    }
  }
}

export class Board {
  public set(params: { key: RecordKeys; round: number; score: number }): void {
    this.records[params.key] = { round: params.round, score: params.score }
  }
  public getAll(): BoardState {
    return { records: this.records }
  }
  public getByKey(key: RecordKeys): BoardState['records'][RecordKeys] | undefined {
    return this.records[key]
  }

  private records = {} as BoardState['records']
}
