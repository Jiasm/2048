export function logMatrix (arr) {
  log(JSON.stringify(arr.map(row => row.map(col => col.value))).replace(/(],)/g, '],\n').replace(/\[|\]/g, '').replace(/,/g, '|') + '| ')
}

export function log (...arg) {
  window.debug && console.log(...arg)
}
