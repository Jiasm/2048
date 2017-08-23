import GameController from './GameController'

window.debug = true
let gameController = GameController.init({
  size: 6,
  ele: document.querySelector('#game-canvas'),
  win: window
})

gameController.start()
