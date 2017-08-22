import Base from './Base'
import Game from './Game'
import GameRender from './GameRender'
import {defaultConfig} from './Config'

export default class GameController extends Base {
  constructor ({ele, size = defaultConfig.size}) {
    super()

    this.size = size
    this.ele = ele

    this.game = new Game({size})
    this.gameRender = new GameRender({ele})
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
