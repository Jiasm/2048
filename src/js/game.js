((win) => {
  const defaultVals = [
    '2',
    '4',
    '8',
    '16',
    '32',
    '64',
    '128',
    '256',
    '512',
    '1024',
    '2048'
  ]
  const coloArr = [{
    background: '#eee4da',
    color: '#000'
  }, {
    background: '#ece0c8',
    color: '#000'
  }, {
    background: '#f3b179'
  }, {
    background: '#f59563'
  }, {
    background: '#f67c5f'
  }, {
    background: '#f65e3c'
  }, {
    background: '#edce71'
  }, {
    background: '#eccb61'
  }, {
    background: '#edc750'
  }, {
    background: '#edc631'
  }, {
    background: '#edc12f'
  }]
  class GAME {
    constructor (ele, {
      size = 4,
      vals = defaultVals
    } = {}) {
      if (size < 4) throw new Error('Error', '`size` should be greater than 4')
      this.matrix = initMatrix({
        size
      })

      this.vals = vals

      let canvas = this.canvas = ele
      this.context = canvas.getContext('2d')
    }

    start () {
      this.render()
    }

    render () {
      let {
        canvas,
        context,
        vals
      } = this

      context.lineWidth = 4
      context.strokeStyle = '#bbad9e'
      context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8)
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

  win.GAME = win.GAME || GAME

  // test log

  function log (arr) {
    win.debug && console.log(JSON.stringify(arr).replace(/(],)/g, '],\n').replace(/\[|\]/g, '').replace(/,/g, '|') + '| ')
  }
})(window)
