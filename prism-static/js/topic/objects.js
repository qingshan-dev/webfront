/******************************************************************************************************
*Quaternion
*******************************************************************************************************/
function Quaternion(w, x, y, z)
{
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
    this.v = Vector.create([x,y,z]);
}

Quaternion.prototype.multiply = function(q) {
    var pv = this.v;
    var qv = q.v;
    var w = (this.w * q.w - pv.dot(qv));
    var v = qv.x(this.w).add(pv.x(q.w).add(pv.cross(qv)));
    
    return new Quaternion(w, v.elements[0], v.elements[1], v.elements[2]);
};

Quaternion.prototype.star = function()
{
    return new Quaternion(this.w, -this.x, -this.y, -this.z);    
}
/******************************************************************************************************
*Camera
*******************************************************************************************************/
function Camera()
{
    this.eye = Vector.create([0,0,-15]);

    this.n = Vector.create([0,0,1]);
    this.v = Vector.create([0,1,0]);

    this.moveSpeed = 0.01;
    this.mvMatrix = null;
    this.fov = Math.PI * 0.25;
    this.aspect = screenWidth / screenHeight;
    this.near = 0.1;
    this.far = 100.0;

    this.target = null;
}

Camera.prototype.setTarget = function(x, y, z){
    this.target = Vector.create([x, -y, z]);
    var n = this.target.add(this.eye.x(-1)).toUnitVector();
    console.log(n);
    // var u = this.v.cross(this.n).toUnitVector();
    var eye = this.target.add(n.x(-1));

    // this.animN(n, 1500);
    this.animEye(eye, 1500);
}

Camera.prototype.animN = function(n, time) {
    var e = n.elements;
    anim(this.n.elements, 0, e[0], time);
    anim(this.n.elements, 1, e[1], time);
    anim(this.n.elements, 2, e[2], time);
};

Camera.prototype.animEye = function(eye, time) {
    var e = eye.elements;
    anim(this.eye.elements, 0, e[0], time);
    anim(this.eye.elements, 1, e[1], time);
    anim(this.eye.elements, 2, e[2], time);
};

Camera.prototype.clearTarget = function(){
    this.target = null;
}

Camera.prototype.rotateAroundO = function(dt){
    var angle = dt * this.moveSpeed * 10;
    var eye = this.eye.elements;
    var r = eye[0] * eye[0] + eye[2] * eye[2];
    r = Math.sqrt(r);
    var alpha = Math.acos(eye[0]/r) * 57.3;
    if(eye[2] < 0)
    {
        alpha = -alpha;
    }
    alpha += angle;
    var x = this.eye.elements[0];
    var z = this.eye.elements[2];
    this.eye.elements[0] = r * cos(alpha);
    this.eye.elements[2] = r * sin(alpha);
    // console.log(r,this.xzangle);
    var uz = sin(alpha + 90);
    var ux = cos(alpha + 90);
    var u = Vector.create([ux, 0, uz]);
    this.setLookAtU(Ori, u);
}
Camera.prototype.calcMatrix = function(){
    var u = this.v.cross(this.n).toUnitVector();
    this.mvMatrix = new Mat4();
    this.mvMatrix.fromCamera(u, this.v, this.n, this.eye);                       
}

Camera.prototype.getMvMatrix = function(){
    return this.mvMatrix.toArray();
}

Camera.prototype.moveWidthDirection = function(x, y, z, length){
    if(-this.eye.elements[2] < 6.0 && length < 0)
        return;
    var dir = Vector.create([x, y, z]).toUnitVector();
    this.eye = this.eye.add(dir.x(length));
}

Camera.prototype.getPerspectiveMatrix = function(){
    var mat = new Mat4();
    mat.perspective(this.fov, this.aspect, this.near, this.far);
    return mat.toArray();
}

Camera.prototype.moveX = function(x){
    var u = this.v.cross(this.n).toUnitVector();
    this.eye = this.eye.add(u.x(x));
}
Camera.prototype.moveZ = function(z){
    if(-this.eye.elements[2] < 6.0 && z < 0)
        return;
    this.eye = this.eye.add(this.n.x(-z));

}
Camera.prototype.moveY = function(y){
        this.eye = this.eye.add(this.v.x(y));
}
Camera.prototype.moveLeft = function() {
    var u = this.v.cross(this.n).toUnitVector();
    this.eye = this.eye.add(u.x(-this.moveSpeed * 10));
};

Camera.prototype.moveRight = function() {
    var u = this.v.cross(this.n).toUnitVector();
    this.eye = this.eye.add(u.x(this.moveSpeed * 10));
};

Camera.prototype.moveBackward = function() {
    this.eye = this.eye.add(this.n.x(-this.moveSpeed*10));
};

Camera.prototype.moveForward = function() {
    this.eye = this.eye.add(this.n.x(this.moveSpeed*10));
};

Camera.prototype.moveUp = function() {
    this.eye = this.eye.add(this.v.x(this.moveSpeed*10));
};

Camera.prototype.moveDown = function() {
    this.eye = this.eye.add(this.v.x(-this.moveSpeed*10));
};

//rotate around v
Camera.prototype.yaw = function(dt)
{
    var angle = dt * this.moveSpeed * 10;
    var n = this.n.elements;
    var v = this.v.elements;
    var halfAngle = Math.abs(angle * 0.5);
    var sina = sin(halfAngle);
    var cosa = cos(halfAngle);
    var p = new Quaternion(0, n[0], n[1], n[2]);
    var q = new Quaternion(cosa, v[0] * sina, v[1] * sina, v[2] * sina);
    var qs = q.star(); 
    if(angle > 0)
        var r = q.multiply(p).multiply(qs);
    else
        var r = qs.multiply(p).multiply(q);
    this.n = r.v.toUnitVector();
}

//rotate around u axis
Camera.prototype.pitch = function(angle)
{
    var n = this.n.elements;
    var u = this.v.cross(n).toUnitVector().elements;
    var halfAngle = Math.abs(angle * 0.5);
    var sina = sin(halfAngle);
    var cosa = cos(halfAngle);
    var p = new Quaternion(0, n[0], n[1], n[2]);
    var q = new Quaternion(cosa, u[0] * sina, u[1] * sina, u[2] * sina);
    var qs = q.star(); 
    if(angle > 0)
        var r = q.multiply(p).multiply(qs);
    else
        var r = qs.multiply(p).multiply(q);    
    this.n = r.v.toUnitVector();
    this.v = this.n.cross(u).toUnitVector();
}

//rotate around z axis
Camera.prototype.roll = function(angle)
{
    var n = this.n.elements;
    var up = this.v.elements;
    var halfAngle = Math.abs(angle * 0.5);
    var sina = sin(halfAngle);
    var cosa = cos(halfAngle);
    var p = new Quaternion(0, up[0], up[1], up[2]);
    var q = new Quaternion(cosa, n[0] * sina, n[1] * sina, n[2] * sina);
    var qs = q.star(); 
    if(angle > 0)
        var r = q.multiply(p).multiply(qs);
    else
        var r = qs.multiply(p).multiply(q);    
    this.v = r.v.toUnitVector();
}


/******************************************************************************************************
*Mat4
*******************************************************************************************************/
function Mat4(){
    // this.mat = Matrix.create([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
    this.mat = Matrix.I(4);
}
Mat4.prototype.fromCamera = function(u, v, n, eye){
    this.mat = Matrix.create([ [u.elements[0], v.elements[0], n.elements[0], 0],
                               [u.elements[1], v.elements[1], n.elements[1], 0],
                               [u.elements[2], v.elements[2], n.elements[2], 0],
                               [  -eye.dot(u),   -eye.dot(v),   eye.dot(n), 1] ]);  
}
Mat4.prototype.fromPoint = function(p){
    this.mat = Matrix.create([[p.x(), p.y(), p.z(), 1.0]]);
    return this;
}
Mat4.prototype.perspective = function(fov, aspect, near, far){
    var f = fov * 0.5;
    var a = far-near;
    var e = 1/Math.tan(f);
    this.mat = Matrix.I(4);
    this.mat.elements[0][0] = e/aspect;
    this.mat.elements[1][1] = e;
    this.mat.elements[2][2] = -(far+near) / a;
    this.mat.elements[2][3] = -1;
    this.mat.elements[3][2] = -2 * near * far / a;
    this.mat.elements[3][3] = 0;
}
Mat4.prototype.multiply = function(matrix, change) {
    if(change)
        this.mat = this.mat.multiply(matrix.mat); 
    else
    {
        var t = new Mat4();
        t.mat = this.mat.multiply(matrix.mat);
        return t;
    }
    return this;    
};
Mat4.prototype.scale = function(x, y, z){
    var s = Matrix.I(4);
    s.elements[0][0] = x;
    s.elements[1][1] = y;
    s.elements[2][2] = z;
    this.mat = this.mat.multiply(s);
    return this;
}
Mat4.prototype.clone = function(){
    var c = new Mat4();
    c.mat = Matrix.create(this.mat.elements);
    return c;
}
Mat4.prototype.rotX = function(angle){
    angle = angle * Math.PI / 180;
    var sina = Math.sin(angle);
    var cosa = Math.cos(angle);
    var rot = Matrix.I(4);
    rot.elements[1][1] = cosa;
    rot.elements[1][2] = sina;
    rot.elements[2][1] = -sina;
    rot.elements[2][2] = cosa;
    this.mat = this.mat.multiply(rot);
    return this;
}
Mat4.prototype.rotY = function(angle){
    angle = angle * Math.PI / 180;
    var sina = Math.sin(angle);
    var cosa = Math.cos(angle);
    var rot = Matrix.I(4);
    rot.elements[0][0] = cosa;
    rot.elements[0][2] = -sina;
    rot.elements[2][0] = sina;
    rot.elements[2][2] = cosa;
    this.mat = this.mat.multiply(rot);
    return this;
}
Mat4.prototype.rotZ = function(angle){
    angle = angle * Math.PI / 180;
    var sina = Math.sin(angle);
    var cosa = Math.cos(angle);
    var rot = Matrix.I(4);
    rot.elements[0][0] = cosa;
    rot.elements[0][1] = sina;
    rot.elements[1][0] = -sina;
    rot.elements[1][1] = cosa;
    this.mat = this.mat.multiply(rot);
    return this;
}
Mat4.prototype.translate = function(x, y, z){
    var trans = Matrix.I(4);
    trans.elements[3][0] = x;
    trans.elements[3][1] = y;
    trans.elements[3][2] = z;
    this.mat = this.mat.multiply(trans);
}
Mat4.prototype.toArray = function(){
    var arr = [];
    for (var i = 0; i < 4; i++) {
        arr = arr.concat(this.mat.elements[i]);
    };
    return arr;
}

/******************************************************************************************************
*tree node
*******************************************************************************************************/
 function Node(data, point){
    this.content = data.content || {};
    this.point = point || new Point(0.0, 0.0, 0.0);
    this.children = data.children || [];
    this.layer = data.layer;
 }
/******************************************************************************************************
*tree
*******************************************************************************************************/
function Tree(){
    this.mvMatrix = new Mat4();

    // this.createPointsAndRelations(this.create, data);
    this.lineShader = new Shader("lines-vs", "lines-fs");
    this.leafShader = new Shader("leaf-vs", "leaf-fs");
    this.xblurShader = new Shader("blur-vs", "xblur-fs");
    // this.yblurShader = new Shader("blur-vs", "yblur-fs");

    this.sourceBuffer = gl.createFramebuffer();
    this.sourceTexture = gl.createTexture();
    this.xblurBuffer = gl.createFramebuffer();
    this.xblurTexture = gl.createTexture();
    this.yblurBuffer = gl.createFramebuffer();
    this.yblurTexture = gl.createTexture();
    this.initBuffers();
}

Tree.prototype.initBuffers = function(){
    this.vb = [];
    this.ib = [];
    this.idcb = [];
    for(var i = 0; i < 5; i++)
    {
        //create vertices buffer
        this.vb[i] = gl.createBuffer();
        bindArrayBuffer(this.vb[i]);
        arrayBufferData(meshData[i].points);
        //create index buffer
        this.ib[i] = gl.createBuffer();
        bindElementBuffer(this.ib[i]);
        elementBufferData(meshData[i].lines);
        //id list
        this.idcb[i] = gl.createBuffer();
        bindArrayBuffer(this.idcb[i]);
        arrayBufferData(idList.slice(0,meshData[i].points.length/3 * 4));
    }
    console.log("finish buffer");

    initFrameBuffer(this.sourceBuffer, this.sourceTexture);
    initFrameBuffer(this.xblurBuffer, this.xblurTexture);
    initFrameBuffer(this.yblurBuffer, this.yblurTexture);
    //create quad buffers
    this.quadVb = gl.createBuffer();
    bindArrayBuffer(this.quadVb);
    arrayBufferData([0.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 0.0]);
}
//(0, 180, 90)-> random(180)
function triangleRandom(a, b, c){
    var u = random();
    var t = (c-a)/(b-a);
    if(u<t){
        return a+Math.sqrt(u*(b-a)*(c-a));
    }else{
        return b-Math.sqrt((1-u)*(b-a)*(b-c));
    }
}

function initFrameBuffer(frameBuffer, renderTexture){
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    frameBuffer.width = 1024;
    frameBuffer.height = 512;
    //create a texture from frameBuffer
    gl.bindTexture(gl.TEXTURE_2D, renderTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, frameBuffer.width, frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);
    //create renderbuffer from framebuffer
    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, frameBuffer.width, frameBuffer.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

Tree.prototype.render = function(){
    this.mvMatrix = ball.finalMatirx;

    useFrameBuffer(this.sourceBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //draw ball
    gl.enable(gl.DEPTH_TEST);
    ball.render(gl.TRIANGLE_STRIP);
    pointsAboveBall.render(gl.POINTS);
    if(state > -1)
    {
        //draw lines
        this.lineShader.use();
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);

        bindArrayBuffer(this.vb[state]);
        this.lineShader.vertexAttribPointer("position", 3);
        bindElementBuffer(this.ib[state]);

        pushMatrixUniforms(this.lineShader, this.mvMatrix);
        gl.drawElements(gl.LINES, meshData[state].lines.length, gl.UNSIGNED_SHORT, 0);

        //draw leaf points
        gl.enable(gl.BLEND);

        this.leafShader.use();
    /*
        bindArrayBuffer(this.cb);
        this.leafShader.vertexAttribPointer("color", 4);*/
        bindArrayBuffer(this.vb[state]);
        this.leafShader.vertexAttribPointer("position", 3);
        
        pushMatrixUniforms(this.leafShader, this.mvMatrix);
        gl.drawArrays(gl.POINTS, 0, meshData[state].points.length/3);
        
    }

    //leaf blur
    useFrameBuffer(null);
    this.xblurShader.use();

    bindArrayBuffer(this.quadVb);
    this.xblurShader.vertexAttribPointer("position", 3);
    this.xblurShader.activeTexture(this.sourceTexture);
    gl.uniform1f(this.xblurShader.getUniformLocation("uDelta"), 1/1024);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
}


/******************************************************************************************************
*color
*******************************************************************************************************/
function Color(r,g,b,a)
{
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.rgba = [r,g,b,a];
}
/******************************************************************************************************
*a point in 3d space
*******************************************************************************************************/
function Point(x, y, z, r, g, b, a)
{
    //笛卡尔坐标
    this.pos = [];
    this.pos[0] = x || 0.0;
    this.pos[1] = y || 0.0;
    this.pos[2] = z || 0.0;
    //转换后的2d坐标
    this.rx = 0.0;
    this.ry = 0.0;
    //球面坐标
    this.rho = 0.0;
    this.phi = 0.0;
    this.thet = 0.0;

    this.mvMatrix = new Mat4();
    //color
    this.color = new Color(r || 1.0, g || 1.0, b || 1.0, a || 1.0);
}

Point.prototype.toMat = function(){
    return Matrix.create([[this.pos[0], this.pos[1], this.pos[2], 1.0]]);
}

Point.prototype.setPos = function(x,y,z) {
    this.pos[0] = x;
    this.pos[1] = y;
    this.pos[2] = z;
};

Point.prototype.toBall = function(){
    var x = this.pos[0];
    var y = this.pos[1];
    var z = this.pos[2];
    var t = 180 / Math.PI;
    this.rho = Math.sqrt(x*x+y*y+z*z);
    this.thet = Math.atan(-z/x) * t;
    if(x < 0)
        this.thet += 180;
    if(this.thet < 0)
        this.thet += 360;
    this.phi = Math.acos(y/this.rho) * t;
    return this;
}

Point.prototype.fromBall = function(rho, phi, thet){
    this.rho = rho;
    this.phi = phi;
    this.thet = thet;
    phi = phi * Math.PI / 180;
    thet = thet * Math.PI / 180;
    var x = rho * Math.sin(phi) * Math.cos(thet);
    var z = -rho * Math.sin(phi) * Math.sin(thet);
    var y = rho * Math.cos(phi);
    this.setPos(x, y, z);
}

Point.prototype.x = function() {
    return this.pos[0];
};

Point.prototype.y = function() {
    return this.pos[1];
};

Point.prototype.z = function() {
    return this.pos[2];
};

Point.prototype.setColor = function(r,g,b,a) {
    this.color = new Color(r, g, b, a);
};

/******************************************************************************************************
*webgl functions
*******************************************************************************************************/
function bindArrayBuffer(bf){
   gl.bindBuffer(gl.ARRAY_BUFFER, bf);
}

function bindElementBuffer(bf){
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bf);
}

function arrayBufferData(data){
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
}

function elementBufferData(data){
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
}

function useFrameBuffer(bf){
    gl.bindFramebuffer(gl.FRAMEBUFFER, bf);
}

function pushMatrixUniforms(shader, mvMatrix){
    shader.matrix4Uniform("pMatrix", camera.getPerspectiveMatrix());
    shader.matrix4Uniform("mvMatrix", mvMatrix.toArray() || camera.getMvMatrix());
}
/******************************************************************************************************
*a object in 3d space
*******************************************************************************************************/
function Object3d(points, indexList, shaderProgram)
{
    this.points = points;
    this.numItems = indexList.length;
    this.shader = shaderProgram;

    this.m = null;
    this.p = null;
    this.mp = null;

    //create vertex buffer
    var vertices = [];
    for(i = 0; i < points.length; i++)
    {
        vertices = vertices.concat(points[i].pos);
    }
    this.vb = gl.createBuffer();
    bindArrayBuffer(this.vb);
    arrayBufferData(vertices);

    //create color buffer
    var colors = [];
    for(i = 0; i < points.length; i++)
    {
        colors = colors.concat(points[i].color.rgba);
    }
    this.cb = gl.createBuffer();
    bindArrayBuffer(this.cb);
    arrayBufferData(colors);

    //create vertex buffer
    this.ib = gl.createBuffer();
    bindElementBuffer(this.ib);
    elementBufferData(indexList);

    this.mvMatrix = new Mat4();
    this.xangle = 0;
    this.yangle = 0.1;
    this.scale = 1;
    this.finalMatirx = new Mat4();
}

Object3d.prototype.rotateX = function(angle){
    this.mvMatrix.rotX(angle);
    this.xangle = angle;
}

Object3d.prototype.rotateY = function(angle){
    this.mvMatrix.rotY(angle);
    this.yangle = angle;
}

Object3d.prototype.clearRotate = function(angle){
    this.yangle = 0;
    this.xangle = 0;
}

Object3d.prototype.setScale = function(s){
    this.scale *= s;
}

Object3d.prototype.render = function(method) {
    this.shader.use();
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    bindArrayBuffer(this.vb);
    this.shader.vertexAttribPointer("position", 3);

    bindArrayBuffer(this.cb);
    this.shader.vertexAttribPointer("color", 4);

    bindElementBuffer(this.ib);

    this.mvMatrix.rotY(this.yangle);
    this.mvMatrix.rotX(this.xangle);

    var s = new Mat4();
    s.scale(this.scale, this.scale, this.scale);
    s = this.mvMatrix.multiply(s);

    this.finalMatirx = s.multiply(camera.mvMatrix);
    this.shader.matrix4Uniform("pMatrix", camera.getPerspectiveMatrix());
    this.shader.matrix4Uniform("mvMatrix", this.finalMatirx.toArray());

    gl.drawElements(method, this.numItems, gl.UNSIGNED_SHORT, 0);
};
/******************************************************************************************************
*shader
*******************************************************************************************************/
function Shader(vs, fs){
    this.vertexShader = getShader(gl, vs);
    this.fragmentShader = getShader(gl, fs);
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
    }
}

Shader.prototype.getAttribLocation = function(attr) {
    return gl.getAttribLocation(this.program, attr);
};

Shader.prototype.getUniformLocation = function(uniform) {
    return gl.getUniformLocation(this.program, uniform);
};

Shader.prototype.use = function() {
    gl.useProgram(this.program);
};

Shader.prototype.vertexAttribPointer = function(attr, size) {
    var loc = this.getAttribLocation(attr);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
};

Shader.prototype.matrix4Uniform = function(uniform, bf) {
    gl.uniformMatrix4fv(this.getUniformLocation(uniform), false, bf);
};

Shader.prototype.activeTexture = function(texture){
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(this.getUniformLocation("texture"), 0);
}

/******************************************************************************************************
*ring
*******************************************************************************************************/
var ringTexture;
function Ring(innerRadius, outerRadius){
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.time = 0;
    this.initBuffers();
    this.initTexture();
    this.shader = new Shader("ring-vs", "ring-fs");
}

Ring.prototype.initBuffers = function(){
    var r = this.outerRadius;
    this.vertices = [r, r, 0.0, -r, r, 0.0,  -r, -r, 0.0,  r, -r, 0.0, r, r, 0.0 ];
    this.vb = gl.createBuffer();
    bindArrayBuffer(this.vb);
    arrayBufferData(this.vertices);

    this.uv = [0.01, 0.01,  0.99, 0.01,  0.99, 0.99,  0.01, 0.99,  0.01, 0.01];
    this.uvb = gl.createBuffer();
    bindArrayBuffer(this.uvb);
    arrayBufferData(this.uv);
}

Ring.prototype.initTexture = function() {
    ringTexture = gl.createTexture();
    ringTexture.image = new Image();
    ringTexture.image.src = "lightcircle-256.png";
    ringTexture.image.onload = function () {
        handleLoadedTexture(ringTexture);
    }
}

Ring.prototype.render = function() {
    this.shader.use();

    bindArrayBuffer(this.vb);
    this.shader.vertexAttribPointer("position", 3);

    bindArrayBuffer(this.uvb);
    this.shader.vertexAttribPointer("texCoord", 2);

    this.time += 0.01;

    this.shader.matrix4Uniform("pMatrix", camera.getPerspectiveMatrix());
    this.shader.matrix4Uniform("mvMatrix", camera.getMvMatrix());
    gl.uniform4fv(this.shader.getUniformLocation("color"), [1.0, 1.0, 0.9, 1.0]);
    this.shader.activeTexture(ringTexture);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length/3);
    
};

/******************************************************************************************************
*click buffer
*******************************************************************************************************/
function ClickTest(){
    this.frameBuffer = gl.createFramebuffer();
    this.textureBuffer = gl.createTexture();
    initFrameBuffer(this.frameBuffer, this.textureBuffer);
    this.shader = new Shader("click-vs", "click-fs");
    this.h = 512;
    this.w = 1024;
    this.arr = new Uint8Array(this.h * this.w * 4);
    this.arr = new Uint8Array(this.h * this.w * 4);
}
ClickTest.prototype.render = function() {
    this.shader.use();
    gl.disable(gl.BLEND);
    useFrameBuffer(this.frameBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    bindArrayBuffer(trees.idcb[state]);
    this.shader.vertexAttribPointer("color", 4);

    bindArrayBuffer(trees.vb[state]);
    this.shader.vertexAttribPointer("position", 3);
    
    pushMatrixUniforms(this.shader, trees.mvMatrix);
    gl.drawArrays(gl.POINTS, 0, meshData[state].points.length/3);

    gl.readPixels(0, 0, this.w, this.h, gl.RGBA, gl.UNSIGNED_BYTE, this.arr);
};
ClickTest.prototype.test = function(x, y){
    console.log("click:", x, y);

    var scalex = this.w / screenWidth;
    var scaley = this.h / screenHeight;
    var xp = floor(x * scalex);
    var yp = floor(y * scaley);
    // console.log("changed x, y:", xp, yp);
    var dir = [[0, 0], [-1, 0], [0, -1], [1, 0], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    /*var dir = [ [-3, -3], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-3, 3],
                [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3],
                [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3],
                [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [0, 3],
                [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3],
                [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3],
                [3, -3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [3, 3]];*/
    
    clear_pop();
    for (var i = 0; i < dir.length; i++) {
        var value = getPixelValue(this.arr, xp+dir[i][0], yp+dir[i][1], this.w, this.h);
        if( value > 0 )
        {
            console.log(value);
            console.log(meshData[state].mids[value-1]);
            /*var p = meshData[state].points;
            var m = new Mat4();
            m.mat = Matrix.create([p[(value-1)*3],p[(value-1)*3+1],p[(value-1)*3+2],1.0]);
            m = ball.finalMatirx.multiply(m).mat.elements;
            console.log(m);
            camera.setTarget(m[0][0],m[1][0], m[2][0]);*/
            $.getJSON("../ajax/post/"+meshData[state].mids[value-1], function(d){
                console.log(d);
            })
            /*var json_repost = { 'create_at': 'X年X月'
                      , 'text': '这里是消息正文这里是消息正文这里是消息正文这里是消息正文'
                      , 'bmiddle_pic': 'http://tp4.sinaimg.cn/2481067267/50/5627943334/0'
                      , 'original_pic': 'http://tp4.sinaimg.cn/2481067267/50/5627943334/0'
                      , 'thumbnail_pic': 'http://tp4.sinaimg.cn/2481067267/50/5627943334/0'
                      , 'source': '新浪微博'
                      , 'type': 1
                      , 'repost': false
                      , 'reposts_count': 132
                      , 'comments_count': 2342434
                      , 'user': { 'id': 234234234
                                , 'screen_name': '咣咣蛋包饭'
                                , 'profile_image_url': 'http://tp4.sinaimg.cn/1963516423/50/40001222013/0'
                                , 'description': '蛋包饭呀蛋包饭'
                                , 'followers_count': 234
                                , 'friends_count': 233242342
                                , 'statuses_count': 3324
                              }
                      }
            var dom_repost = $(repost_pop(json_repost, 1));
            dom_repost.css({ 'margin-top': y+'px'
                           , 'margin-left': x+'px'
                           , 'z-index': '50000'
                           , 'opacity': 1.0
                         });
            console.log(dom_repost);
             $('#layer_pop').append(dom_repost);*/

        }
    };
}

function getPixelValue(arr, x, y, w, h){
    if(x >= w || x <= 0 || y >= h || y <= 0)
        return -1;

    var n = (h-y) * w + x - 1;
    var index = n << 2;
    var t = [arr[index], arr[index+1], arr[index+2], arr[index+4]];
    console.log(t);
    return t[1] * 256 + t[2];
}
