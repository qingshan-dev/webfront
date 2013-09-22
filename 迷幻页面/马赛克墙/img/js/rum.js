var THRESHOLD = 0.1,
    FPS = 30;

var canvas, context, stageWidth, stageHeight, space, maxDist,
    mouseX = 0,
    mouseY = 0,
    point = [],
    points = [];

$(document).ready(init);
init();

function init() {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  resize();

  $(window).resize(resize);
	$(window).mousemove(function(event) {
		mouseX = event.pageX;
		mouseY = event.pageY;
	});
	
	setInterval(onEnterFrame, 1000 / FPS);
}

function resize() {
	stageWidth = $(window).width();
	stageHeight = $(window).height();
  mouseX = stageWidth * 0.5;
  mouseY = stageHeight * 0.5;
	canvas.width = stageWidth;
	canvas.height = stageHeight;
	space = Math.ceil(stageHeight / 18);
	maxDist = Math.ceil(space * 8);
	generate();
}

function generate() {
	point = [];
	
	var wd = Math.ceil(stageWidth / space);
	var ht = Math.ceil(stageHeight / space);
	var layout = [];
	
	for(var w = 0; w <= wd; w++) {
		layout[w] = [];
		
		for(var h = 0; h <= ht; h++) {
			var p = {};
			p.x = p.ox = space * w;
			p.y = p.oy = space * h;
			
			point[point.length] = p;
			
			layout[w][h] = p;
		}
	}
	
	points = [];
	
	for(var i = 0; i < layout.length-1; i++) {
		var l2 = layout[i].length-1;
		for(var i2 = 0; i2 < l2; i2++) {
			var p = {};
			p.tl = layout[i][i2];
			p.tr = layout[i][i2+1];
			p.br = layout[i+1][i2+1];
			p.bl = layout[i+1][i2];
			p.color = "#"+((1<<24)*Math.random()|0).toString(16);
			points[points.length] = p;
		}
	}
}

function onEnterFrame() {
	var j = point.length;
	while(--j > -1) {
		update(point[j]);
	}
	render();
}

function update(p) {
	var easing;
	var dx = mouseX - p.ox;
	var dy = mouseY - p.oy;
	var dist = Math.sqrt(dx * dx + dy * dy);

  if(dist == 0 || (dist > maxDist && p.x == p.ox && p.y == p.oy)) {
    return;
  }
	
	var tx;
	var ty;
	
	if(dist <= maxDist) {
		var ratio = dy / dist;
		var ang = Math.asin(ratio) * 180 / Math.PI;
		
		if(mouseX < p.ox) ang = 180 - ang;
		
		ang = 270 - ang;
		
		var sin = Math.sin(ang / 180 * Math.PI);
		var cos = Math.cos(ang / 180 * Math.PI);
		var radius = maxDist - ((maxDist / dist - 1) * 8);
		radius = Math.max(maxDist * .25, radius);
		
		tx = mouseX + (sin * radius);
		ty = mouseY + (cos * radius);
		
		easing = .35;
	}
	else {
		tx = p.ox;
		ty = p.oy;
		easing = .1;
	}
	
	if(p.x != tx) {
		var vx = (tx - p.x) * easing;
		p.x += vx;
	}
	if(p.y != ty) {
		var vy = (ty - p.y) * easing;
		p.y += vy;
	}

	if(Math.abs(p.x - tx) < THRESHOLD) {
		p.x = tx;
	}
	if(Math.abs(p.y - ty) < THRESHOLD) {
		p.y = ty;
	}
}

function render() {
	context.clearRect(0, 0, stageWidth, stageHeight);
	var i = points.length;
	while(--i > -1) {
		context.fillStyle = points[i].color;
		context.beginPath();
		context.moveTo(points[i].tl.x, points[i].tl.y);
		context.lineTo(points[i].tr.x, points[i].tr.y);
		context.lineTo(points[i].br.x, points[i].br.y);
		context.lineTo(points[i].bl.x, points[i].bl.y);
		context.lineTo(points[i].tl.x, points[i].tl.y);
		context.closePath();
		context.fill();
	}
}