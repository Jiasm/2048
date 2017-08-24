import Base from './Base'
import {defaultConfig, defaultRenderConfig, defaultVals} from './Config'
import {log} from './Utils'

export default class GameRender extends Base {
  constructor ({ele, size, gap}) {
    super()

    this.$canvas = ele
    this.context = ele.getContext('2d')
    this.gap = gap || (gap = ele.width / 200)
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

  /**
   * 根据矩阵数据渲染到canvas中
   * 会自动存储上次的矩阵数据
   * 并根据数据的type来添加部分item的动画效果
   * new:  新增的item
   * move: 移动的item
   * @param  {Array}   matrix 矩阵数据
   * @return {Promise}
   * @api    public
   */
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
    let keyOffset = 6

    await new Promise((resolve) => {
      let animate = () => {
        // render layout
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

        // 12帧之前移动item 12帧之后显示item

        // 因为canvas渲染机制的问题
        // 移动的item通过beforeMatrix来，因为新增的肯定不会有移动，但是有移动的可能已经不在最新的矩阵数据了
        let movePercent = Math.min(count / (maxKeyLength - keyOffset), 1)
        beforeMatrix && beforeMatrix.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => {
            let beforeX = colIndex * itemWidth + gap
            let beforeY = rowIndex * itemHeight + gap

            let itemInfo = defaultVals[col.value]
            let animationInfo = animationPath[col.uuid]

            // 移动的item的动画是从之前的位置移动到现在的位置
            if (animationInfo && animationInfo.type === 'move') {
              // `keyOffset`帧之后隐藏已经被合并了的item
              if (count < keyOffset && !findItem({matrix: beforeMatrix, uuid: col.uuid})) return

              // 这个是还存在的item的移动
              let x = animationInfo.colIndex * itemWidth + gap
              let y = animationInfo.rowIndex * itemHeight + gap

              // 如果之前的坐标大于现在的坐标
              // 则表示为向右|向上移动 数值为递减
              // 否则为向左|向下移动 数值为递增
              let localX = beforeX > x ? beforeX - (beforeX - x) * movePercent : beforeX + (x - beforeX) * movePercent
              let localY = beforeY > y ? beforeY - (beforeY - y) * movePercent : beforeY + (y - beforeY) * movePercent

              // 之前是 0 现在是 5
              // 0 < 5
              // 0 1 2 3 4 5
              // =>
              // 5 + -5 5 + -4 5 + -3 5 + -2 5 + -1 5 + 0
              //
              // 之前是 5 现在是 0
              // 0 > 5
              // 5 4 3 2 1
              // 5 - 5 5 - 4 5 - 3 5 - 2 5 - 1 5 - 0

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

        // 接下来渲染新增的item动画
        let newPercent = (count - keyOffset) / (maxKeyLength - keyOffset)
        count >= keyOffset && matrix.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => {
            let x = colIndex * itemWidth + gap
            let y = rowIndex * itemHeight + gap

            let itemInfo = defaultVals[col.value]
            let animationInfo = animationPath[col.uuid]
            let localItemWidth = itemWidth * newPercent
            let localItemHeight = itemHeight * newPercent

            // 新增的item有一个小小的动画，就是从无到有
            // 我们先将原点移动到item的正中间。
            // 然后随着count的变化，修改x|y|width|height四个属性，完成一个显示的动画
            if (animationInfo && animationInfo.type === 'new') {
              let localX = x + itemWidth / 2 - itemWidth / 2 * newPercent
              let localY = y + itemHeight / 2 - itemHeight / 2 * newPercent
              context.fillStyle = itemInfo.background
              context.fillRect(localX, localY, localItemWidth, localItemHeight)

              context.fillStyle = itemInfo.color

              let font = fontSize / (Math.max(String(itemInfo.label).length - 1, 2))
              context.font = `${font * newPercent}px sans-serif`
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

    this.beforeMatrix = matrix.map(row => {
      return row.map(col => {
        if (col && col.cursor) {
          delete col.cursor
          delete col.merge
        }

        return col
      })
    })
  }
}

/**
 * 根据两次矩阵对比结果，生成动画轨迹
 * @param  {Array}  matrix       目前的矩阵数据
 * @param  {Array}  beforeMatrix 上一次的矩阵数据
 * @return {Object}              生成后的以矩阵item`uuid`为key的JSON数据格式
 * @api    private
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
          // let cursorItem = findItem({matrix: beforeMatrix, uuid: item.cursor})
          // let mergeItem = findItem({matrix: beforeMatrix, uuid: item.merge})
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
        let beforeItem = beforeMatrixPath[uuid]

        // 如果两次坐标一样，说明是没有动
        if (beforeItem.rowIndex === item.rowIndex && beforeItem.colIndex === item.colIndex) return
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

/**
 * 将矩阵数据转换为以uuid开头的一个JSON数据
 * @param  {Array}  matrix 矩阵数据
 * @return {Object}
 * @api    private
 */
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

/**
 * 通过UUID获取到矩阵中item的信息
 * @NOTE: 其实可以通过横纵坐标直接从矩阵中拿到这个item。。。
 * @param  {Array}  matrix 矩阵数据
 * @param  {String} uuid   唯一标识
 * @return {Object}
 * @api    private
 */
function findItem ({matrix, uuid}) {
  let item = null
  matrix.forEach(row => {
    if (item) return
    row.forEach(col => {
      if (item) return
      if (col && col.uuid === uuid) {
        item = col
      }
    })
  })

  return item
}
