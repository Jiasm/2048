import GameController from './GameController'

window.debug = true
let gameController = GameController.init({
  size: 6,
  ele: document.querySelector('#game-canvas')
})

gameController.start()

// test code
window.addEventListener('keyup', ({keyCode}) => {
  switch (keyCode) {
    case 87: // 上
      gameController.move({direction: 'top'})
      break
    case 68: // 右
      gameController.move({direction: 'right'})
      break
    case 83: // 下
      gameController.move({direction: 'bottom'})
      break
    case 65: // 左
      gameController.move({direction: 'left'})
      break
  }
})
