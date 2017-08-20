'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (win) {
  var defaultVals = ['2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'];
  var coloArr = [{
    background: '#eee4da',
    color: '#000'
  }, {
    background: '#ece0c8',
    color: '#000'
  }, {
    background: '#f3b179'
  }, {
    background: '#f59563'
  }, {
    background: '#f67c5f'
  }, {
    background: '#f65e3c'
  }, {
    background: '#edce71'
  }, {
    background: '#eccb61'
  }, {
    background: '#edc750'
  }, {
    background: '#edc631'
  }, {
    background: '#edc12f'
  }];

  var GAME = function () {
    function GAME(ele) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$size = _ref.size,
          size = _ref$size === undefined ? 4 : _ref$size,
          _ref$vals = _ref.vals,
          vals = _ref$vals === undefined ? defaultVals : _ref$vals;

      _classCallCheck(this, GAME);

      if (size < 4) throw new Error('Error', '`size` should be greater than 4');
      this.matrix = initMatrix({
        size: size
      });

      this.vals = vals;

      var canvas = this.canvas = ele;
      this.context = canvas.getContext('2d');
    }

    _createClass(GAME, [{
      key: 'start',
      value: function start() {
        this.render();
      }
    }, {
      key: 'render',
      value: function render() {
        var canvas = this.canvas,
            context = this.context,
            vals = this.vals;


        context.lineWidth = 4;
        context.strokeStyle = '#bbad9e';
        context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
      }
    }]);

    return GAME;
  }();

  function initMatrix(_ref2) {
    var size = _ref2.size;

    var matrix = new Array(size).fill(0).map(function (_) {
      return new Array(size).fill(0);
    });

    var randomRow1 = random(size);
    var randomCol1 = random(size);

    var randomRow2 = void 0;
    var randomCol2 = void 0;

    do {
      randomRow2 = random(size);
      randomCol2 = random(size);
    } while (randomRow1 === randomRow2 && randomCol1 === randomCol2);

    matrix[randomRow1][randomCol1] = 1;
    matrix[randomRow2][randomCol2] = 1;

    log(matrix);
  }

  function random(range) {
    return Math.random() * range | 0;
  }

  win.GAME = win.GAME || GAME;

  // test log

  function log(arr) {
    win.debug && console.log(JSON.stringify(arr).replace(/(],)/g, '],\n').replace(/\[|\]/g, '').replace(/,/g, '|') + '| ');
  }
})(window);
//# sourceMappingURL=game.js.map
