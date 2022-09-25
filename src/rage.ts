export class Rage {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  private width: number
  private height: number

  private previousTimeStamp = 0
  private dt = 0
  private tick = 0
  private framecount = 0
  private FPS = 0

  private keyMap = {}

  public clearColor = "black"


  constructor(canvasID: string, width: number, height: number) {
    this.canvas = document.getElementById(canvasID) as HTMLCanvasElement
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext("2d")
    this.width = width
    this.height = height

    window.addEventListener("keydown", this.handleKeyDown.bind(this), false)
    window.addEventListener("keyup", this.handleKeyUp.bind(this), false)

    this.previousTimeStamp = Date.now()
  }

  public getDT(): number {
    return this.dt
  }

  public showFPS(x: number, y: number) {
    this.drawText(x, y, "lightgreen", "FPS: " + this.FPS)
  }

  public clearScreen() {
    this.ctx.fillStyle = this.clearColor
    this.ctx.fillRect(0, 0, this.width, this.height)

    const currentTime = Date.now()
    this.dt = (currentTime - this.previousTimeStamp) / 1000
    this.previousTimeStamp = currentTime

    this.tick += this.dt
    this.framecount += 1
    if (this.tick >= 1) {
      this.FPS = this.framecount
      this.framecount = 0
      this.tick = 0
    }

  }
  public drawRect(x: number, y: number, width: number, height: number, color: string) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, width, height)
  }

  public drawText(x: number, y: number, color: string, text: string,) {
    this.ctx.font = "24px Arial"
    this.ctx.fillStyle = color
    this.ctx.fillText(text, x, y + 24)
  }

  public drawLine(x1: number, y1: number, x2: number, y2: number, width: number, color: string) {
    this.ctx.lineWidth = width
    this.ctx.strokeStyle = color
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }

  public isKeyDown(key: string): boolean {
    return this.keyMap[key] ? true : false
  }

  private handleKeyDown(ev: KeyboardEvent) {
    this.keyMap[ev.key] = true
  }

  private handleKeyUp(ev: KeyboardEvent) {
    this.keyMap[ev.key] = false
  }
}
