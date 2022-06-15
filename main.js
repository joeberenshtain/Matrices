const WIDTH = 1000
const HEIGHT = 1000
var vec1 = [ -1, 0, 
             1, 4]
var n = 11
var f = 11
const UNITX = WIDTH/n   
const UNITY = HEIGHT/f
var c = document.getElementById("canvas");
c.width = WIDTH
c.height = HEIGHT
var ctx = c.getContext("2d");

function backgroundLines() {
    ctx.lineWidth = 1

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

    const OFFSETX0 = (HEIGHT*vec1[0])/(2*vec1[2])
    const OFFSETY0 = (WIDTH *vec1[2])/(2*vec1[0])
    
    const OFFSETX1 = (HEIGHT*vec1[3])/(2*vec1[1])
    const OFFSETY1 = (WIDTH *vec1[1])/(2*vec1[3])

    var V2V = 0;
    var V1V = 0;
    var V1H = 0;
    var V2H = 0;
    if (vec1[0]*vec1[3] - vec1[1]*vec1[2] !== 0) {
        V2V = (vec1[2] - vec1[3]*vec1[0]/vec1[1])*UNITY
        V1V = (vec1[3] - vec1[2]*vec1[1]/vec1[0])*UNITY
        V1H = (vec1[1] - vec1[0]*vec1[3]/vec1[2])*UNITX
        V2H = (vec1[0] - vec1[1]*vec1[2]/vec1[3])*UNITX
    }
    console.log(V2V/UNITX, V1V/UNITX)
    ctx.lineWidth = 4

    ctx.strokeStyle = "#AA00aa" //PURPLE
    ctx.beginPath()
    for (let i = -10; i < n+10; i++) {
        if (UNITY !== Infinity && UNITY !== -Infinity && V1H !== Infinity && V1H !== -Infinity) {   
            console.log("UNIT: ", V1H/UNITY )
            ctx.strokeStyle = "#FFFF00" //PURPLE
            
            ctx.moveTo(WIDTH/2 + OFFSETX0 + i*V1H, 0)
            ctx.lineTo(WIDTH/2 - OFFSETX0 + i*V1H, HEIGHT)
        }// DOWN
        else {
            console.log("V1V", V1V)
            ctx.moveTo(0,     HEIGHT/2 + OFFSETY0 + i*V1V)
            ctx.lineTo(WIDTH, HEIGHT/2 - OFFSETY0 + i*V1V)
        } // LEFT
    } // Creates Vertical lines.
    ctx.stroke()

    ctx.strokeStyle = "#00FFF0"
    ctx.beginPath()
    
    for (let i = -10; i < f+10; i++) {
        console.log(" : ", V2V/UNITY)
        if (UNITY !== Infinity && UNITY !== -Infinity && V2V !== Infinity && V2V !== -Infinity) {   
            console.log(V2V)
            ctx.moveTo(0,     HEIGHT/2 + OFFSETX1 + i*V2V)
            ctx.lineTo(WIDTH, HEIGHT/2 - OFFSETX1 + i*V2V)
        }
        else {
            console.log(":N",WIDTH/2 + OFFSETY1 + i*V2H)  
            ctx.moveTo(WIDTH/2 + OFFSETY1 + i*V2H, 0)
            ctx.lineTo(WIDTH/2 - OFFSETY1 + i*V2H,           HEIGHT)
        }
    } // Creates Second Vector Lines.
    
    ctx.stroke()
}
function axis() {
    ctx.lineWidth = 8
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
    ctx.lineTo(WIDTH/2 + vec1[0]*UNITX, HEIGHT/2 - vec1[2]*UNITY)
    ctx.stroke()

    ctx.strokeStyle = "#FF0000"
    ctx.beginPath()
    ctx.moveTo(WIDTH/2, HEIGHT/2)
    ctx.lineTo(WIDTH/2 + vec1[1]*UNITX, HEIGHT/2 - vec1[3]*UNITY)
    ctx.stroke()
}
function matrixMultiply(vector) {

}
ctx.lineWidth = 1
ctx.stroke();
backgroundLines()
axis()
transformLines()
vectors()