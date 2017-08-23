import Base from './Base'
import {log, logMatrix} from './Utils'
import {defaultConfig, directionMap} from './Config'

export default class Game extends Base {
  constructor ({
    size = defaultConfig.size
  } = {}) {
    super()
    if (size < defaultConfig.size) throw new Error('Error', `\`size\` should be greater than ${defaultConfig.size}`)

    this.size = size
  }

  /**
   * 初始化矩阵
   * @return {Array} 矩阵数据
   * @api    public
   */
  start () {
    let {size} = this
    let matrix = this.matrix = initMatrix({
      size
    })

    return matrix
  }

  /**
   * 返回是否可以移动
   * 如果矩阵中还存在空值，表示可以移动
   * 否则意味着游戏结束
   * @return {Boolean}
   */
  canMove () {
    return getEmptyMatrixItems({
      matrix: this.matrix
    })
  }

  /**
   * 移动矩阵
   * @param  {String} direction 移动的方向
   * @return {Array} 矩阵数据
   * @api    public
   */
  move ({direction}) {
    let {matrix, canMove} = moveMatrix({
      direction: directionMap[direction],
      matrix: this.matrix
    })

    // 如果该方向的移动没有任何改变，则直接跳过
    if (!canMove) {
      log('该方向无可移动方块')
      return matrix
    }

    this.matrix = matrix = addItem2Matrix({matrix})

    logMatrix(matrix)
    return matrix
  }
}

/**
 * 初始化矩阵
 * 随机在矩阵范围内生成两个初始方块
 * @param  {Number} size 矩阵的列数 默认为4
 * @return {Array}       生成后的二维数组
 * @api    private
 */
function initMatrix ({
  size
}) {
  let matrix = new Array(size).fill(0).map(_ => new Array(size).fill(0))

  matrix = addItem2Matrix({matrix})
  matrix = addItem2Matrix({matrix})

  logMatrix(matrix)

  return matrix
}

/**
 * 朝指定方向移动
 * @param  {String} direction 移动的位置
 * @param  {Array}  matrix    矩阵数据
 * @return {Array}            移动&新增节点后的矩阵
 * @api    private
 */
function moveMatrix ({direction, matrix}) {
  let len = matrix.length
  let end = len - 1

  // 上下方向的需要将二维数组转换行和列
  if ([directionMap.top, directionMap.bottom].includes(direction)) {
    matrix = rotateMatrix({matrix})
  }

  // 上、左方向直接反排矩阵的列数据
  if ([directionMap.left, directionMap.top].includes(direction)) {
    matrix = reverseMatrix({matrix})
  }

  // 创建新的容器
  let newMatrix = new Array(len).fill(0).map(_ => new Array(len).fill(0))

  let canMove = false

  matrix.forEach((row, rowIndex) => {
    for (let colIndex = end; colIndex > 0;) {
      let item = row[colIndex]

      let beforeIndex = colIndex
      let itemBefore
      do {
        itemBefore = row[--beforeIndex]
        // 如果没有查找到有效元素并且没有迭代到行首，则会继续迭代，直到拿到一个有效元素或者迭代到行首
      } while (beforeIndex >= 0 && !itemBefore)

      beforeIndex = Math.max(0, beforeIndex)

      let range = 0

      // 当前节点为空
      if (!item) {
        // 如果往前不能查找到存在值的元素，说明这一行已经空了，直接跳过
        if (!itemBefore) {
          colIndex = 0
          continue
        } else {
          // 否则将第一个存在值的元素放到当前下标 并删除该元素原来位置-目前为止中间所有的空格
          row[colIndex] = itemBefore
          range = colIndex - beforeIndex
          row.splice(beforeIndex, range) // 删除前一个
          row = new Array(range).fill(0).concat(row)  // 将所有元素下标递增
          canMove = true
          continue
        }
      } else {
        // 当前节点存在元素&与查找到的第一个元素相等，我们需要将这两项进行相加并删除前一个元素
        if (item === itemBefore) {
          row[colIndex] = (+item + 1)
          range = colIndex - beforeIndex
          colIndex -= range
          row.splice(beforeIndex, range) // 删除前一个
          row = new Array(range).fill(0).concat(row)  // 将所有元素下标递增
          canMove = true
          continue
        }
      }

      // 其余情况则继续向前查找
      colIndex--
    }
    newMatrix[rowIndex] = row
  })

  // 左上方向需要还原反排
  if ([directionMap.left, directionMap.top].includes(direction)) {
    newMatrix = reverseMatrix({matrix: newMatrix})
  }

  // 上下方向的需要将二维数组转换行和列
  if ([directionMap.top, directionMap.bottom].includes(direction)) {
    newMatrix = rotateMatrix({matrix: newMatrix})
  }

  return {
    matrix: newMatrix,
    canMove
  }
}

/**
 * 旋转矩阵，将横竖坐标转换，应对上下合并时操作的困难，先转换为左右合并
 * @param  {Array}  matrix 矩阵数据
 * @return {Array}         转变横竖坐标后的矩阵
 * @api    private
 */
function rotateMatrix ({matrix}) {
  let size = matrix.length
  let newMatrix = new Array(size).fill(0).map(_ => new Array(size).fill(0))
  matrix.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      newMatrix[colIndex][rowIndex] = col || 0
    })
  })

  return newMatrix
}

/**
 * 将矩阵元素反排，用于合并
 * @param  {Array}  matrix 矩阵数据
 * @return {Array}         反排后的矩阵
 * @api    private
 */
function reverseMatrix ({matrix}) {
  return matrix.map(row => row.reverse())
}

/**
 * 新增一个item进入matrix
 * 函数会取出所有item为0的位置，并随机其中一个位置插入一个新的item
 * @param  {Array} matrix 矩阵数据
 * @return {Array}        新增节点后的二维数组
 * @api   private
 */
function addItem2Matrix ({matrix}) {
  let indexArr = getEmptyMatrixItems({matrix})

  if (!indexArr.length) return matrix

  let randomIndex = random(indexArr.length - 1)

  let [row, col] = indexArr[randomIndex].split('-')
  matrix[row][col] = 1

  return matrix
}

/**
 * 获取所有item为空的集合
 * @param  {Array} matrix 矩阵数据
 * @return {Array}        所有为空的矩阵下标组成的数组
 * @api    private
 */
function getEmptyMatrixItems ({matrix}) {
  let indexArr = []

  matrix.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (!col) {
        indexArr.push(`${rowIndex}-${colIndex}`)
      }
    })
  })

  return indexArr
}

/**
 * 产生一个指定范围的随机数
 * @param  {Number} range 范围
 * @return {Number}       range范围内的随机数
 * @api    private
 */
function random (range) {
  return Math.random() * range | 0
}

// 0 1 1 1 1 => 4 | found 3 | merge 3 & 4 | change cursor to 4 - (4 - 3)
// 0 0 1 1 2 => 3 | found 2 | merge 2 & 3 | change cursor to 3 - (3 - 2)
// 0 0 0 2 2 => 2 1 0 skip
//
// 0 1 0 0 1 => 4 | found 3 2 1 | merge 1 & 4 | change cursor to 4 - (4 - 1)
// 0 0 0 0 2 => 1 0 skip
//
// 0 2 0 0 1 => 4 | found 3 2 1 | change cursor to 4 - (4 - 1)
// 0 0 0 2 1 =>
//
// 这时判断到 下标 4 3 相同 将 4 设置为2
// 0 0 1 1 2
// 将下标 3 移除 并将前边的所有元素下标 +1 也就是 shift进入一个 0
// arr.splice()
//
// 0 1 0 0 1
// 这时 当前值不为0

// test code
// console.log('test game')
// window.debug = true
// let g = new Game()
// g.matrix = [
//   [0, 0, 0, 1],
//   [0, 0, 0, 1],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0]
// ]
// g.move({direction: 'bottom'})
//
// g.matrix = [
//   [1, 1, 1, 1],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0]
// ]
// g.move({direction: 'right'})
// log(g.matrix)
//
// g.matrix = [
//   [1, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0]
// ]
// g.move({direction: 'right'})
// log(g.matrix)
//
// g.matrix = [
//   [1, 0, 0, 1],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0]
// ]
// g.move({direction: 'right'})
// log(g.matrix)
//
// g.matrix = [
//   [0, 0, 0, 1],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0]
// ]
// g.move({direction: 'right'})
// log(g.matrix)
//
// g.matrix = [
//   [0, 0, 1, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0]
// ]
// g.move({direction: 'right'})
// log(g.matrix)
