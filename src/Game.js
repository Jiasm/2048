import Base from './Base'
import {log} from './Utils'

export default class Game extends Base {
  constructor ({
    size = 4
  } = {}) {
    super()
    if (size < 4) throw new Error('Error', '`size` should be greater than 4')

    this.size = size
  }

  start () {
    let {size} = this
    this.matrix = initMatrix({
      size
    })
  }
}

function initMatrix ({
  size
}) {
  let matrix = new Array(size).fill(0).map(_ => new Array(size).fill(0))

  let randomRow1 = random(size)
  let randomCol1 = random(size)

  let randomRow2
  let randomCol2

  do {
    randomRow2 = random(size)
    randomCol2 = random(size)
  } while (randomRow1 === randomRow2 && randomCol1 === randomCol2)

  matrix[randomRow1][randomCol1] = 1
  matrix[randomRow2][randomCol2] = 1

  log(matrix)
}

function random (range) {
  return Math.random() * range | 0
}
