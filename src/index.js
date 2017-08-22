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
let operateTime

window.addEventListener('touchstart', (e) => {
  if (operateTime && new Date() - operateTime < 500) return

  startPoint = {
    x: e.touches[0].screenX,
    y: e.touches[0].screenY
  }
  endPoint = null
  operateTime = new Date()
})

window.addEventListener('touchend', (e) => {
  endPoint = {
    x: e.changedTouches[0].screenX,
    y: e.changedTouches[0].screenY
  }

  if (startPoint && endPoint) {
    let topOffset = startPoint.y - endPoint.y
    let rightOffset = endPoint.x - startPoint.x
    let bottomOffset = endPoint.y - startPoint.y
    let leftOffset = startPoint.x - endPoint.x

    switch (Math.max.apply(null, [topOffset, rightOffset, bottomOffset, leftOffset])) {
      case topOffset: // 上
        gameController.move({direction: 'top'})
        break
      case rightOffset: // 右
        gameController.move({direction: 'right'})
        break
      case bottomOffset: // 下
        gameController.move({direction: 'bottom'})
        break
      case leftOffset: // 左
        gameController.move({direction: 'left'})
        break
    }

    startPoint = null
    endPoint = null
  }
})
