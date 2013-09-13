
/******************************************************************************************************
*touch event
*******************************************************************************************************/
function onTouch(e){
    console.log("touch", e);
    clickTest.render();
    clickTest.test(e.position.x, e.position.y);
}
var lastx = 0;
var lasty = 0;
function onDrag(e){
    console.log("draging",e);
    if (lastx == 0) {
        lastx = e.distanceX;
        lasty = e.distanceY;
    }
    var dx = e.distanceX - lastx;
    var dy = e.distanceY - lasty;
    if(e.touches.length > 2)
    {
        camera.moveX(-dx*0.01);
        camera.moveY(dy*0.01);
        lastx = e.distanceX;
        lasty = e.distanceY;
    }else{
        ball.rotateY(dx * 0.002);
        ball.rotateX(dy * 0.002);
        pointsAboveBall.rotateY(dx * 0.002);
        pointsAboveBall.rotateX(dy * 0.002);
    }
}
var lastScale = 0;
function onTransform(e){
    console.log("onTransform",e);
    if(e.touches.length == 3)
        return;
    if(lastScale == 0)
        lastScale = e.scale;
    else{
        // var s = e.scale / lastScale;
        var s = e.scale - lastScale;
        /*ball.setScale(s);
        pointsAboveBall.setScale(s);*/
        // camera.moveZ(-s* 10);
        if(s>0)
        {
            var hw = screenWidth>>1;
            var hh = screenHeight>>1;
            var pos = e.position;
            camera.moveWidthDirection(pos.x-hw, -pos.y+hh, hw, s*3);
        }else{
            camera.moveZ(-s * 10);
        }
        lastScale = e.scale;
    }
}
function onDragStart(e){
    console.log("onDragStart",e);
    lastx = 0;
    ball.clearRotate();
    pointsAboveBall.clearRotate();
}
function onTransformStart(e){
    console.log("onTransformStart",e);
    lastScale = 0;
}
function onTouchStart(e){
    console.log("touch start", e);
    ball.clearRotate();
    pointsAboveBall.clearRotate();

}
var hammer;
function initTouch(){
    var cvs = document.getElementById("canvas");
    cvs.addEventListener("touchstart", onTouchStart)
    hammer = new Hammer(cvs);
    hammer.option("prevent_default", true);
    hammer.ontouch = onTouch;
    hammer.ondragstart = onDragStart;
    hammer.ondrag = onDrag;
    hammer.ontransform = onTransform;
    hammer.ontransformstart = onTransformStart;
    initMouse();
}
/******************************************************************************************************
*mouse event
*******************************************************************************************************/
function onMouseDown(e){
    e.preventDefault();
    console.log("touch",e);
    lastx = lasty = 0;
    ball.clearRotate();
    pointsAboveBall.clearRotate();
}
function onSwiping(e){
    console.log("swiping", e);
    if (lastx == 0) {
        lastx = e.iniTouch.x;
        lasty = e.iniTouch.y;
    }
    var dx = e.currentTouch.x - lastx;
    var dy = e.currentTouch.y - lasty;
    ball.rotateY(dx * 0.002);
    ball.rotateX(dy * 0.002);
    pointsAboveBall.rotateY(dx * 0.002);
    pointsAboveBall.rotateX(dy * 0.002);
    /*lastx = e.currentTouch.x;
    lasty = e.currentTouch.y;*/
}
function onPinching(e){
    console.log("pinching", e);
}

function initMouse(){
    var cvs = $$("#canvas");
    cvs.touch(onMouseDown);
    cvs.swiping(onSwiping);
    cvs.pinching(onPinching);
}
/******************************************************************************************************
*webgl functions
*******************************************************************************************************/
function initGL(canvas) {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    if (!gl) {
        console.log("Could not initialise WebGL, sorry :-(");
    }
    // gl.enable(gl.VERTEX_PROGRAM_POINT_SIZE);
    // gl.enable(gl.POINT_SMOOTH);
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function mvPushMatrix() {
    var copy = new okMat4();
    mvMatrix.clone(copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/*********************
sin and cos pre calsulation
**********************/
var psin = [];
var pcos = [];
for(a = 0; a <= 360; a++)
{
    psin[a] = Math.sin(a * Math.PI / 180);
    pcos[a] = Math.cos(a * Math.PI / 180);
}

//if type != 0, angle is in rad
function sin(angle, type)
{
    if(type){
        while(angle < 0)
            angle += Math.PI * 2;
        var a = floor(angle % 360 * 57.3 + 0.5);
        return psin[angle];
    }else{
        while(angle < 0)
            angle += 360;
        return psin[floor(angle % 360 + 0.5)];
    }
}

function cos(angle, type)
{
    if(type){
        while(angle < 0)
            angle += Math.PI * 2;
        var a = floor(angle % 360 * 57.3 + 0.5);
        return pcos[angle];
    }else{
        while(angle < 0)
            angle += 360;
        return pcos[floor(angle % 360 + 0.5)];
    }
}

function floor(x)
{
    return Math.floor(x);
}

function equal(x, y)
{
    var t = Math.abs(x - y);
    if(t < 0.0001)
        return true;
    else
        return false;
}

function random(t){
    return Math.random() * (t || 1);
}

/*********************
calc positions of nodes
**********************/
function calcPosition(root, list, rho)
{
    var n = list.length;
    var dthet = 360 / n;
    for(i = 0; i < n; i++)
    {
        var thet = dthet * i;
        var phi = Math.random() * 180;
        var r = rho * sin(phi);
        var z = rho * cos(phi) + root.point.z();
        var x = r * cos(thet) + root.point.x();
        var y = r * sin(thet) + root.point.y(); 
        list[i].point.setPos(x,y,z);
    }

}

function createABall(latitudeBands, longitudeBands, radius, r, g, b, a)
{
    var points = [];
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var point = new Point(radius * x, radius * y , radius * z);
            point.setColor(r, g, b, a);
            points.push(point);
        }
    }
// background: -webkit-gradient(linear, left top, right bottom, from(#321022), to(#0d1923)) fixed;
    var indexData = [];
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }
    var ball = new Object3d(points, indexData, new Shader("shader-vs","shader-fs-ball"));
    return ball;
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}
/******************************************************************************************************
*key event
*******************************************************************************************************/

document.onkeydown = keyDown;
document.onkeyup = keyUp;

var currentKeyState = {};

function keyDown(event){
    currentKeyState[event.keyCode] = true;
}

function keyUp(event){
    currentKeyState[event.keyCode] = false;
}

function handleKeys(dt){
    if (currentKeyState[38]) {
        // Up
        camera.moveForward(dt);
    }
    if (currentKeyState[40]) {
        // Down
        camera.moveBackward(dt);
    }
    if (currentKeyState[37]) {
        // Left cursor key
        camera.moveLeft(-dt);
    }
    if (currentKeyState[39]) {
        // Right cursor key
        camera.moveRight(dt);
    }
    if(currentKeyState[49]){
        //1
        camera.yaw(dt);
    }
    if(currentKeyState[50]){
        //2
        camera.yaw(-dt);
    }
    if(currentKeyState[51]){
        //3
        camera.pitch(1);
    }
    if(currentKeyState[52]){
        //4
        camera.pitch(-1);
    }
    if(currentKeyState[53]){
        //5
        camera.roll(1);
    }
    if(currentKeyState[54]){
        //6
        camera.roll(-1);
    }
    if(currentKeyState[33]){
        //page up
        camera.moveUp(1);
        //camera.setLookAt(Ori);
    }
    if(currentKeyState[34]){
        //page down
        camera.moveDown(-1);
        //camera.setLookAt(Ori);
    }
}

/******************************************************************************************************
*animation
*******************************************************************************************************/
function anim(obj, name, to, time){
    time = time || 800; // 默认0.8秒
    var startTime = (new Date()).getTime();
    var from = obj[name];
    
    function go() {
        var timeNow = (new Date()).getTime();
        var elapsed = timeNow - startTime;
        if (elapsed >= time) {
            return;
        }

        var now = (to - from) * (elapsed / time) + from;
        obj[name] = now;
        requestAnimationFrame(go);
    }
  
    go();
}
