// get canvas related references
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - $('input').outerHeight(true);

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

//Set constants
const tangentStroke = "blue";

const lineStroke = "red";

const titleFill = "black"
const titleFont = "30px Arial";
const titleText = "This is a simple demonstration showing that the tangents (" + tangentStroke + ") of 3 circles always intersect to form a line (" + lineStroke + ").";

const allLineStrokeWidth = "1";

const dotFill = "red";
const dotRadius = 10;

const circleStroke = "black";
const circleStrokeWidth = 3;

//Get slider reference constants
const slider1 = $('input')[0];
const slider2 = $('input')[1];
const slider3 = $('input')[2];

//Create circles
var circles = [];

//Circle1
circles.push({
	x: WIDTH / 2,
	y: HEIGHT / 3,
	r: slider1.value * WIDTH,
	isDragging: false,
});

//Circle2
circles.push({
	x: WIDTH / 3,
	y: HEIGHT / 1.8,
	r: slider2.value * WIDTH,
	isDragging: false,
});

//Circle3
circles.push({
	x: WIDTH / 1.3,
	y: HEIGHT / 1.8,
	r: slider3.value * WIDTH,
	isDragging: false,
});

//Drag related variables
var draging = false;
var mouseXOffset;
var mouseYOffset;

// listen for mouse events
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;
window.addEventListener('resize', myResize);

//Slider listeners
$("input").eq(0).on("input", function() {
	circles[0].r = this.value * WIDTH;
	
	draw();
});

$("input").eq(1).on("input", function() {
	circles[1].r = this.value * WIDTH;
	
	draw();
});

$("input").eq(2).on("input", function() {
	circles[2].r = this.value * WIDTH;
	
	draw();
});

draw();

function draw() {
	clear();
	
	//Draw circles
	var x1 = circles[0]['x'];
	var y1 = circles[0]['y'];
	var r1 = circles[0]['r'];
	
	var x2 = circles[1]['x'];
	var y2 = circles[1]['y'];
	var r2 = circles[1]['r'];
	
	var x3 = circles[2]['x'];
	var y3 = circles[2]['y'];
	var r3 = circles[2]['r'];
	
	drawCircle(x1, y1, r1);
	drawCircle(x2, y2, r2);
	drawCircle(x3, y3, r3);
	
	//Draw tangent lines
	var lines = [];
	var dots = [];
	
	for(var i = 0; i < 6; i++) {
		var tempX1 = (i < 4 ? x1 : x2);
		var tempY1 = (i < 4 ? y1 : y2);
		var tempR1 = (i < 4 ? r1 : r2);
		
		var tempX2 = (i < 2 ? x2 : x3);
		var tempY2 = (i < 2 ? y2 : y3);
		var tempR2 = (i < 2 ? r2 : r3);
		
		var gamma = -1 * Math.atan((tempY2 - tempY1) / (tempX2 - tempX1));
		var beta = Math.asin((tempR2 - tempR1) / Math.sqrt(Math.pow(tempX2 - tempX1, 2) + Math.pow(tempY2 - tempY1, 2)));
		
		if(tempX1 > tempX2) {
			var a = gamma + (i % 2 == 0 ? 1 : -1) * beta;
		} else {
			var a = gamma - (i % 2 == 0 ? 1 : -1) * beta;
		}
		
		var lineX1 = tempX1 + (i % 2 == 0 ? 1 : -1) * tempR1 * Math.cos((Math.PI / 2) - a);
		var lineY1 = tempY1 + (i % 2 == 0 ? 1 : -1) * tempR1 * Math.sin((Math.PI / 2) - a);
		var lineX2 = tempX2 + (i % 2 == 0 ? 1 : -1) * tempR2 * Math.cos((Math.PI / 2) - a);
		var lineY2 = tempY2 + (i % 2 == 0 ? 1 : -1) * tempR2 * Math.sin((Math.PI / 2) - a);
		var m = (lineY2 - lineY1) / (lineX2 - lineX1);
		var b = lineY1 - m * lineX1;
		
		if(i % 2 == 0) {
			dot1M = m;
			dot1B = b;
		} else {
			dot2M = m;
			dot2B = b;
			
			dotX = (dot1B - dot2B) / (dot2M - dot1M);
			dotY = dot1M * dotX + dot1B;
			
			dots.push({
				x: dotX,
				y: dotY,
			});
		}
		
		if(m > 0) {
			drawLine(0, b, WIDTH, m * WIDTH + b, tangentStroke);
			
			lines.push({
				x1: 0,
				y1: b,
				x2: WIDTH,
				y2: m * WIDTH + b,
			});
		} else if(m < 0) {
			drawLine(0, b, (-1 * b) / m, 0, tangentStroke);
			
			lines.push({
				x1: 0,
				y1: b,
				x2: (-1 * b) / m,
				y2: 0,
			});
		} else {
			drawLine(0, b, WIDTH, b, tangentStroke);
			
			lines.push({
				x1: 0,
				y1: b,
				x2: WIDTH,
				y2: b,
			});
		}
	}
	
	//Draw connecting line
	var m1 = (lines[0].y2 - lines[0].y1) / (lines[0].x2 - lines[0].x1);
	var b1 = lines[0].y1 - m1 * lines[0].x1;
	var m2 = (lines[1].y2 - lines[1].y1) / (lines[1].x2 - lines[1].x1);
	var b2 = lines[1].y1 - m2 * lines[1].x1;
	
	var x1 = (b1 - b2) / (m2 - m1);
	var y1 = m1 * x1 + b1;
	
	var m3 = (lines[2].y2 - lines[2].y1) / (lines[2].x2 - lines[2].x1);
	var b3 = lines[2].y1 - m3 * lines[2].x1;
	var m4 = (lines[3].y2 - lines[3].y1) / (lines[3].x2 - lines[3].x1);
	var b4 = lines[3].y1 - m4 * lines[3].x1;
	
	var x2 = (b3 - b4) / (m4 - m3);
	var y2 = m3 * x2 + b3;
	
	var m = (y2 - y1) / (x2 - x1);
	var b = y1 - m * x1;
	
	if(m > 0) {
		drawLine(0, b, WIDTH, m * WIDTH + b, lineStroke);
	} else if(m < 0) {
		drawLine(0, b, (-1 * b) / m, 0, lineStroke);
	} else {
		drawLine(0, b, WIDTH, b, lineStroke);
	}
	
	//Draw intersection dots
	for(var i = 0; i < dots.length; i++) {
		drawDot(dots[i].x, dots[i].y);
	}
	
	//Draw title
	drawTitle(titleText);
}

function drawLine(x1, y1, x2, y2, color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = allLineStrokeWidth;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function drawDot(x, y) {
	ctx.fillStyle = dotFill;
	ctx.beginPath();
	ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();
}

function drawCircle(x, y, r) {
	ctx.strokeStyle = circleStroke;
	ctx.lineWidth = circleStrokeWidth;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.stroke();
}

function drawTitle(text) {
	var params = {
		context: ctx,
		text: titleText,
		font: titleFont,
		fill: titleFill,
		maxWidth: WIDTH,
		alignment: "center",
		padding: 5,
		useBackground: true,
	};
	
	drawMultilineText(params);
}

// clear the canvas
function clear() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// handle mousedown events
function myDown(e){
	// tell the browser we're handling this mouse event
	e.preventDefault();
	e.stopPropagation();
	
	// get the current mouse position
	var mx = parseInt(e.clientX);
	var my = parseInt(e.clientY);
	
	// test each shape to see if mouse is inside
	draging = false;
	
	for(var i = 0; i < circles.length; i++){
		var circle = circles[i];
		
		var dx = circle.x - mx;
		var dy = circle.y - my;
		// test if the mouse is inside this circle
		if(dx * dx + dy * dy < circle.r * circle.r){
			draging = true;
			circle.isDragging = true;
			
			mouseXOffset = dx;
			mouseYOffset = dy;
			
			break;
		}
	}
}

// handle mouseup events
function myUp(e){
	// tell the browser we're handling this mouse event
	e.preventDefault();
	e.stopPropagation();
	
	// clear all the dragging flags
	draging = false;
	
	for(var i = 0;i < circles.length; i++){
		circles[i].isDragging = false;
	}
}

// handle mouse moves
function myMove(e){
	// if we're dragging anything...
	if(draging){
		// tell the browser we're handling this mouse event
		e.preventDefault();
		e.stopPropagation();
	
		// get the current mouse position
		var mx = parseInt(e.clientX);
		var my = parseInt(e.clientY);
	
		// move each rect that isDragging 
		// by the distance the mouse has moved
		// since the last mousemove
		for(var i = 0; i < circles.length; i++){
			var circle = circles[i];
			
			if(circle.isDragging){
				circle.x = mx + mouseXOffset;
				circle.y = my + mouseYOffset;
				
				break;
			}
		}
	
		// redraw the scene with the new rect positions
		draw();
	}
}

function myResize(e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - $('table').eq(0).outerHeight(true);
	
	WIDTH = canvas.width;
	HEIGHT = canvas.height;
	
	draw();
}