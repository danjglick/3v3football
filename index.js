const PLAYER_RADIUS = visualViewport.width / 15
const BALL_RADIUS = visualViewport.width / 30
const PIXEL_SHIM = BALL_RADIUS
const USER_COLOR = "CornflowerBlue"
const ENEMY_COLOR = "Yellow"
let canvas
let context
let offense = {
  qb: {
    xPos: visualViewport.width / 2,
    yPos: visualViewport.height * (2 / 3),
    radius: PLAYER_RADIUS,
    color: USER_COLOR
  },
  wr1: {
    xPos: visualViewport.width / 4,
    yPos: visualViewport.height * (2 / 3),
    radius: PLAYER_RADIUS,
    color: USER_COLOR
  },
  wr2: {
    xPos: visualViewport.width * (3 / 4),
    yPos: visualViewport.height * (2 / 3),
    radius: PLAYER_RADIUS,
    color: USER_COLOR
  }
}
let defense = {
  dl: {
    xPos: visualViewport.width / 2,
    yPos: visualViewport.height * (1 / 2),
    radius: PLAYER_RADIUS,
    color: ENEMY_COLOR
  },
  lb: {
    xPos: visualViewport.width / 2,
    yPos: visualViewport.height * (1 / 3),
    radius: PLAYER_RADIUS,
    color: ENEMY_COLOR
  },
  s: {
    xPos: visualViewport.width / 2,
    yPos: visualViewport.height * (1 / 6),
    radius: PLAYER_RADIUS,
    color: ENEMY_COLOR
  }
}
let players = Object.values({ ...offense, ...defense })
let ball = {
  xPos: offense.qb.xPos,
  yPos: offense.qb.yPos,
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
let isMovingLb = false
let onOffense = true

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
    moveReceivers()
    if (isClose(ball, offense.wr1)) {
      handleCatch()
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
  if (onOffense) {
    if (isClose(touch, offense.wr1)) {
      isSendingWr1 = true
    } else if (isClose(touch, offense.qb)) {
      isMovingQb = true
    }
  } else {
    if (isClose(touch, defense.lb)) {
      isMovingLb = true
    }
  }
}

function handleTouchmove(e) {
  e.preventDefault()
  let touch = {
    xPos: e.touches[0].clientX,
    yPos: e.touches[0].clientY
  }
  if (onOffense) {
    if (isSendingWr1) {
      wr1Path.push(touch)
    }
    else if (isMovingQb) {
      if (
        Object.keys(priorTouch).length > 0 &&
        (
          Math.abs(priorTouch.xPos - touch.xPos) > 10 ||
          Math.abs(priorTouch.yPos - touch.yPos) > 10
        )
      ) {
        isThrowing = true
        ball.xVelocity = touch.xPos - priorTouch.xPos
        ball.yVelocity = touch.yPos - priorTouch.yPos
      } else {
        if (isThrowing == false) {
          offense.qb.xPos = touch.xPos
          offense.qb.yPos = touch.yPos
        }
      }
      ball.xPos = touch.xPos
      ball.yPos = touch.yPos
      priorTouch = touch
    }
  } else {
    if (isMovingLb) {
      defense.lb.xPos = touch.xPos
      defense.lb.yPos = touch.yPos
    }
  }
}

function handleTouchend() {
  isSendingWr1 = false
}

/////// public /////////

function moveBall() {
  ball.xPos += ball.xVelocity
  ball.yPos += ball.yVelocity
}

function moveReceivers() {
  if (wr1Path[0]) {
    offense.wr1.xPos = wr1Path[0].xPos
    offense.wr1.yPos = wr1Path[0].yPos
    wr1Path.shift()
  }
}

function drawPlayers() {
  players.forEach(player => {
    context.beginPath()
    context.arc(player.xPos, player.yPos, player.radius, 0, 2 * Math.PI)
    context.fillStyle = player.color
    context.fill()
  })
}

function drawBall() {
  context.beginPath()
  context.arc(ball.xPos, ball.yPos, ball.radius, 0, 2 * Math.PI)
  context.fillStyle = ball.color
  context.fill()
}

function handleCatch() {
  ball.xVelocity = 0
  ball.yVelocity = 0
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
