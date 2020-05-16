var canvasBottom = document.getElementById('canvasBottom');
var canvasTop = document.getElementById('canvasTop');
var canvasBg = document.getElementById('canvasBg');
// var canvasParent = document.getElementById('canvasParent');
var canvasAgent = document.getElementById('canvasAgent');



canvasBottom.width = window.innerWidth;
canvasBottom.height = window.innerHeight;
canvasTop.width = window.innerWidth;
canvasTop.height = window.innerHeight;
canvasBg.width = window.innerWidth;
canvasBg.height = window.innerHeight;
canvasAgent.width = window.innerWidth;
canvasAgent.height = window.innerHeight;

var ctxBottom = canvasBottom.getContext('2d');
var ctxTop = canvasTop.getContext('2d');
var ctxBg = canvasBg.getContext('2d');
var ctxAgent = canvasAgent.getContext('2d');

// setting background context to black color
ctxBg.beginPath();
ctxBg.rect(0, 0, canvasBg.width, canvasBg.height);
ctxBg.fillStyle = 'black';
ctxBg.fill();

var isDragging = false;
var isMouseDown = false;
var pixels;

function paint(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 100, 0, 2*Math.PI);
    ctx.fillStyle = ctx.createRadialGradient(x, y, 0, x, y, 100);
    ctx.fillStyle.addColorStop(0, 'rgb(255, 255, 255, 0.05)');
    ctx.fillStyle.addColorStop(1, 'transparent');
    ctx.fill();
}

function drawBrushVis(ctx, x, y) {
    ctx.clearRect(0, 0, canvasTop.width, canvasTop.height); 
    ctx.beginPath();
    ctx.arc(x, y, 60, 0, 2*Math.PI);
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function drawCircle(ctx, x, y, rad, color) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
    

function reset() {
    ctxBottom.clearRect(0, 0, canvasTop.width, canvasTop.height);
    pixels = ctxBottom.getImageData(0, 0, canvasBottom.width, canvasBottom.height);
}

document.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        isDragging = true;
    } else isDragging = false;
});

document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
});

document.addEventListener('mouseup', (e) => {
    isMouseDown = false;
});

canvasTop.addEventListener('mousemove', e => {
    if(isDragging) {
        paint(ctxBottom, e.clientX, e.clientY);
        pixels = ctxBottom.getImageData(0, 0, canvasBottom.width, canvasBottom.height);
    }
    drawBrushVis(ctxTop, e.clientX, e.clientY);
});
