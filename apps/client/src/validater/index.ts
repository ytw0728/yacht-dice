type RecordKeys = 'one' | 'two' | 'three'
interface Props {
  currentTurn: {
    userID: string
  }
  currentRound: number
  boards: {
    userID: string
    records: {
      [key in RecordKeys]: {
        round: number
        score: number
      }
    }
  }[]
}
interface Returns {
  result: boolean
}
/**
 * props는 현재 게임의 요트 다이스 보드 정보가 전달되면,
 * return으로 승패 및 순위 등을 포함해서, 게임의 결과를 반환한다.
 */
export function validate(props: Props): Returns {
  return {
    result: true,
  }
}

export function test_validate() {
  const btn = document.createElement('button')
  btn.id = 'test_trigger'
  document.querySelector('#app')?.appendChild(btn)

  btn.addEventListener('click', () => {
    console.log(
      validate({
        currentRound: 1,
        currentTurn: {
          userID: '1',
        },
        boards: [],
      }),
    )
  })
}
