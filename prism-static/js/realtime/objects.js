/*********************************************************
InfoRgn
*********************************************************/
function InfoRgn(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height; 
}
InfoRgn.prototype.inRgn = function(x, y){
    var right = this.x + this.width;
    var bottom = this.y + this.height;
    if(x > this.x && x < right && y > this.y && y < bottom)
        return true;
    else 
        return false;
}
/*********************************************************
Quaternion
*********************************************************/
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

/*********************************************************
Camera
*********************************************************/ 
var Ori = Vector.create([0,0,0]);
var xunit = Vector.create([1,0,0]);
var yunit = Vector.create([0,1,0]);
var zunit = Vector.create([0,0,1]);
function Camera()
{
    this.eye = Vector.create([0,70,0]);

    this.n = Vector.create([0,-1,0]);
    this.v = Vector.create([0,0,1]);

    this.moveSpeed = 0.01;
    this.tuvn = null;
    this.nearClip = 1;
}

Camera.prototype.calcMatrix = function(){
    var n = this.n.elements;
    var v = this.v.elements;
    var u = this.v.cross(this.n).toUnitVector().elements;
    this.tuvn = Matrix.create([ [u[0], v[0], n[0], 0],
                                [u[1], v[1], n[1], 0],
                                [u[2], v[2], n[2], 0],
                                [   0,    0,    0, 1] ]);   
                              
}

Camera.prototype.animToPosition = function(x, y, z, time) {
    anim(this.eye.elements, 0, x, time);
    anim(this.eye.elements, 1, y, time);
    anim(this.eye.elements, 2, z, time);
};

Camera.prototype.startAnim = function() {
    this.animToPosition(0,15,-35,1000);

    var startTime = (new Date()).getTime();
    var fromv = camera.v;
    
    function go() {
        var timeNow = (new Date()).getTime();
        var elapsed = timeNow - startTime;
        if (elapsed >= 1000) {
            return;
        }
        camera.setLookAt(Ori);
        requestAnimationFrame(go);
    }
  
    go();
};

Camera.prototype.moveForwardX = function(dt) {
    var eye = this.eye.elements;
    var r = eye[0] * eye[0] + eye[2] * eye[2];
    if(r < rectGroupList[0].r * rectGroupList[0].r)
        return;
    this.eye = this.eye.add(this.n.x(dt * this.moveSpeed));

};

Camera.prototype.moveBackwardX = function(dt) {
    var eye = this.eye.elements;
    var r = eye[0] * eye[0] + eye[2] * eye[2];
    if(r > 1200)
        return;
    this.eye = this.eye.add(this.n.x(-dt * this.moveSpeed));

};

Camera.prototype.rotateAroundO = function(dt){
    var angle = dt * this.moveSpeed * 10;
    console.log(angle);
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

Camera.prototype.animToLookAt = function(target, time) {
    var u = this.v.cross(this.n);
    var n = target.add(this.eye.x(-1)).toUnitVector();
    var v = n.cross(u).toUnitVector().elements;
    n = n.elements;

    this.animN(n[0], n[1], n[2], time);
    this.animV(v[0], v[1], v[2], time);
};

Camera.prototype.animN = function(x, y, z, time) {
    anim(this.n.elements, 0, x, time);
    anim(this.n.elements, 1, y, time);
    anim(this.n.elements, 2, z, time);
};

Camera.prototype.animV = function(x, y, z, time) {
    anim(this.v.elements, 0, x, time);
    anim(this.v.elements, 1, y, time);
    anim(this.v.elements, 2, z, time);
};

Camera.prototype.log = function(){
    console.log("eye:", this.eye.elements);
    console.log("direction:", this.n.elements);
}

Camera.prototype.moveLeft = function() {
    var u = this.v.cross(this.n).toUnitVector();
    this.eye = this.eye.add(u.x(-this.moveSpeed));
};

Camera.prototype.moveRight = function() {
    var u = this.v.cross(this.n).toUnitVector();
    this.eye = this.eye.add(u.x(this.moveSpeed));
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

Camera.prototype.setLookAtU = function(target, u) {
    this.n = target.add(this.eye.x(-1)).toUnitVector();
    this.v = this.n.cross(u).toUnitVector();
};

Camera.prototype.setLookAt = function(target) {
    var u = this.v.cross(this.n);
    this.n = target.add(this.eye.x(-1)).toUnitVector();
    this.v = this.n.cross(u).toUnitVector();
};

//rotate around v
Camera.prototype.yaw = function(dt)
{
    var angle = dt * this.moveSpeed * 10;
    console.log(angle);
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

/*********************************************************
Point
*********************************************************/ 
function Point(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = 0;
    this.ry = 0;
    this.cz = 0;
    this.index = -1;
    this.used = false;
    this.fill = false;
    this.show = false;
    this.color = null;
    this.type = 0;//1 for post 2 for friend
    this.r = 4;
}

Point.prototype.clone = function() {
    var p = new Point(this.x, this.y, this.z);
    p.rx = this.rx;
    p.ry = this.ry;
    p.cz = this.cz;
    p.index = this.index;
    p.used = this.used;
    p.fill = this.fill;
    p.show = this.show;
    p.color = this.color;
    p.type = this.type;
    return p;
};
/*********************************************************
Friend circles
*********************************************************/
function Friends()
{
    this.frs = {};
    this.angle = 2.5;
    this.yUp = -0.05;
    this.yDown = 0.05;
    this.pList = [];
    this.center = new Point(0,0,0);
}

Friends.prototype.addContents = function(contents) {
    for (var i = 0; i < contents.rtlist.length; i++) {
        var rt = contents.rtlist[i];
        this.addUser(rt.user, rt);
    };
};

Friends.prototype.addUser = function(user, rt){
    if(this.frs[user.id] == undefined)//未加入列表
    {
        user.posts = [];
        this.frs[user.id] = user;
        this.createACircle(user);
    }
    this.frs[user.id].posts.push(rt);
    this.frs[user.id].point.r += 1;
}

Friends.prototype.createACircle = function(user) {
    var dy = 0.2;
    var r = 6;
    var a, x, z, p;
    if(-this.yDown < this.yUp){
        this.yDown -= dy;
        a = -this.angle;
        x = r * cos(a);
        z = r * sin(a);
        p = new Point(x, this.yDown, z);    
    }else{
        this.yUp += dy;
        a = this.angle;
        x = r * cos(a);
        z = r * sin(a);
        p = new Point(x, this.yUp, z);
    }
    this.angle += 5;
    p.color = "#f29c9f";
    p.index = user.id;
    p.type = 2;
    this.pList.push(p);
    user.point = p;
};

Friends.prototype.render = function(){
    if(cameraState.length)
        return;
    context.save();
    context.globalAlpha = 0.8;
    var circles = this.pList;
    for (var i = 0; i < circles.length; i++) {
        if(circles[i].show)
        {
            context.fillStyle = circles[i].color;
            context.beginPath();
            context.arc(circles[i].rx, circles[i].ry , circles[i].r, 0, Math.PI*2,true);
            context.fill();
            context.closePath();
        }
    };
    context.restore();
    //renderRelationLines();
}

Friends.prototype.calcPositions = function() {
    calcPositions(this.pList);
    calcPositions([this.center]);
};

Friends.prototype.findTarget = function(x, y) {
    if(cameraState.length)
        return null;
    var r = null;
    for (var i = 0; i < this.pList.length; i++) {
        var p = this.pList[i];
        if(Math.abs(p.rx - x) < p.r && Math.abs(p.ry - y) < p.r)
            r = p;
    };
    return r; 
};

/*********************************************************
Rect
*********************************************************/

function Rect(r, angle, r2, angle2, color)
{
    this.width = 5;
    this.height = 10;

    this.left = 15;
    this.posList = [];  //positions of points
    this.pos = [];     //positions of the rect

    this.createLocalPositions();

    this.r = r;
    this.angle = angle;
    this.color = color;
    this.angle2 = angle2;
    this.r2 = r2;

    this.center = new Point(0,0,0)
    this.createWorldPositions();
}

//计算三角形的有向积,用来判断点在多边形内
Rect.prototype.s = function(A, B, C) {
    return (A.rx-B.rx)*(A.ry+B.ry)+(B.rx-C.rx)*(B.ry+C.ry)+(C.rx-A.rx)*(C.ry+B.ry);
};

//判断某点是否在投影后的矩形内
Rect.prototype.inRect = function(x, y) {
    /*var results = [];
    var p = this.pos;
    results.push(this.s(point, p[0], p[1]));
    results.push(this.s(point, p[1], p[2]));
    results.push(this.s(point, p[2], p[3]));
    results.push(this.s(point, p[3], p[0]));
    console.log(results);
    for (var i = 0; i < 3; i++) {
        var t = results[i] * results[i+1];
        if(t < 0)
            return false;
    };
    return true;*/

    //use bounding box
    var lx = 99999;
    var hx = 0;
    var ly = 99999;
    var hy = 0;
    var pos = this.pos;
    for (var i = 0; i < pos.length; i++) {
        if(pos[i].rx < lx)
            lx = pos[i].rx;
        if(pos[i].ry < ly)
            ly = pos[i].ry
        if(pos[i].rx > hx)
            hx = pos[i].rx;
        if(pos[i].ry > hy)
            hy = pos[i].ry
    };
    if(x >= lx && x <= hx && y >= ly && y <= hy)
    { 
        return true;
    }
    else
        return false;
};

Rect.prototype.createLocalPositions = function() {
    var hw = this.width * 0.5;
    var hh = this.height * 0.5;
    var sqrt3d2 = Math.sqrt(3) * 0.5;
    var sqrt3 = Math.sqrt(3);
    function dtr(){
        // by falood: 返回 -sqrt(2)/2 到 sqrt(2)/2 的随机数
        return (Math.random()*2 -1)*Math.sqrt(2)*0.5;
    }
    this.pointsPositionModel = [];
    this.row = 5;
    this.col = 3;
    for(var row = 0; row < 5; row++)
    {
        // by falood: 生成随机点
        this.pointsPositionModel[row] = [];
        this.pointsPositionModel[row].push(new Point(-2 + dtr(), sqrt3d2 * 3 - row * sqrt3 + dtr(), 0));
        this.pointsPositionModel[row].push(new Point(0 + dtr(), sqrt3d2 * 4 - row * sqrt3 + dtr(), 0));
        this.pointsPositionModel[row].push(new Point(2 + dtr(), sqrt3d2 * 3 - row * sqrt3 + dtr(), 0));
    }
    for(var r = 0; r < 5; r++)
    {
        for(var c = 0; c < 3; c++)
        {
            var p = this.pointsPositionModel[r][c];
            p.x = p.x * 0.12 * this.width;
            p.y = p.y * 0.09 * this.height + 0.6; 
            p.type = 1;
        }
    }
    this.pos.push(new Point(-hw, hh, 0));
    this.pos.push(new Point(-hw, -hh, 0));
    this.pos.push(new Point(hw, -hh, 0));
    this.pos.push(new Point(hw, hh, 0));

};

Rect.prototype.createWorldPositions = function() {
    rotateY(this.pos, 90 + this.angle);

    for(var i = 0; i < this.pointsPositionModel.length; i++)
        rotateY(this.pointsPositionModel[i], 90 + this.angle);

    var x = this.r * cos(this.angle);
    var z = this.r * sin(this.angle);
    translate(this.pos, x, 0, z);
    for(var i = 0; i < this.pointsPositionModel.length; i++)
        translate(this.pointsPositionModel[i], x, 0, z);


    rotateY([this.center], 90 + this.angle);
    translate([this.center], x, 0, z);

};

Rect.prototype.addContents = function(contents) {    
    var length = contents.rtlist.length;
    var results = this.findPoint(length);

    if( results.length == 0 )
    {
        return false;
    }
    else
    {
        var l = rtlist.length - 1;
        var p;
        for (var i = 0; i < length; i++) {
            p = this.pointsPositionModel[results[i][0]][results[i][1]].clone();
            rtlist[l-i].point = p;
            p.index = l - i;
            this.posList.push(p);
        };
        rtlist[l].point.fill = true;
        this.left -= length;
    }
    return true;
};

Rect.prototype.findPoint = function(num){
    var result;
    if (this.left < num){
        return [];
    } else {
        var x = [1, 4, 0, 3, 2];
        var y = [0, 2, 1];
        for (var i in x){
            for (var j in y){
                result = this.dfs(num, 1, x[i], y[j], []);
                if (0 != result.length){
                    return result;
                }
            }
        }
        return [];
    }
}

Rect.prototype.dfs = function(num, n, x, y, l){
    // 要找 num 个，当前是第 n 个，当前点行x列y，当前找到的所有点放在 l 里
    if (n == num + 1){
        return l;
    }
    if (x < 0 || x > 4 || y < 0 || y > 2 ||
        true == this.pointsPositionModel[x][y].used){
        return [];
    }
    this.pointsPositionModel[x][y].used = true;
    // 录找顺序
    var dt1 = [ [-1, 1]          // 右上
              , [1, 0]           // 下
              , [0, 1]           // 右下
              , [0, -1]          // 左下
              , [-1, -1]         // 左上
              , [-1, 0]];        // 上
    var dt2 = [ [0, 1]           // 右上
              , [1, 0]           // 下
              , [0, 1]           // 右下
              , [1, -1]          // 左下
              , [0, -1]          // 左上
              , [-1, 0]];        // 上
    l.push([x, y]);
    var result, dt;
    if (1 == y & 1){
        dt = dt1;
    } else {
        dt = dt2;
    }
    for (var i in dt){
        result = this.dfs(num, n + 1, x + dt[i][0], y + dt[i][1], l);
        if (0 != result.length){
            return result;
        }
    }
    this.pointsPositionModel[x][y].used = false;
    l.pop();
    return [];
}

Rect.prototype.show = function(){
    for (var i = 0; i < this.pos.length; i++) {
        if(this.pos[i].show)
            return true;
    };
    return false;
}

Rect.prototype.render = function(){
    var rectPoints = this.pos;
    var circles = this.posList;
    for(var i = 0; i < 3; i++)
        if(rectPoints[i].rx < 0 && rectPoints[i+1].rx > context.width)
            return;
    
    context.save();
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.globalAlpha = 0.5;
    //draw relations
    if(cameraState.length == 0)
        for (var i = 0; i < this.posList.length; i++) {
            var p1 = this.posList[i];
            var rt = rtlist[p1.index];
            var p2 = friends.frs[rt.user.id].point;
            context.beginPath();
            context.moveTo(p1.rx, p1.ry);
            context.lineTo(p2.rx, p2.ry);
            context.stroke();
            context.closePath();
        };
    //draw rect
    context.lineWidth = 8;
    context.lineJoin = "round";
    context.globalAlpha = 0.5;

    context.beginPath();
    context.moveTo(rectPoints[0].rx, rectPoints[0].ry);
    context.lineTo(rectPoints[1].rx, rectPoints[1].ry);
    context.lineTo(rectPoints[2].rx, rectPoints[2].ry);
    context.lineTo(rectPoints[3].rx, rectPoints[3].ry);
    context.lineTo(rectPoints[0].rx, rectPoints[0].ry);
    //context.stroke();
    context.fill();

    //draw circles
    context.globalAlpha = 1;
    context.lineWidth = 2;
    var r = 4;
    if(circles.length != 0)
    {
        //draw circles
        for(var i = 0; i < circles.length; i++)
        {
            if(!circles[i].show)
                continue;
            context.beginPath();
            context.arc(circles[i].rx, circles[i].ry ,r, 0, Math.PI*2,true);
            context.stroke();
            if(circles[i].fill)
                context.fill();
            context.closePath();
        }
        
        //draw lines
        var index = rtlist[circles[0].index].id;
        var lastp = circles[0];
        context.beginPath();
        context.moveTo(circles[0].rx, circles[0].ry);
        for (var i = 1; i < circles.length; i++) {
            if(!circles[i].show)
                continue;
            if(rtlist[circles[i].index].id == index)
            {
                context.lineTo(circles[i].rx, circles[i].ry);
            }
            else
            {
                index = rtlist[circles[i].index].id;
                context.stroke();
                context.closePath();
                context.beginPath();
                context.moveTo(circles[i].rx, circles[i].ry);
            }
        };
        context.stroke();
        context.closePath();
    }
    context.restore();
}

Rect.prototype.findTarget = function(x, y){
    /*if(cameraState.length)
        return null;*/
    var r = null;
    for (var i = 0; i < this.posList.length; i++) {
        var p = this.posList[i];
        if(Math.abs(p.rx - x) < 4 && Math.abs(p.ry - y) < 4)
            r = p;
    };
    return r;
}

Rect.prototype.animToPos2 = function(time){
    var newPosList = [];
    for (var i = 0; i < this.posList.length; i++) {
        newPosList[i] = this.posList[i].clone();
    };
    rotateY(newPosList, this.angle2);
    for (var i = 0; i < this.posList.length; i++) {
        anim(this.posList[i], "x", newPosList[i].x, time);
        anim(this.posList[i], "y", newPosList[i].y, time);
        anim(this.posList[i], "z", newPosList[i].z, time);
    };

    newPosList = [];
    for (var i = 0; i < this.pos.length; i++) {
        newPosList[i] = this.pos[i].clone();
    };
    rotateY(newPosList, this.angle2);
    for (var i = 0; i < this.pos.length; i++) {
        anim(this.pos[i], "x", newPosList[i].x, time);
        anim(this.pos[i], "y", newPosList[i].y, time);
        anim(this.pos[i], "z", newPosList[i].z, time);
    };

    newPosList = [this.center.clone()];
    rotateY(newPosList, this.angle2);
    anim(this.center, "x", newPosList[0].x, time);
    anim(this.center, "y", newPosList[0].y, time);
    anim(this.center, "z", newPosList[0].z, time);
}

Rect.prototype.animToPos1 = function(time){
    var newPosList = [];
    for (var i = 0; i < this.posList.length; i++) {
        newPosList[i] = this.posList[i].clone();
    };
    rotateY(newPosList, -this.angle2);
    for (var i = 0; i < this.posList.length; i++) {
        anim(this.posList[i], "x", newPosList[i].x, time);
        anim(this.posList[i], "y", newPosList[i].y, time);
        anim(this.posList[i], "z", newPosList[i].z, time);
    };

    newPosList = [];
    for (var i = 0; i < this.pos.length; i++) {
        newPosList[i] = this.pos[i].clone();
    };
    rotateY(newPosList, -this.angle2);
    for (var i = 0; i < this.pos.length; i++) {
        anim(this.pos[i], "x", newPosList[i].x, time);
        anim(this.pos[i], "y", newPosList[i].y, time);
        anim(this.pos[i], "z", newPosList[i].z, time);
    };

    newPosList = [this.center.clone()];
    rotateY(newPosList, -this.angle2);
    anim(this.center, "x", newPosList[0].x, time);
    anim(this.center, "y", newPosList[0].y, time);
    anim(this.center, "z", newPosList[0].z, time);
}


/*********************************************************
Rect group
*********************************************************/
function RectGroup(r, angle, color)
{
    this.rectList = [];
    this.r = r;
    this.angle = angle;
    this.color = color;

    this.posList = [];
    //方块位置列表
    this.posList.push([0, 0]);
    this.posList.push([1, -12]);
    this.posList.push([3, 8]);
    this.posList.push([5,-4]);
    this.posList.push([7, 10]);
    this.posList.push([8, -15]);
    this.posList.push([9, 7]);
    this.posList.push([10, -18]);
    this.posList.push([11, 19]);

    this.nearPosList = [];
    var t = 10;
    this.nearPosList.push(0);
    this.nearPosList.push(-t*2);
    this.nearPosList.push(t*2);
    this.nearPosList.push(-t*4);
    this.nearPosList.push(t*4);
    this.nearPosList.push(-t*6);
    this.nearPosList.push(t*6);
    this.nearPosList.push(-t*8);
    this.nearPosList.push(t*8);

    this.createRect();
    this.renderList = [];
    this.hide = true;
    this.center = new Point(r * cos(angle), 0, r * sin(angle));
}

RectGroup.prototype.addContents = function(contents) {
    var enough = false;
    var need = contents.rtlist.length + 1;
    for(i = 0; i < this.rectList.length; i++)
    {
        if(this.rectList[i].addContents(contents))
        {
            enough = true;
            break;
        }
    }
    if(!enough)
    {
        if(this.rectList.length == this.posList.length)
            return;
        this.createRect();
        this.addContents(contents);
    }
};

RectGroup.prototype.animToPos1 = function(time) {
    for (var i = 0; i < this.rectList.length; i++) {
        this.rectList[i].animToPos1(time);
    };
};

RectGroup.prototype.animToPos2 = function(time) {
    for (var i = 0; i < this.rectList.length; i++) {
        this.rectList[i].animToPos2(time);
    };
};

RectGroup.prototype.createRect = function()
{
    console.log("createRect");
    var index = this.rectList.length;
    var r = this.r + this.posList[index][0];
    //console.log(this.posList[index][0]);
    var angle = this.angle + this.posList[index][1];
    var rect = new Rect(r, angle, this.r, this.nearPosList[index] - this.posList[index][1], this.color);
    this.rectList.push(rect);
}

RectGroup.prototype.getPoints = function()
{
    var points = [];
    for(index = 0; index < this.rectList.length; index++)
    {
        points = points.concat(this.rectList[index].pos);
        points = points.concat(this.rectList[index].posList);
    }
    return points;
}

RectGroup.prototype.getRectPoints = function() {
    var points = [];
    for (var i = 0; i < this.rectList.length; i++) {
        points = points.concat(this.rectList[i].pos);
        points.push(this.rectList[i].center);
    };
    points.push(this.center);
    return points;
};

RectGroup.prototype.getPointPoints = function() {
    var points = [];
    for (var i = 0; i < this.renderList.length; i++) {
        points = points.concat(this.renderList[i].posList);
    };
    return points;
};

RectGroup.prototype.sort = function(){
    this.renderList = [];
    for (var i = 0; i < this.rectList.length; i++) {
        if(this.rectList[i].show())
        {
            this.renderList.push(this.rectList[i]);
        }
    };
    this.renderList.sort(function(a,b){return a.center.cz < b.center.cz});
}

RectGroup.prototype.render = function(){
    if(this.hide)
        return;
    //this.sort();
    for (var i = 0; i < this.renderList.length; i++) {
        this.renderList[i].render();
    };
}

RectGroup.prototype.calcPositions = function(){
    calcPositions( this.getRectPoints() );
    this.sort();
    calcPositions( this.getPointPoints() );
}

RectGroup.prototype.findTarget = function(x, y){
    if(this.hide)
        return null;
    var r = null;
    for (var i = this.renderList.length - 1; i >= 0; i--) {
        if(this.renderList[i].inRect(x, y))
        {
            r = this.renderList[i].findTarget(x, y);
            if(r != null)
                return r;
        }
    };
    return r;
}

RectGroup.prototype.inGroup = function(x, y){
    for (var i = this.renderList.length - 1; i >= 0; i--) {
        if(this.renderList[i].inRect(x, y))
        {
            return true;
        }
    };
    return false;
}

/*********************************************************

*********************************************************/
