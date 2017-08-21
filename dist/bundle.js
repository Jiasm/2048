/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game__ = __webpack_require__(1);


window.debug = true
let game = __WEBPACK_IMPORTED_MODULE_0__Game__["a" /* default */].init({
  size: 4
})

game.start()


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Base__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils__ = __webpack_require__(4);



class Game extends __WEBPACK_IMPORTED_MODULE_0__Base__["a" /* default */] {
  constructor ({
    size = 4
  } = {}) {
    super()
    if (size < 4) throw new Error('Error', '`size` should be greater than 4')

    this.size = size
  }

  start () {
    let {size} = this
    this.matrix = initMatrix({
      size
    })
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;


function initMatrix ({
  size
}) {
  let matrix = new Array(size).fill(0).map(_ => new Array(size).fill(0))

  let randomRow1 = random(size)
  let randomCol1 = random(size)

  let randomRow2
  let randomCol2

  do {
    randomRow2 = random(size)
    randomCol2 = random(size)
  } while (randomRow1 === randomRow2 && randomCol1 === randomCol2)

  matrix[randomRow1][randomCol1] = 1
  matrix[randomRow2][randomCol2] = 1

  Object(__WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* log */])(matrix)
}

function random (range) {
  return Math.random() * range | 0
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Base {
  static init (...arg) {
    return new this(...arg)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Base;



/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = log;
function log (arr) {
  window.debug && console.log(JSON.stringify(arr).replace(/(],)/g, '],\n').replace(/\[|\]/g, '').replace(/,/g, '|') + '| ')
}


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map