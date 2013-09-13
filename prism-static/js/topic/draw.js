var gl;
var screenWidth, screenHeight;
var mvMatrix ;
var pMatrix ;
var mvMatrixStack = [];
var lastTime = 0;
var frames = 0;
requestAnimationFrame = window.webkitRequestAnimationFrame;
var ball;
var pointsAboveBall;
var ring;
var trees = [];
var camera;
var radius = 4.0;



function initBuffers() {
    var r = radius;
    ball = createABall(20,20, r, 0.0, 0.0, 0.0, 1);

    var points = [];
    var indexes = [];
    for (var i = 0; i < 1000; i++) {
        var rho = r + 0.05;
        var phi = triangleRandom(0, 180, 90);
        var thet = random(360);
        points.push(new Point());
        points[i].fromBall(rho, phi, thet);
        points[i].setColor(0,0,255,1);
        indexes.push(i);
    };
    pointsAboveBall = new Object3d(points, indexes, new Shader("shader-vs","shader-fs-point"));
   //  ring = new Ring(r, r + 4);
    
    // postData.children = postData.children.slice(0,15000);
    trees = new Tree();
    console.log("init buffer finish");
}

function drawScene() {
    camera.calcMatrix();

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //pointsAboveBall.render();
   // ring.render(gl.TRIANGLES);
    trees.render();
    // clickTest.render();
}

var rTri=0;
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        rTri += elapsed / 300.0;
        handleKeys(elapsed);
    }
    lastTime = timeNow;
}

function tick(){
    requestAnimationFrame(tick);
	drawScene();
	animate();
    frames++;
}

function webGLStart() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    console.log("screenWidth and screenHeight", screenWidth, screenHeight);
    var canvas = document.getElementById("canvas");
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    camera = new Camera();
    initGL(canvas);
    //gl.enable(gl.GL_VERTEX_PROGRAM_POINT_SIZE);
    // setInterval(function(){console.log(frames); frames=0;}, 1000);

    initTouch();
    initDom();
    /*$.getJSON("js/topic/data.js", function(data){
    //    console.log("?", data);
        idList = data[0];
        meshData = data[1];
        initBuffers();
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.enable(gl.DEPTH_TEST);
        clickTest = new ClickTest();
        document.onclick = function(e){clickTest.render();clickTest.test(e.layerX, e.layerY);}
        tick();
    //});
*/
        idList = data[0];

        meshData = data[1];
        initBuffers();
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.enable(gl.DEPTH_TEST);
        clickTest = new ClickTest();
        document.onclick = function(e){clickTest.render();clickTest.test(e.layerX, e.layerY);}
        tick();
        window.onresize = onResize;
}
function onResize(){
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    console.log("screenWidth and screenHeight", screenWidth, screenHeight);
    var canvas = document.getElementById("canvas");
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    camera = new Camera();
    initGL(canvas);
    initDom();
}
var idList;
var meshData;
var state = -1;
var clickTest;
var rootId = "3500251157908958";

var stateHeight = [];

function initDom(){
    $$("#time-box").style("height", screenHeight+"px");
    var gap = screenHeight/6;
    var hgap = gap * 0.5;
    $$(".time-line").style("height", screenHeight-hgap+"px");
    $$(".time-line").style("top", hgap+"px");
    for (var i = -1; i < 5; i++) {
        stateHeight.push((i+1) * (gap- 20) + hgap);
        $$("#state"+(i+"")).style("top", stateHeight[stateHeight.length-1]  + "px");
    };
    $$(".button-out").style("right", "53px");
    $$(".button-out").style("top", hgap-16+"px");
    $$("#red").style("height", "0px");
    $$("#red").style("background-color", "rgba(255,20,0,1.0)");

    // $$("#btn").style("top", gap+20+"px");
    
    document.getElementById('btn').onmousedown = startDragbtn;
    document.onmouseup = function(e){
        if(draging){
            $$("#btn").style("top", stateHeight[state+1]+20*state +8+"px");
            $$("#red").style("height", stateHeight[state+1]+20*state-20  +"px");
            document.removeEventListener("mousemove", dragbtn);
        }
        draging = false;
    }
    document.onmousedown = function(e){
        e.preventDefault();
    }
}

var draging = false;

function startDragbtn(e){
    draging = true;
    document.addEventListener("mousemove", dragbtn);
}
function dragbtn(e){
    var hgap = screenHeight/12;
    $$("#btn").style("top", e.clientY -18 +"px");
    $$("#red").style("height", e.clientY - hgap +"px");
    var gap = stateHeight[1] - stateHeight[0];
    state = Math.floor((e.clientY - 18 - gap/2)/gap)-1;
    if (state > 4) 
        state = 4;
}