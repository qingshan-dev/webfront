var frame = 0;
var context;
var camera;

var friends;
var rectGroupList = [];
var renderList = [];
var rectColors = ["#e5004f", "#ea6200", "#8957a1", "#02cf02", "#ffff00", "#00b7ee"];

var addGroupTimer;
var postList = [];
var rtlist = [];
requestAnimationFrame = window.webkitRequestAnimationFrame;

function init()
{
	context = document.getElementById("canvas").getContext("2d");
	context.width = document.getElementById("canvas").width;
	context.height = document.getElementById("canvas").height;

	camera = new Camera();
	friends = new Friends();

	renderList.push(friends);
	for (var i = 0; i < 6; i++) {
        rectGroupList.push(new RectGroup(15, 60*i, rectColors[i]));
        renderList.push(rectGroupList[i]);
	};
	addGroupTimer = setInterval(addRectGroup, 400);

	tick();

	//setInterval(update, 1000);
}

function tick()
{
	requestAnimationFrame(tick);
	render();
	animate();
}


function render()
{
	this.context.clearRect(0, 0, screenWidth, screenHeight);

	renderList.sort(function(a,b){return a.center.cz < b.center.cz});

	for (var i = 0; i < renderList.length; i++) {
		renderList[i].render();
	};

	frame++;
}

var lastTime = 0;
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
		
		handleKeys(elapsed);
		camera.calcMatrix();

		for (var i = 0; i < renderList.length; i++) {
			renderList[i].calcPositions();
		};
		renderHighLightLines();
    }
    lastTime = timeNow;
}

function renderHighLightLines(){
/*
	if(highLightPoints.length == 0)
		return;
	context.save();
	context.strokeStyle = "#ff0000";
	context.fillStyle = "#ff0000";
	context.lineWidth = 2;
	if(highLightPoints[0].type == 1){
		var o = highLightPoints[0];
		context.beginPath();
		context.arc(o.rx, o.ry ,5, 0, Math.PI*2,true);
	    context.stroke();
		context.moveTo(o.rx, o.ry);
		context.lineTo(highLightPoints[1].rx, highLightPoints[1].ry);
		context.stroke();
		context.arc(highLightPoints[1].rx, highLightPoints[1].ry ,5, 0, Math.PI*2,true);
	    context.stroke();
	}else{
		context.beginPath();
		var o = highLightPoints[0];
		context.arc(o.rx, o.ry ,5, 0, Math.PI*2,true);
	    context.stroke();
		for (var i = 1; i < highLightPoints.length; i++) {
			var p = highLightPoints[i];
			context.beginPath();
			context.moveTo(o.rx, o.ry);
			context.lineTo(p.rx, p.ry);
			context.stroke();

			context.arc(p.rx, p.ry ,5, 0, Math.PI*2,true);
	        context.stroke();
		};
		context.closePath();
	}
	context.lineWidth = 1;
	context.restore();*/

	context.save();
	context.strokeStyle = "#ccffff";
	context.fillStyle = "#ccffff";
	context.lineWidth = 2;
	for (var i = 0; i < highLightPoints.length; i++) {
		var p0 = highLightPoints[i][0];
		context.beginPath();
		context.moveTo(p0.rx, p0.ry);
		for(var j = 1; j < highLightPoints[i].length; j++)
		{
			var p = highLightPoints[i][j];
			context.lineTo(p.rx, p.ry);
		}
		context.stroke();
		context.closePath();
		for(var j = 0; j < highLightPoints[i].length; j++)
		{
			context.beginPath();
			var p = highLightPoints[i][j];
			context.arc(p.rx, p.ry , p.r || 5, 0, Math.PI*2,true);
			context.stroke();
			context.closePath();
		}
	};
	context.lineWidth = 1;
	context.restore();
}

function update(e)
{
	console.log(frame);
	frame = 0;
}
