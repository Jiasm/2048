export function log (arr) {
  window.debug && console.log(JSON.stringify(arr).replace(/(],)/g, '],\n').replace(/\[|\]/g, '').replace(/,/g, '|') + '| ')
}
