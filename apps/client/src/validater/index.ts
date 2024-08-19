type RecordKeys = 'one' | 'two' | 'three' //| 'four' | 'five' | 'six' | 'Choice' | '4 of a Kind' | 'Full House' | 'S. Straight' | 'L. Straight' | 'Yacht'

interface Props {
  currentTurn: {
    userID: string
  }
  currentRound: number // 12 round 
  boards: {
    userID: string
    records: {
      [key in RecordKeys]: {
        round: number
        score: number
      }
    }
    sum: number
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

  for (let p of props.boards) {
    console.log(p)
  };
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
        currentRound: 3,
        currentTurn: {
          userID: '1',
        },
        boards: [{
          userID: '1',
          sum: 7,
          records: {
            'one': {
              round: 1,
              score: 2
            },
            'two': {
              round: 2,
              score: 2
            },
            'three':{
              round: 3,
              score: 3
            }
          }
        }, 
        {
          userID: '2',
          sum: 7,
          records: {
            'one': {
              round: 1,
              score: 2
            },
            'two': {
              round: 2,
              score: 2
            },
            'three':{
              round: 3,
              score: 3
            }
          }
        }],
      }),
    )
  })
}
