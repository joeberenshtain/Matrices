const WIDTH = 1000
const HEIGHT =1000
var n = 25
var f = 25

const BACKGROUND = "#ffffff"
const BACK_LINES = "#222222"
const AXIS_LINES = "#000000"
const TRANS_LINES = "#3f75b2"

const UNITX = WIDTH/n   
const UNITY = HEIGHT/f
var c = document.getElementById("canvas");
c.width = WIDTH
c.height = HEIGHT
var ctx = c.getContext("2d");

ctx.fillStyle = BACKGROUND;

function backgroundLines() {
    ctx.lineWidth = 1
    ctx.strokeStyle = BACK_LINES
    ctx.beginPath()
    
    for (let i = 0; i < n; i++) {
        ctx.moveTo(i*UNITX+WIDTH/(2*n), 0)
        ctx.lineTo(i*UNITX+WIDTH/(2*n), HEIGHT)
    } // Creates Vertical lines.
    for (let i = 0; i < f; i++) {
        ctx.moveTo(0,     i*UNITY+HEIGHT/(2*f))
        ctx.lineTo(WIDTH, i*UNITY+HEIGHT/(2*f))
    } // Creates horizontal lines.
   
    ctx.stroke()
}
function transformLines() {

    const OFFSETX0 = (HEIGHT*matrix[0])/(2*matrix[2])
    const OFFSETY0 = (WIDTH *matrix[2])/(2*matrix[0])
    
    const OFFSETX1 = (HEIGHT*matrix[3])/(2*matrix[1])
    const OFFSETY1 = (WIDTH *matrix[1])/(2*matrix[3])

    var V2V = 0;
    var V1V = 0;
    var V1H = 0;
    var V2H = 0;
    if (matrix[0]*matrix[3] - matrix[1]*matrix[2] !== 0) {
        V2V = (matrix[2] - matrix[3]*matrix[0]/matrix[1])*UNITY
        V1V = (matrix[3] - matrix[2]*matrix[1]/matrix[0])*UNITY
        V1H = (matrix[1] - matrix[0]*matrix[3]/matrix[2])*UNITX
        V2H = (matrix[0] - matrix[1]*matrix[2]/matrix[3])*UNITX
    }

    ctx.lineWidth = 4

    ctx.strokeStyle = TRANS_LINES
    ctx.beginPath()
    for (let i = -10; i < n+10; i++) {
        if (UNITY !== Infinity && UNITY !== -Infinity && V1H !== Infinity && V1H !== -Infinity) {   
            
            ctx.moveTo(WIDTH/2 + OFFSETX0 + i*V1H, 0)
            ctx.lineTo(WIDTH/2 - OFFSETX0 + i*V1H, HEIGHT)
        }// DOWN
        else {
            ctx.moveTo(0,     HEIGHT/2 + OFFSETY0 + i*V1V)
            ctx.lineTo(WIDTH, HEIGHT/2 - OFFSETY0 + i*V1V)
        } // LEFT
    } // Creates Vertical lines.    
    for (let i = -10; i < f+10; i++) {
        if (UNITY !== Infinity && UNITY !== -Infinity && V2V !== Infinity && V2V !== -Infinity) {   
            ctx.moveTo(0,     HEIGHT/2 + OFFSETX1 + i*V2V)
            ctx.lineTo(WIDTH, HEIGHT/2 - OFFSETX1 + i*V2V)
        }
        else {
            ctx.moveTo(WIDTH/2 + OFFSETY1 + i*V2H, 0)
            ctx.lineTo(WIDTH/2 - OFFSETY1 + i*V2H,           HEIGHT)
        }
    } // Creates Second Vector Lines.
    
    ctx.stroke()
}
function axis() {
    ctx.lineWidth = 8
    ctx.strokeStyle = AXIS_LINES
    ctx.beginPath()
    ctx.moveTo(WIDTH/2, 0)
    ctx.lineTo(WIDTH/2, HEIGHT)
    ctx.moveTo(0, HEIGHT/2)
    ctx.lineTo(WIDTH, HEIGHT/2)
    ctx.stroke()
}
function vectors() {
    ctx.lineWidth = 4

    ctx.strokeStyle = "#00FF00"
    ctx.beginPath()
    ctx.moveTo(WIDTH/2, HEIGHT/2)
    ctx.lineTo(WIDTH/2 + matrix[0]*UNITX, HEIGHT/2 - matrix[2]*UNITY)
    ctx.stroke()

    ctx.strokeStyle = "#FF0000"
    ctx.beginPath()
    ctx.moveTo(WIDTH/2, HEIGHT/2)
    ctx.lineTo(WIDTH/2 + matrix[1]*UNITX, HEIGHT/2 - matrix[3]*UNITY)
    ctx.stroke()
}
function determinant() {
    let path = new Path2D()
    path.moveTo(WIDTH/2, HEIGHT/2)
    path.lineTo(WIDTH/2 + matrix[0]*UNITX, HEIGHT/2 - matrix[2]*UNITY)
    path.lineTo(WIDTH/2 + (matrix[0] + matrix[1])*UNITX , HEIGHT/2 - (matrix[2] + matrix[3])*UNITY)
    path.lineTo(WIDTH/2 + matrix[1]*UNITX, HEIGHT/2 - matrix[3]*UNITY)
    path.closePath()
    ctx.fillStyle = "#ff7ae1 "
    ctx.globalAlpha = 0.5
    ctx.fill(path);
    ctx.globalAlpha = 1
    ctx.fillStyle = "#ffffff"
}
function refresh() {
    matrix = [document.getElementById('0').value, document.getElementById('1').value, 
              document.getElementById('2').value, document.getElementById('3').value]
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    backgroundLines()
    axis()
    transformLines()
    vectors()
    if (det.checked) {
        determinant()
    }
}

const det = document.getElementById('det')
const enter = document.getElementById('enter')
function newn(e) {
    if (e.key == 'Enter') {
        refresh()
    }
}
document.getElementById('0').addEventListener('keyup',  newn)
document.getElementById('1').addEventListener('keyup',  newn)
document.getElementById('2').addEventListener('keyup',  newn)
document.getElementById('3').addEventListener('keyup',  newn)

det.addEventListener('change', refresh)
ctx.lineWidth = 1
refresh()