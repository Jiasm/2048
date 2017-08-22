import Base from './Base'
import {defaultConfig, defaultRenderConfig, defaultVals} from './Config'
import {log} from './Utils'

export default class GameRender extends Base {
  constructor ({ele, size, gap}) {
    super()

    this.$canvas = ele
    this.context = ele.getContext('2d')
    this.gap = gap || (gap = defaultRenderConfig.gap)
    this.size = size || (size = defaultConfig.size)

    // 计算出一个方块的宽高
    // 暂时直接除以size 后期要改为正方形的
    this.itemWidth = (ele.width - gap * 2) / size
    this.itemHeight = (ele.height - gap * 2) / size
    this.fontSize = this.itemWidth / 2

    log(`
      itemWidth: ${this.itemWidth}
      itemHeight: ${this.itemHeight}
    `)
  }
  render ({
    matrix,
    beforeMatrix
  }) {
    let {
      $canvas,
      context,
      gap,
      itemWidth,
      itemHeight,
      fontSize
    } = this

    let {
      width,
      height
    } = $canvas

    // render layout

    context.fillStyle = defaultRenderConfig.borderColor
    context.fillRect(0, 0, width, height)
    context.lineWidth = gap
    context.strokeStyle = defaultRenderConfig.borderColor
    context.strokeRect(0, 0, width, height)

    // render matrix

    matrix.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        let x = colIndex * itemWidth + gap
        let y = rowIndex * itemHeight + gap

        let itemInfo = defaultVals[col]

        context.fillStyle = itemInfo.background
        context.fillRect(x, y, itemWidth, itemHeight)

        context.fillStyle = itemInfo.color
        context.font = `${fontSize}px sans-serif`
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(itemInfo.label, x + itemWidth / 2, y + itemHeight / 2)

        context.strokeStyle = defaultRenderConfig.borderColor
        context.strokeRect(x, y, itemWidth, itemHeight)
      })
    })
  }
}
