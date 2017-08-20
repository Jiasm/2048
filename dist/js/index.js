'use strict';

(function (win) {
  var GAME = win.GAME;


  win.debug = true;
  var game = new GAME(document.querySelector('#game-canvas'), {
    size: 4
  });

  game.start();
})(window);
//# sourceMappingURL=index.js.map
