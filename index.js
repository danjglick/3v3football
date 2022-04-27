let canvas
let context
let player = {
  xPos: visualViewport.width / 2,
  yPos: visualViewport.height * (2 / 3),
  radius: visualViewport.width / 10,
  color: "CornflowerBlue"
}
let ball = {
  xPos: player.xPos,
  yPos: player.yPos,
  xVelocity: 0,
  yVelocity: 0,
  radius: player.radius / 2,
  color: "Brown"
}
let isThrowing = false
let priorTouch = {}
const PIXEL_SHIM = ball.radius

//// init //////

function initializeGame() {
  canvas = document.getElementById("canvas")
  canvas.width = visualViewport.width
  canvas.height = visualViewport.height
  context = canvas.getContext('2d')
  document.addEventListener("touchmove", handleTouchmove, { passive: false })
  gameLoop()
}

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  moveBall()
  drawPlayer()
  drawBall()
  setTimeout(gameLoop, 50)
}

function handleTouchmove(e) {
  e.preventDefault()
  let touch = {
    xPos: e.touches[0].clientX,
    yPos: e.touches[0].clientY
  }
  if (!(
    Object.keys(priorTouch).length > 0 &&
    (
      Math.abs(priorTouch.xPos - touch.xPos) > 20 ||
      Math.abs(priorTouch.yPos - touch.yPos) > 20
    )
  )) {
    if (isThrowing == false) {
      player.xPos = touch.xPos
      player.yPos = touch.yPos
    }
  } else {
    isThrowing = true
    ball.xVelocity = touch.xPos - priorTouch.xPos
    ball.yVelocity = touch.yPos - priorTouch.yPos
  }
  ball.xPos = touch.xPos
  ball.yPos = touch.yPos
  priorTouch = touch
}

/////// public /////////

function drawPlayer() {
  context.beginPath()
  context.arc(player.xPos, player.yPos, player.radius, 0, 2 * Math.PI)
  context.fillStyle = player.color
  context.fill()
}

function drawBall() {
  context.beginPath()
  context.arc(ball.xPos, ball.yPos, ball.radius, 0, 2 * Math.PI)
  context.fillStyle = ball.color
  context.fill()
}

function moveBall() {
  ball.xPos += ball.xVelocity
  ball.yPos += ball.yVelocity
}

//////// private //////////

//////// generic ///////////
