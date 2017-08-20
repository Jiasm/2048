((win) => {
  let {
    GAME
  } = win

  win.debug = true
  let game = new GAME(document.querySelector('#game-canvas'), {
    size: 4
  })

  game.start()
})(window)
