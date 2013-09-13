/*********************************************************
3d transform
*********************************************************/
function calcPositions(points)
{
    var tuvn = camera.tuvn;
    //console.log(tuvn);
    for(i = 0; i < points.length; i++)
    {
        var position = Matrix.create([[ points[i].x - camera.eye.elements[0]
                                      , points[i].y - camera.eye.elements[1]
                                      , points[i].z - camera.eye.elements[2]
                                      , 1 ]]);
        //camera position
        var pos = position.multiply(tuvn).elements[0];
        pos[2] /= pos[3];
        points[i].cz = pos[2];

        if(pos[2] < camera.nearClip){
            points[i].show = false;
            continue;
        }else{
            points[i].show = true;
        }

        pos[0] /= pos[3];
        pos[1] /= pos[3];
        var w = screenWidth >> 1;
        var h = screenHeight >> 1;

        //投影变换
        points[i].rx = w * pos[0] / pos[2] + w;
        points[i].ry = -w * pos[1] / pos[2] + h;
    }
}
/*********************************************************
3d translate and rotate
*********************************************************/
function rotateY(array, angle)
{
    for(i = 0; i < array.length; i++)
    {
        var x = array[i].x;
        var z = array[i].z;
        array[i].x = x * cos(angle) - z * sin(angle);
        array[i].z = x * sin(angle) + z * cos(angle);
    }
}

function translate(array, x, y, z)
{
    for(i = 0; i < array.length; i++)
    {
        array[i].x += x;
        array[i].y += y;
        array[i].z += z;
    }
}
/*********************************************************
handle mouse event
*********************************************************/

var cameraState = [];
var magGroup = -1;

function dblClick(e)
{
    if (cameraState.length)
    {
        camera.animToPosition(cameraState[0], cameraState[1], cameraState[2], 800);
        camera.animV(cameraState[3], cameraState[4], cameraState[5], 800);
        camera.animN(cameraState[6], cameraState[7], cameraState[8], 800);
        cameraState = [];

        for (var j = 0; j < rectGroupList.length; j++) {
            if(!rectGroupList[j].hide)
                rectGroupList[j].animToPos1(800);
            else
                rectGroupList[j].hide = false;
        };
        magGroup = -1;
        return;
    } 
    for (var i = 0; i < rectGroupList.length; i++) {
        if (rectGroupList[i].inGroup(e.layerX, e.layerY)) {
            //第i个组被选中
            magGroup = i;
            var center = rectGroupList[i].center;
            var c = Vector.create([center.x, center.y, center.z]).toUnitVector().elements;
            cameraState = [];
            cameraState = cameraState.concat(camera.eye.elements);
            cameraState = cameraState.concat(camera.v.elements);
            cameraState = cameraState.concat(camera.n.elements);
            camera.animN(c[0], c[1], c[2], 800);
            camera.animV(0,1,0,800);
            camera.animToPosition(0,0,0,800);

            rectGroupList[i].animToPos2(800);
            for (var j = 0; j < rectGroupList.length; j++) {
                if (j != i) {
                    rectGroupList[j].hide = true;
                }
            };
        } 
    };
}

var highLightPoints = [];
function mouseMove(e)
{
    highLightPoints = [];
    for (var i = renderList.length - 1; i >= 0; i--) {
        var r = renderList[i].findTarget(e.layerX, e.layerY);
        if(r != null)
        {
            if (r.type == 1) {
                pushHighLightPointsM(r);
            }else{
                pushHighLightPointsU(r);
            };
            return;
        }
    };
}

function pushHighLightPointsU(userPoint){
    var rtspoints = rtsPointsFromUserPoint(userPoint);
    for (var i = 0; i < rtspoints.length; i++) {
        highLightPoints[i] = [userPoint, rtspoints[i]];
    };
}

function pushHighLightPointsM(rtPoint){
    var rtspoints = rtsPointsFromRtPoint(rtPoint);
    var userPoint = userPointFromRtPoint(rtPoint);
    //console.log(userPoint);
    highLightPoints[0] = rtspoints;
    if(!cameraState.length)
        highLightPoints[1] = [rtPoint, userPoint];
}

function mouseClick(e)
{
    clear_pop();
    rgnList = [];
    highLightPoints = [];
    for (var i = renderList.length - 1; i >= 0; i--) {
        var r = renderList[i].findTarget(e.layerX, e.layerY);
        if(r != null)
        {
            if (r.type == 1) {
                showInfoFromRt(r);
                pushHighLightPointsM(r);
            }else{
                showInfoFormUser(r);
                pushHighLightPointsU(r);
            };
            return;
        }
    };
}

function message_pop_x(rts){
    var mpoList = [];
    for (var i = 0; i < rts.length; i++) {
        var p = rts[i].point;
        var mpo = message_pop_obj(rts[i]);
        mpoList.push(mpo);
    };
    if(mpoList.length > 0)
    {
        var center = rectGroupList[rts[0].type].rectList[0].center;
        console.log(center);
        message_pop_(mpoList, rts[0].type, center.rx, center.ry);
    }
}

function showInfoFromRt(rtPoint){
    var rts = rtsFromRtPoint(rtPoint);
    if(cameraState.length == 0)
    {
        var user = userFromRtPoint(rtPoint);
        var userp = user.point;
        console.log("debug user",user);
        user_pop_(user, 4, user.posts.length, userp.rx, userp.ry);
        message_pop_x(rts);
    }else{
        var repost = rts[rts.length - 1];
        var p = repost.point;
        repost_pop_(repost, p.rx, p.ry);
        for (var i = 0; i < rts.length - 1; i++) {
            var p = rts[i].point;
            post_pop_(rts[i], p.rx, p.ry);
        };
    }
}

function showInfoFormUser(userPoint){
    var user = userFromUserPoint(userPoint);
    user_pop_(user, 4, user.posts.length, userPoint.rx, userPoint.ry);
    var rts = rtsFromUser(user);
    rts.sort(function(a,b){return a.type > b.type});
    var typedRts = [];
    var type = rts[0].type;
    for (var i = 0; i < rts.length; i++) {
        if(rts[i].type == type){
            typedRts.push(rts[i]);
        }else{
            message_pop_x(typedRts);
            typedRts = [rts[i]];
            type = rts[i].type;
        }
    }; 
    message_pop_x(typedRts);
}

/*********************************************************
handle key event
*********************************************************/

document.onkeydown = keyDown;
document.onkeyup = keyUp;

var currentKeyState = {};
// rotate angle
var rv = 0;
var rh = 0;
function keyDown(event){
    currentKeyState[event.keyCode] = true;
}

function keyUp(event){
    currentKeyState[event.keyCode] = false;
}

function handleKeys(dt){
    if (currentKeyState[38]) {
        // Up
        if(!cameraState.length)
            camera.moveForwardX(dt);
    }
    if (currentKeyState[40]) {
        // Down
        if(!cameraState.length)
            camera.moveBackwardX(dt);
    }
    if (currentKeyState[37]) {
        // Left cursor key
        if(cameraState.length > 0)
            camera.yaw(-dt);
        else
            camera.rotateAroundO(-dt);
    }
    if (currentKeyState[39]) {
        // Right cursor key
        if(cameraState.length > 0)
            camera.yaw(dt);
        else
            camera.rotateAroundO(dt);
    }
    if(currentKeyState[49]){
        //1
        camera.yaw(1);
    }
    if(currentKeyState[50]){
        //2
        camera.yaw(-1);
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
/*********************************************************
pre calculation of sin and cos
*********************************************************/
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
/*********************************************************
animate
*********************************************************/
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

function addRectGroup(){
    var n = 0;
    while(n < 6 && !rectGroupList[n].hide)
        n++;
    if(n < 6){
        rectGroupList[n].hide = false;
    }else if(loading){
        clearInterval(addGroupTimer);
        addGroupTimer =  setInterval(addRectGroup, 1000/60);
        camera.roll(1);
    }else{
       // camera.animToPosition(0, 0, -40, 2000);
        camera.n = Vector.create([0,-1,0]);
        camera.v = Vector.create([0,0,1]);
        camera.startAnim();
        clearInterval(addGroupTimer);
    }
}

/*********************************************************
info pop
*********************************************************/
var rgnList = [];
function moveRgn(rgn, x, y){
    x = clipx(x, rgn.width, rgn.height);
    y = clipy(y, rgn.width, rgn.height);
    var dx = x - rgn.x;
    dx /= Math.abs(dx);
    var dy = y - rgn.y;
    dy /= Math.abs(dy);
    while(Math.abs(rgn.x - x) > 1 && canMove(rgn)){
        rgn.x += dx;
    }
    rgn.x -= dx;
    while(Math.abs(rgn.y - y) > 1 && canMove(rgn)){
        rgn.y += dy;
    }
}

function canMove(rgn){
    for (var i = 0; i < rgnList.length; i++) {
        var r = rgnList[i];
        if(rgn == r)
            continue;
        var right = rgn.x + rgn.width;
        var bot = rgn.y + rgn.height;
        if ( r.inRgn(rgn.x, rgn.y) || r.inRgn(right, rgn.y) || r.inRgn(rgn.x, bot) || r.inRgn(right, bot) ) {
            return false;
        }
    };
    return true;
}

function clipx(x, width, height){
    if(x < 0)
        x = 0;
    if(x > screenWidth - width)
        x = screenWidth - width;
    return x;
}
function clipy(y, width, height){
    if(y < 0)
        y = 0;
    if(y > screenHeight - height)
        y = screenHeight - height;
    return y;
}

function createRgnAndCss(x,y,width,height){
    var hw = screenWidth >> 1;
    var hh = screenHeight >> 1;
    var w = screenWidth - width;
    var h = screenHeight - height;
    if(x < hw && y < hh)    //left top
        var r = new InfoRgn(0, 0, width, height);
    else if(y < hh && x > hw)   //right top
        var r = new InfoRgn(w, 0, width, height);
    else if(y > hh && x < hw)   //left bottom
        var r = new InfoRgn(0, h, width, height);
    else   //right bottom
        var r = new InfoRgn(w, h, width, height);

    moveRgn(r, x, y);
    rgnList.push(r);
    var domcss = {'z-index': '50000', 'opacity': 0.8};
    domcss['margin-top'] = r.y+6 + 'px';
    domcss['margin-left'] = r.x +6+ 'px';
    return domcss;
}

function message_pop_obj(rt){
    var obj = {};
    obj.time = rt.created_at;
    obj.content = rt.text;
    obj.repost = rt.reposts_count || 0;
    obj.comment = rt.comments_count || 0;
    return obj;
}

function message_pop_(obj, group, x, y){  
    var dom = $(message_pop(obj, group));
    $('#layer_pop').append(dom);
    console.log(dom.height());
    dom.css(createRgnAndCss(x, y, dom.width()+5, dom.height()+5));
}

function user_pop_(obj, group, n, x, y){
    var dom = $(user_pop(obj, group, n));
    $('#layer_pop').append(dom);
    dom.css(createRgnAndCss(x, y, dom.width()+5, dom.height()+50));
}

function repost_pop_(obj, x, y){
    var dom = $(repost_pop(obj, 1));
    $('#layer_pop').append(dom);
    dom.css(createRgnAndCss(x, y, dom.width()+5, dom.height()+5));
}

function post_pop_(rt, x, y){
    var obj = {};
    obj.user = rt.user;
    obj.text = rt.text;

    var dom = $(post_pop(obj, 1));
    $('#layer_pop').append(dom);
    dom.css(createRgnAndCss(x, y, dom.width()+5, dom.height()+5));
}

/*function processHtml(){
    if (highLightPoints[0].type == 1) {
        var p = highLightPoints[0];
        var index = p.index;
        var obj = createPostObjectM(index);
        createHtmlPostsM([obj], rtlist[index].type, p.rx, p.ry);
        p = highLightPoints[1];
        index = p.index;
        var fr = friends.frs[index];
        createHtmlPostsU(fr, 4, fr.posts.length - 1, p.rx, p.ry );

    } else if(highLightPoints[0].type == 2){
        var lists = [[],[],[],[],[],[]];
        for (var i = 1; i < highLightPoints.length; i++) {
            var index = highLightPoints[i].index;
            var rt = rtlist[index];
            lists[rt.type].push(index);
        };
        for (var i = 0; i < 6; i++) {
            if(lists[i].length == 0)
                continue;
            var list = [];
            for (var j = 0; j < lists[i].length; j++)
            {
                list.push(createPostObjectM(lists[i][j]));
            }
            var center = rectGroupList[i].center;
            var x = center.rx;
            var y = center.ry;
            if(x < 0)
                x = 0;
            if(y < 0)
                y = 0;
            if(x + 255 > screenWidth)
                x = screenWidth -255;
            if (y > screenHeight - 255) {
                y = screenHeight - 255
            }

            console.log(list);
            createHtmlPostsM(list, i, x, y);
        };
        
    };
}*/

/*********************************************************
info get
*********************************************************/
function inRect(x, y, rgn){
    if(rgn.x < x && rgn.x + rgn.y > x && rgn.y < y && rgn.y + rgn.height > y)
        return true;
    else
        return false;
}

function userFromRt(rt){
    return friendsrt.user.id;
}

function userFromRtIndex(index){
    return rtlist[index].user;
}

function userPointFromRtIndex(index){
    return rtlist[index].user.point;
}

function userPointFromRt(rt){
    return rt.user.point;
}

function rtFromRtPoint(point){
    return rtlist[point.index];
}

function userPointFromRtPoint(point){
    return friends.frs[rtlist[point.index].user.id].point;
}

function userFromRtPoint(point){
    return friends.frs[rtlist[point.index].user.id];
}

function rtsFromUser(user){
    return user.posts;
}

function rtsPointsFromUser(user){
    var ps = [];
    for (var i = 0; i < user.posts.length; i++) {
        ps.push(user.posts[i].point);
    };
    return ps;
}

function userFromUserPoint(point){
    return friends.frs[point.index];
}

function rtsPointsFromUserPoint(point){
    return rtsPointsFromUser(userFromUserPoint(point));
}

function rtsPointsFromRt(rt){
    var list = [];
    var id = rt.id;
    var post = postList[id];
    for (var i = 0; i < post.rtlist.length; i++) {
        list.push(post.rtlist[i].point);
    };
    return list;
}

function rtsFromRtPoint(point){
    var list = [];
    var rt = rtlist[point.index];
    var id = rt.id;
    var post = postList[id];
    for (var i = 0; i < post.rtlist.length; i++) {
        list.push(post.rtlist[i]);
    };
    return list;
}

function rtsPointsFromRtPoint(point){
    return rtsPointsFromRt(rtlist[point.index]);
}