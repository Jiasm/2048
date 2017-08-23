import Base from './Base'
import Game from './Game'
import GameRender from './GameRender'
import {defaultConfig} from './Config'
import {log} from './Utils'

export default class GameController extends Base {
  constructor ({ele, size = defaultConfig.size, win}) {
    super()

    this.size = size
    this.ele = ele

    this.game = new Game({size})
    this.gameRender = new GameRender({ele})

    // event register

    let self = this

    window.addEventListener('keyup', ({keyCode}) => {
      switch (keyCode) {
        case 87: // 上
          self.move({direction: 'top'})
          break
        case 68: // 右
          self.move({direction: 'right'})
          break
        case 83: // 下
          self.move({direction: 'bottom'})
          break
        case 65: // 左
          self.move({direction: 'left'})
          break
      }
    })

    // 如果有触屏，添加触屏支持
    if ('ontouchstart' in document) {
      let startPoint = null
      let endPoint = null
      // let operateTime

      window.addEventListener('touchstart', (e) => {
        // if (operateTime && new Date() - operateTime < 500) return

        startPoint = {
          x: e.touches[0].screenX,
          y: e.touches[0].screenY
        }
        endPoint = null
        // operateTime = new Date()
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

          let maxOffset = Math.max.apply(null, [topOffset, rightOffset, bottomOffset, leftOffset])

          // 防止误触
          if (maxOffset > 10) {
            switch (maxOffset) {
              case topOffset: // 上
                self.move({direction: 'top'})
                break
              case rightOffset: // 右
                self.move({direction: 'right'})
                break
              case bottomOffset: // 下
                self.move({direction: 'bottom'})
                break
              case leftOffset: // 左
                self.move({direction: 'left'})
                break
            }

            if (!self.canMove()) {
              log('游戏结束')
              alert('游戏结束')
            }
          }

          startPoint = null
          endPoint = null
        }
      })
    }
  }

  start () {
    let matrix = this.matrix = this.game.start()
    this.gameRender.render({matrix})
  }

  move ({direction}) {
    let matrix = this.matrix = this.game.move({direction})
    this.gameRender.render({matrix})
  }
}
