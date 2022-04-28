const PLAYER_RADIUS = visualViewport.width / 10
const BALL_RADIUS = visualViewport.width / 20
const PIXEL_SHIM = BALL_RADIUS
const USER_TEAM_COLOR = "CornflowerBlue"
let canvas
let context
let players = {
  user: {
    offense: {
      qb: {
        xPos: visualViewport.width / 2,
        yPos: visualViewport.height * (2 / 3),
        radius: PLAYER_RADIUS,
        color: USER_TEAM_COLOR
      },
      wr1: {
        xPos: visualViewport.width / 4,
        yPos: visualViewport.height * (2 / 3),
        radius: PLAYER_RADIUS,
        color: USER_TEAM_COLOR
      },
      wr2: {
        xPos: visualViewport.width * (3 / 4),
        yPos: visualViewport.height * (2 / 3),
        radius: PLAYER_RADIUS,
        color: USER_TEAM_COLOR
      }
    }
  }
}
let ball = {
  xPos: players.user.offense.qb.xPos,
  yPos: players.user.offense.qb.yPos,
  xVelocity: 0,
  yVelocity: 0,
  radius: BALL_RADIUS,
  color: "Brown"
}
let priorTouch = {}
let wr1Path = []
let isSendingWr1 = false
let isMovingQb = false
let isThrowing = false

///// init //////

function initializeGame() {
  canvas = document.getElementById("canvas")
  canvas.width = visualViewport.width
  canvas.height = visualViewport.height
  context = canvas.getContext('2d')
  document.addEventListener("touchstart", handleTouchstart)
  document.addEventListener("touchmove", handleTouchmove, { passive: false })
  document.addEventListener("touchend", handleTouchend)
  gameLoop()
}

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  moveBall()
  if (isMovingQb) {
    if (wr1Path[0]) {
      players.user.offense.wr1.xPos = wr1Path[0].xPos
      players.user.offense.wr1.yPos = wr1Path[0].yPos
      wr1Path.shift()
    }
  }
  drawPlayers()
  drawBall()
  setTimeout(gameLoop, 50)
}

function handleTouchstart(e) {
  let touch = {
    xPos: e.touches[0].clientX,
    yPos: e.touches[0].clientY
  }
  if (isClose(touch, players.user.offense.wr1)) {
    isSendingWr1 = true
  } else if (isClose(touch, players.user.offense.qb)) {
    isMovingQb = true
  }
}

function handleTouchmove(e) {
  e.preventDefault()
  let touch = {
    xPos: e.touches[0].clientX,
    yPos: e.touches[0].clientY
  }
  if (isSendingWr1) {
    wr1Path.push(touch)
  }
  else if (isMovingQb) {
    if (
      Object.keys(priorTouch).length > 0 &&
      (
        Math.abs(priorTouch.xPos - touch.xPos) > 20 ||
        Math.abs(priorTouch.yPos - touch.yPos) > 20
      )
    ) {
      isThrowing = true
      ball.xVelocity = touch.xPos - priorTouch.xPos
      ball.yVelocity = touch.yPos - priorTouch.yPos
    } else {
      if (isThrowing == false) {
        players.user.offense.qb.xPos = touch.xPos
        players.user.offense.qb.yPos = touch.yPos
      }
    }
    ball.xPos = touch.xPos
    ball.yPos = touch.yPos
    priorTouch = touch
  }
}

function handleTouchend() {
  isSendingWr1 = false
}

/////// public /////////

function drawPlayers() {
  players_keys = Object.keys(players.user.offense)
  for (let i=0; i<players_keys.length; i++) {
    let player = players.user.offense[players_keys[i]]
    context.beginPath()
    context.arc(player.xPos, player.yPos, player.radius, 0, 2 * Math.PI)
    context.fillStyle = player.color
    context.fill()
  }
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

function getDistance(objectA, objectB) {
  return (
    (
      Math.abs(objectA.xPos - objectB.xPos) ** 2 +
      Math.abs(objectA.yPos - objectB.yPos) ** 2
    )
    ** 0.5
  )
}

function isClose(objectA, objectB) {
  return getDistance(objectA, objectB) < PIXEL_SHIM * 2
}
