export function logMatrix (arr) {
  log(JSON.stringify(arr).replace(/(],)/g, '],\n').replace(/\[|\]/g, '').replace(/,/g, '|') + '| ')
}

export function log (...arg) {
  window.debug && console.log(...arg)
}
