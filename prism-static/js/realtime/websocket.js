var loading = true;
function addContents (contents) {
    console.log(contents);
    loading = false;
    var type = contents.repost.type;
    if(contents.post == undefined)
    {
        contents.post = {mid: contents.repost.mid};
        contents.rtlist = [];
    }

    //push rt into list
    contents.rtlist.push(contents.repost);
    for (var i = 0; i < contents.rtlist.length; i++) {
        contents.rtlist[i].id = contents.post.mid;
        contents.rtlist[i].index = rtlist.length;
        contents.rtlist[i].type = type;
        rtlist.push(contents.rtlist[i]);
    };

    postList[contents.post.mid] = contents;
    rectGroupList[type].addContents(contents);
    friends.addContents(contents);
}
function initSocket() {
    if ("MozWebSocket" in window) {
        WebSocket = MozWebSocket;
    }
    if ("WebSocket" in window) {
        var host = "ws://10.96.0.105:8000";
        var ws = new WebSocket(host + "/wbsocket");
        ws.onopen = function(){
            console.log("Connected!");
            return;
        }
        ws.onmessage = function(evt){
            var receivedMsg = evt.data;
            // console.log(JSON.parse(receivedMsg));
            addContents(JSON.parse(receivedMsg));
            return;
        }
        ws.onclose = function(){
            console.log("Closed!");
            return;
        }
    } else {
        console("your browser does not support websockets.");
    }
}
