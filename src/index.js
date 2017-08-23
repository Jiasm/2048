import GameController from './GameController'

window.debug = true

let $canvas = document.querySelector('#game-canvas')

let gameController = GameController.init({
  size: 6,
  ele: $canvas,
  win: window
})

let {width, height} = getComputedStyle(document.body)

let canvasWidth = Math.min(parseInt(width), parseInt(height))

console.log(canvasWidth)

$canvas.style.width = `${canvasWidth}px`
$canvas.style.height = `${canvasWidth}px`

gameController.start()
