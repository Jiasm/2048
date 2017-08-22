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

let startPoint = null
let endPoint = null

window.addEventListener('touchstart', (e) => {
  startPoint = {
    x: e.touches[0].screenX,
    y: e.touches[0].screenY
  }
  endPoint = null
})

window.addEventListener('touchend', (e) => {
  endPoint = {
    x: e.changedTouches[0].screenX,
    y: e.changedTouches[0].screenY
  }

  if (startPoint && endPoint) {
    switch (true) {
      case startPoint.y > endPoint.y: // 上
        gameController.move({direction: 'top'})
        break
      case startPoint.x < endPoint.x: // 右
        gameController.move({direction: 'right'})
        break
      case startPoint.y < endPoint.y: // 下
        gameController.move({direction: 'bottom'})
        break
      case startPoint.x > endPoint.x: // 左
        gameController.move({direction: 'left'})
        break
    }

    startPoint = null
    endPoint = null
  }
})
