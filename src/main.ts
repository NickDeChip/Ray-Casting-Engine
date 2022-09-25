import { Rage } from "./rage"

let rage: Rage

const width = 1024
const height = 600

const gridX = 8
const gridY = 8
const gridS = 64

const grid: number[] = [
  1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1,
]

const main = () => {
  rage = new Rage("game-canvas", width, height)
  rage.clearColor = "gray"
  requestAnimationFrame(gameLoop)
}

const player = {
  x: 40,
  y: 40,
  speed: 110,
  a: 0,
  dx: 0,
  dy: 0,
  rspeed: 110,
}


const gameLoop = () => {
  update()
  draw()
  requestAnimationFrame(gameLoop)
}


const update = () => {
  updateplayer()
}

const updateplayer = () => {
  const dt = rage.getDT()

  if (rage.isKeyDown("a")) {
    player.a += player.rspeed * dt
    player.a = clampAng(player.a)
    player.dx = Math.cos(degToRad(player.a))
    player.dy = -Math.sin(degToRad(player.a))
  }
  if (rage.isKeyDown("d")) {
    player.a -= player.rspeed * dt
    player.a = clampAng(player.a)
    player.dx = Math.cos(degToRad(player.a))
    player.dy = -Math.sin(degToRad(player.a))
  }
  if (rage.isKeyDown("w")) {
    player.x += player.dx * player.speed * dt
    player.y += player.dy * player.speed * dt
  }
  if (rage.isKeyDown("s")) {
    player.x -= player.dx * player.speed * dt
    player.y -= player.dy * player.speed * dt
  }
}


const draw = () => {
  rage.clearScreen()

  drawGrid()
  drawPlayer()
  drawRays()

  rage.showFPS(0, 0)
}

const drawPlayer = () => {
  rage.drawRect(player.x - 5, player.y - 5, 10, 10, "yellow")
  rage.drawLine(player.x, player.y, player.x + 55 * Math.cos(degToRad(player.a)), player.y + 55 * -Math.sin(degToRad(player.a)), 1, "yellow")
}

const dist = (ax: number, ay: number, bx: number, by: number, ang: number): number => {
  return Math.cos(degToRad(ang)) * (bx - ax) - Math.sin(degToRad(ang)) * (by - ay)
}

const drawRays = () => {
  let ry = 0
  let rx = 0
  let yo = 0
  let xo = 0
  let dof = 0
  let gx = 0
  let gy = 0
  let gp = 0
  let disH = 0
  let disV = 0
  let vx = 0
  let vy = 0
  let ra = clampAng(player.a + 30)
  for (let r = 0; r < 60; r++) { // looking up
    //Vertical
    dof = 0
    disV = 100000
    let aTan = Math.tan(degToRad(ra))
    if (Math.cos(degToRad(ra)) > 0.001) { // looking left
      rx = ((player.x >> 6) << 6) + 64
      ry = (player.x - rx) * aTan + player.y
      xo = 64
      yo = -xo * aTan
    }
    else if (Math.cos(degToRad(ra)) < -0.001) { // looking right
      rx = ((player.x >> 6) << 6) - 0.0001
      ry = (player.x - rx) * aTan + player.y
      xo = -64
      yo = -xo * aTan
    }
    else { // looking direct up or down
      rx = player.x
      ry = player.y
      dof = 8
    }

    while (dof < 8) {
      gx = rx >> 6
      gy = ry >> 6
      gp = gy * gridX + gx
      if (gp > 0 && gp < gridX * gridY && grid[gp] === 1) {
        dof = 8
        disV = dist(player.x, player.y, rx, ry, ra)
      }
      else {
        rx += xo
        ry += yo
        dof += 1
      }
    }

    vx = rx
    vy = ry
    //rage.drawLine(player.x, player.y, vx, vy, 5, "red")


    // Horizontal
    dof = 0
    aTan = 1 / Math.tan(degToRad(ra))
    disH = 100000
    if (Math.sin(degToRad(ra)) > 0.001) {
      ry = ((player.y >> 6) << 6) - 0.0001
      rx = (player.y - ry) * aTan + player.x
      yo = -64
      xo = -yo * aTan
    }
    else if (Math.sin(degToRad(ra)) < -0.001) { // looking down
      ry = ((player.y >> 6) << 6) + 64
      rx = (player.y - ry) * aTan + player.x
      yo = 64
      xo = -yo * aTan
    }
    else { //looking direct left or right
      rx = player.x
      ry = player.y
      dof = 8
    }

    while (dof < 8) {
      gx = rx >> 6
      gy = ry >> 6
      gp = gy * gridX + gx
      if (gp > 0 && gp < gridX * gridY && grid[gp] === 1) { // hit wall
        dof = 8
        disH = dist(player.x, player.y, rx, ry, ra)
      } else {
        rx += xo
        ry += yo
        dof += 1
      }
    }

    let color = "#FFF"
    if (disV < disH) {
      rx = vx
      ry = vy
      disH = disV
      color = "#DDD"
    }

    rage.drawLine(player.x, player.y, rx, ry, 2, "red")


    const ca = clampAng(player.a - ra)
    disH = disH * Math.cos(degToRad(ca))
    let lineH = (gridS * 320) / (disH)
    if (lineH > 320) {
      lineH = 320
    }
    const lineOff = 160 - (lineH >> 1)

    rage.drawLine(r * 8 + 530, lineOff, r * 8 + 530, lineOff + lineH, 8, color)

    ra = clampAng(ra - 1)

  }
}

const drawGrid = () => {
  for (let y = 0; y < gridY; y++) {
    for (let x = 0; x < gridX; x++) {
      const color = grid[y * gridX + x] === 1 ? "white" : "black"
      const xo = x * gridS
      const yo = y * gridS
      rage.drawRect(xo + 1, yo + 1, gridS - 1, gridS - 1, color)
    }
  }
}

const clampAng = (a: number) => {
  if (a > 359) a -= 360
  if (a < 0) a += 360
  return a
}

const degToRad = (a: number) => {
  return a * Math.PI / 180.0
}

document.addEventListener("DOMContentLoaded", main)
