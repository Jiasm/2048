export default class Base {
  static init (...arg) {
    return new this(...arg)
  }
}
