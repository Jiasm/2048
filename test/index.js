
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
console.log('test game')
window.debug = true

function log (...arg) {
  window.debug && console.log(...arg)
}

let g = new window.Game()
g.matrix = [
  [0, 0, 0, 1],
  [0, 0, 0, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]
g.move({direction: 'bottom'})

g.matrix = [
  [1, 1, 1, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]
g.move({direction: 'right'})
log(g.matrix)

g.matrix = [
  [1, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]
g.move({direction: 'right'})
log(g.matrix)

g.matrix = [
  [1, 0, 0, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]
g.move({direction: 'right'})
log(g.matrix)

g.matrix = [
  [0, 0, 0, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]
g.move({direction: 'right'})
log(g.matrix)

g.matrix = [
  [0, 0, 1, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]
g.move({direction: 'right'})
log(g.matrix)
