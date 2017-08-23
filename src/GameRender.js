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
    this.fontSize = this.itemWidth

    log(`
      itemWidth: ${this.itemWidth}
      itemHeight: ${this.itemHeight}
    `)
  }
  async render ({
    matrix
  }) {
    let {
      $canvas,
      context,
      beforeMatrix, // 上次渲染时的矩阵
      gap,
      itemWidth,
      itemHeight,
      fontSize
    } = this

    let {
      width,
      height
    } = $canvas

    let animationPath = buildAnimationPath({beforeMatrix, matrix})

    let count = 0
    let maxKeyLength = 12

    await new Promise((resolve) => {
      let animate = () => {
        // render layout

        let percent = (count / maxKeyLength)

        context.fillStyle = defaultRenderConfig.borderColor
        context.fillRect(0, 0, width, height)
        context.lineWidth = gap
        context.strokeStyle = defaultRenderConfig.borderColor
        context.strokeRect(0, 0, width, height)

        // render matrix
        // 先渲染没有动画的item
        matrix.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => {
            let x = colIndex * itemWidth + gap
            let y = rowIndex * itemHeight + gap

            let itemInfo = defaultVals[col.value]
            let animationInfo = animationPath[col.uuid]

            if (!animationInfo) {
              context.fillStyle = itemInfo.background
              context.fillRect(x, y, itemWidth, itemHeight)

              context.fillStyle = itemInfo.color

              let font = fontSize / (Math.max(String(itemInfo.label).length - 1, 2))
              context.font = `${font}px sans-serif`
              context.textAlign = 'center'
              context.textBaseline = 'middle'
              context.fillText(itemInfo.label, x + itemWidth / 2, y + itemHeight / 2)

              context.strokeStyle = defaultRenderConfig.borderColor
              context.strokeRect(x, y, itemWidth, itemHeight)
            }
          })
        })

        // 然后对有动画的item进行渲染
        // 动画也要分开处理。。先处理移动的动画，然后处理新增的动画

        matrix.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => {
            let x = colIndex * itemWidth + gap
            let y = rowIndex * itemHeight + gap

            let itemInfo = defaultVals[col.value]
            let animationInfo = animationPath[col.uuid]

            if (!animationInfo) {
              return
            } else if (animationInfo.type === 'move') {
              let localX = x
              let localY = y
              context.fillStyle = itemInfo.background
              context.fillRect(localX, localY, itemWidth, itemHeight)

              context.fillStyle = itemInfo.color

              let font = fontSize / (Math.max(String(itemInfo.label).length - 1, 2))
              context.font = `${font}px sans-serif`
              context.textAlign = 'center'
              context.textBaseline = 'middle'
              context.fillText(itemInfo.label, localX + itemWidth / 2, localY + itemHeight / 2)

              context.strokeStyle = defaultRenderConfig.borderColor
              context.strokeRect(localX, localY, itemWidth, itemHeight)
            }
          })
        })
        let localItemWidth = itemWidth * percent
        let localItemHeight = itemHeight * percent
        matrix.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => {
            let x = colIndex * itemWidth + gap
            let y = rowIndex * itemHeight + gap

            let itemInfo = defaultVals[col.value]
            let animationInfo = animationPath[col.uuid]

            if (!animationInfo) {
              return
            } else if (animationInfo.type === 'new') {
              let localX = x + itemWidth / 2 - itemWidth / 2 * percent
              let localY = y + itemHeight / 2 - itemHeight / 2 * percent
              context.fillStyle = itemInfo.background
              context.fillRect(localX, localY, localItemWidth, localItemHeight)

              context.fillStyle = itemInfo.color

              let font = fontSize / (Math.max(String(itemInfo.label).length - 1, 2))
              context.font = `${font * percent}px sans-serif`
              context.textAlign = 'center'
              context.textBaseline = 'middle'
              context.fillText(itemInfo.label, localX + localItemWidth / 2, localY + localItemHeight / 2)

              context.strokeStyle = defaultRenderConfig.borderColor
              context.strokeRect(localX, localY, localItemWidth, localItemHeight)
            }
          })
        })

        if (count++ >= maxKeyLength) resolve()
        else requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
    })

    this.beforeMatrix = matrix
  }
}

/**
 * 根据两次矩阵对比结果，生成动画轨迹
 * @param  {Array}  matrix       目前的矩阵数据
 * @param  {Array}  beforeMatrix 上一次的矩阵数据
 * @return {Object}              生成后的以矩阵item`uuid`为key的JSON数据格式
 */
function buildAnimationPath ({
  matrix,
  beforeMatrix
}) {
  let result = {}
  // 说明为第一次
  // 所有在matrix中匹配到的值都将塞一个new进去，表示是新出现的item
  if (!beforeMatrix) {
    matrix.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col && col.uuid) {
          result[col.uuid] = {
            type: 'new'
          }
        }
      })
    })
  } else {
    let beforeMatrixPath = buildLocationMap(beforeMatrix)
    let beforeMatrixPathUuidList = Object.keys(beforeMatrixPath)
    let matrixPath = buildLocationMap(matrix)

    Object.entries(matrixPath).forEach(([uuid, item]) => {
      // 说明是一个新的item
      if (!beforeMatrixPathUuidList.includes(uuid)) {
        result[uuid] = {
          type: 'new'
        }
        // 说明是通过合并生成的
        // 需要进行额外的处理
        if (item.cursor && item.merge) {
          result[item.cursor] = {
            type: 'move',
            rowIndex: item.rowIndex,
            colIndex: item.colIndex
          }
          result[item.merge] = {
            type: 'move',
            rowIndex: item.rowIndex,
            colIndex: item.colIndex
          }
        }
      } else {
        result[uuid] = {
          type: 'move',
          rowIndex: item.rowIndex,
          colIndex: item.colIndex
        }
      }
    })
  }

  return result
}

function buildLocationMap (matrix) {
  let result = {}
  matrix.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (col && col.uuid) {
        result[col.uuid] = {
          rowIndex,
          colIndex,
          cursor: col.cursor,
          merge: col.merge
        }
      }
    })
  })

  return result
}
