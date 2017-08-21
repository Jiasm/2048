import Base from './Base'

export default class GameRender extends Base {
  render () {
    let {
      canvas,
      context
    } = this

    context.lineWidth = 4
    context.strokeStyle = '#bbad9e'
    context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8)
  }
}
