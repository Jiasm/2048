import GameController from './GameController'

window.debug = true

let $canvas = document.querySelector('#game-canvas')

let size = 6

if (location.search) {
  let matches = location.search.match(/matrixSize=(\d+)?/)

  if (matches && matches[1]) {
    size = Number(matches[1]) || 6
  }
}

let gameController = GameController.init({
  size,
  ele: $canvas,
  win: window
})

let {width, height} = getComputedStyle(document.body)

// 将canvas撑满全屏
let canvasWidth = Math.min(parseInt(width), parseInt(height))

$canvas.style.width = `${canvasWidth}px`
$canvas.style.height = `${canvasWidth}px`

gameController.start()

window.onerror = function (msg) {
  alert(msg)
}
