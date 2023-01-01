// Aesthetics:
const BACKGROUND_COLOUR = "black"; // Background Colour

const AXIS_LINES_WIDTH = 2;
const AXIS_LINES_COLOR = "#fff"; // The colour of the modified background colours. 

const TRANSFORMED_LINES_WIDTH = 1;
const TRANSFORMED_LINES_COLOR = "#aaa";

const BACKGROUND_LINES_WIDTH = 2;
const BACKGROUND_LINES_COLOR = "#777"; // The Colour of the default background lines.

const LINE_COUNT = 20;
// ----------------------------------


const WIDTH = 1000;
const HEIGHT = 1000;

const grids_x = 21;
const grids_y = 21;

var originalMatrix, newMatrix, deltaA, deltaB, deltaC, deltaD, running, animationLoop, memVector;
var interpolatedMatrix = new Array(4);
var interpolatedVector = new Array(2);
var currentFrame = 0;

const maxFrameCount = 50;

const grid_x_width = WIDTH/grids_x; 
const grid_y_width = HEIGHT/grids_y;

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
c.width = WIDTH;
c.height = HEIGHT;


function backgroundLines() {
    ctx.lineWidth   = BACKGROUND_LINES_WIDTH;
    ctx.strokeStyle = BACKGROUND_LINES_COLOR;
    ctx.beginPath();
    
    for (let i = 0; i < grids_x; i++) {
        ctx.moveTo(i*grid_x_width+WIDTH/(2*grids_x), 0);
        ctx.lineTo(i*grid_x_width+WIDTH/(2*grids_x), HEIGHT);
    } // Creates Vertical lines.
    for (let i = 0; i < grids_y; i++) {
        ctx.moveTo(0,     i*grid_y_width+HEIGHT/(2*grids_y))
        ctx.lineTo(WIDTH, i*grid_y_width+HEIGHT/(2*grids_y))
    } // Creates horizontal lines.
   
    ctx.stroke()
}
function transformLines() {
    c.lineWidth = TRANSFORMED_LINES_WIDTH;
    const OFFSETX0 = (HEIGHT*interpolatedMatrix[0])/(2*interpolatedMatrix[2]); // the gradient of the first vector making up the array.
    const OFFSETY0 = (WIDTH *interpolatedMatrix[2])/(2*interpolatedMatrix[0]); // this is the gradient of y based on width instead so that when it is infinite (perpendicular to x axis)
    
    const OFFSETX1 = (HEIGHT*interpolatedMatrix[3])/(2*interpolatedMatrix[1])
    const OFFSETY1 = (WIDTH *interpolatedMatrix[1])/(2*interpolatedMatrix[3])

    var V2V = 0;
    var V1V = 0;
    var V1H = 0;
    var V2H = 0; // what does this do? i forgot so do not touch until you figure it out
    if (interpolatedMatrix[0]*interpolatedMatrix[3] - interpolatedMatrix[1]*interpolatedMatrix[2] !== 0) {
        V2V = (interpolatedMatrix[2] - interpolatedMatrix[3]*interpolatedMatrix[0]/interpolatedMatrix[1])*grid_y_width
        V1V = (interpolatedMatrix[3] - interpolatedMatrix[2]*interpolatedMatrix[1]/interpolatedMatrix[0])*grid_y_width
        V1H = (interpolatedMatrix[1] - interpolatedMatrix[0]*interpolatedMatrix[3]/interpolatedMatrix[2])*grid_x_width
        V2H = (interpolatedMatrix[0] - interpolatedMatrix[1]*interpolatedMatrix[2]/interpolatedMatrix[3])*grid_x_width
    }

    ctx.lineWidth = TRANSFORMED_LINES_WIDTH;

    ctx.strokeStyle = TRANSFORMED_LINES_COLOR
    ctx.beginPath()
    for (let i = -LINE_COUNT; i < grids_x+LINE_COUNT; i++) {
        if (grid_y_width !== Infinity && grid_y_width !== -Infinity && V1H !== Infinity && V1H !== -Infinity) {   
            
            ctx.moveTo(WIDTH/2 + OFFSETX0 + i*V1H, 0)
            ctx.lineTo(WIDTH/2 - OFFSETX0 + i*V1H, HEIGHT)
        }// DOWN
        else {
            ctx.moveTo(0,     HEIGHT/2 + OFFSETY0 + i*V1V)
            ctx.lineTo(WIDTH, HEIGHT/2 - OFFSETY0 + i*V1V)
        } // LEFT
    } // Creates Vertical lines.    
    for (let i = -LINE_COUNT; i < grids_y+LINE_COUNT; i++) {
        if (grid_y_width !== Infinity && grid_y_width !== -Infinity && V2V !== Infinity && V2V !== -Infinity) {   
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
    ctx.lineWidth   = AXIS_LINES_WIDTH;
    ctx.strokeStyle = AXIS_LINES_COLOR;
    ctx.beginPath()
    ctx.moveTo(WIDTH/2, 0)
    ctx.lineTo(WIDTH/2, HEIGHT)
    ctx.moveTo(0, HEIGHT/2)
    ctx.lineTo(WIDTH, HEIGHT/2)
    ctx.stroke()
}
function vectors() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#00FF00";

    ctx.beginPath()
    ctx.moveTo(WIDTH/2, HEIGHT/2)
    ctx.lineTo(WIDTH/2 + interpolatedMatrix[0]*grid_x_width, HEIGHT/2 - interpolatedMatrix[2]*grid_y_width)
    ctx.stroke()

    ctx.strokeStyle = "#FF0000"
    ctx.beginPath()
    ctx.moveTo(WIDTH/2, HEIGHT/2)
    ctx.lineTo(WIDTH/2 + interpolatedMatrix[1]*grid_x_width, HEIGHT/2 - interpolatedMatrix[3]*grid_y_width)
    ctx.stroke()
}
function determinant() {
    let path = new Path2D()
    path.moveTo(WIDTH/2, HEIGHT/2)
    path.lineTo(WIDTH/2 + interpolatedMatrix[0]*grid_x_width, HEIGHT/2 - interpolatedMatrix[2]*grid_y_width)
    path.lineTo(WIDTH/2 + (interpolatedMatrix[0] + interpolatedMatrix[1])*grid_x_width , HEIGHT/2 - (interpolatedMatrix[2] + interpolatedMatrix[3])*grid_y_width)
    path.lineTo(WIDTH/2 + interpolatedMatrix[1]*grid_x_width, HEIGHT/2 - interpolatedMatrix[3]*grid_y_width)
    path.closePath()
    ctx.fillStyle = "#ff7ae1 "
    ctx.globalAlpha = 0.5;
    ctx.fill(path);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff"
}
function vector() {
    ctx.lineWidth = 4;  
    ctx.strokeStyle = "#002277";

    ctx.beginPath();
    ctx.moveTo(WIDTH/2 + memVector[0]*grid_x_width - 10, HEIGHT/2 - memVector[1]*grid_y_width- 10);
    ctx.lineTo(WIDTH/2 + memVector[0]*grid_x_width + 10, HEIGHT/2 - memVector[1]*grid_y_width + 10);
    
    ctx.moveTo(WIDTH/2 + memVector[0]*grid_x_width + 10, HEIGHT/2 - memVector[1]*grid_y_width- 10);
    ctx.lineTo(WIDTH/2 + memVector[0]*grid_x_width - 10, HEIGHT/2 - memVector[1]*grid_y_width + 10);
    ctx.stroke();
    ctx.strokeStyle = "#0f0";

    ctx.beginPath();


    ctx.moveTo(WIDTH/2 + interpolatedVector[0]*grid_x_width - 10, HEIGHT/2 - interpolatedVector[1]*grid_y_width- 10);
    ctx.lineTo(WIDTH/2 + interpolatedVector[0]*grid_x_width + 10, HEIGHT/2 - interpolatedVector[1]*grid_y_width + 10);
    
    ctx.moveTo(WIDTH/2 + interpolatedVector[0]*grid_x_width + 10, HEIGHT/2 - interpolatedVector[1]*grid_y_width- 10);
    ctx.lineTo(WIDTH/2 + interpolatedVector[0]*grid_x_width - 10, HEIGHT/2 - interpolatedVector[1]*grid_y_width + 10);
    ctx.stroke();
}
function update(frame) {
    if (frame >= maxFrameCount) {
        clearInterval(animationLoop);
        frame = maxFrameCount;
        running = false;
    }   
  
    
    interpolatedMatrix[0] = originalMatrix[0]+deltaA*frame;
    interpolatedMatrix[1] = originalMatrix[1]+deltaB*frame;
    interpolatedMatrix[2] = originalMatrix[2]+deltaC*frame;
    interpolatedMatrix[3] = originalMatrix[3]+deltaD*frame;

    interpolatedVector[0] = memVector[0]*interpolatedMatrix[0] + memVector[1]*interpolatedMatrix[1];
    interpolatedVector[1] = memVector[0]*interpolatedMatrix[2] + memVector[1]*interpolatedMatrix[3];

    ctx.fillStyle = BACKGROUND_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    backgroundLines();
    axis();
    transformLines();
    vectors();
    vector();
    
    if (det.checked) {
        determinant()
    }
    
}

function animate() {    
    if (running) return;
    running = true;

    currentFrame = 0;
    originalMatrix = newMatrix || [1, 0, 0, 1];

    newMatrix = [parseFloat(document.getElementById('0').value), parseFloat(document.getElementById('1').value), 
                 parseFloat(document.getElementById('2').value), parseFloat(document.getElementById('3').value)];
    // ^ The final matrix before the transformation.
    // 0 1
    // 2 3

    memVector = [parseFloat(document.getElementById('4').value), parseFloat(document.getElementById('5').value)];   
    maxVector = [memVector[0]*newMatrix[0] + memVector[1]*newMatrix[1], memVector[0]*newMatrix[2] + memVector[1]*newMatrix[3]]

    deltaA = (newMatrix[0]-originalMatrix[0])/maxFrameCount; // _______
    deltaB = (newMatrix[1]-originalMatrix[1])/maxFrameCount; // | A B |
    deltaC = (newMatrix[2]-originalMatrix[2])/maxFrameCount; // | C D |
    deltaD = (newMatrix[3]-originalMatrix[3])/maxFrameCount; // ͞ ͞ ͞ ͞ ͞ ͞ ͞ 

    animationLoop = setInterval(() => {update(currentFrame); currentFrame++;}, 1000/maxFrameCount);
}
document.getElementById ('up').addEventListener('click', animate);
document.getElementById('det').addEventListener('change', ()=>{});
animate();