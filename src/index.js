import GameController from './GameController'

window.debug = true
let game = GameController.init({
  size: 16
})

game.start()

// test code
window.addEventListener('keyup', ({keyCode}) => {
  switch (keyCode) {
    case 87: // 上
      game.move({direction: 'top'})
      break
    case 68: // 右
      game.move({direction: 'right'})
      break
    case 83: // 下
      game.move({direction: 'bottom'})
      break
    case 65: // 左
      game.move({direction: 'left'})
      break
  }
})
