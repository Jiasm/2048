import Base from './Base'
import Game from './Game'

export default class GameController extends Base {
  constructor ({size = 4}) {
    super()

    this.size = size

    this.game = new Game({size})
  }

  start () {
    this.game.start()
  }

  move ({direction}) {
    this.game.move({direction})
  }
}
