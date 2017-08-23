export const defaultConfig = {
  size: 6
}

export const defaultRenderConfig = {
  gap: 4,
  borderColor: '#8f7a66'
}

export const defaultVals = [{
  background: '#ccc0b3',
  label: '',
  color: '#000'
}, {
  background: '#eee4da',
  label: 2,
  color: '#000'
}, {
  background: '#ece0c8',
  label: 4,
  color: '#000'
}, {
  background: '#f3b179',
  label: 8,
  color: '#fff'
}, {
  background: '#f59563',
  label: 16,
  color: '#fff'
}, {
  background: '#f67c5f',
  label: 32,
  color: '#fff'
}, {
  background: '#f65e3c',
  label: 64,
  color: '#fff'
}, {
  background: '#edce71',
  label: 128,
  color: '#fff'
}, {
  background: '#eccb61',
  label: 256,
  color: '#fff'
}, {
  background: '#edc750',
  label: 512,
  color: '#fff'
}, {
  background: '#edc631',
  label: 1024,
  color: '#fff'
}, {
  background: '#edc12f',
  label: 2048,
  color: '#fff'
}, {
  background: '#3c3a32',
  label: 4096,
  color: '#f9f6f2'
}, {
  background: '#3c3a32',
  label: 4096,
  color: '#f9f6f2'
}]

// 添加一些极限key。。。
// 最大可以拼到4194304 如果真的到了。。我觉得你应该是单身
new Array(10).fill(0).forEach((_, index) => {
  let last = defaultVals[defaultVals.length - 1]
  defaultVals.push(Object.assign({}, last, { label: +last.label * 2 }))
})

export const directionMap = {
  top: 'top',
  1: 'top',
  right: 'right',
  2: 'right',
  bottom: 'bottom',
  3: 'bottom',
  left: 'left',
  4: 'left'
}
