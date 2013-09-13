var screenHeight, screenWidth;
function initDom()
{
	screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    var cvs = $("#canvas")[0];
    cvs.width = screenWidth;
    cvs.height = screenHeight;

    cvs.onmousemove = mouseMove;
    cvs.onclick = mouseClick;
    cvs.ondblclick = dblClick;
}

$(function(){
    initDom();
    init();
    initSocket();
    // return;
    // clear_pop();
    pop_test();
})
var pop_test = function(){
    var json_m = [ { 'time': '2012年2月18日'
                     , 'content': '第一条信息的内容呀第一条信息的内容呀第一条信息的内容呀'
                     , 'repost': 234234
                     , 'comment': 2342
                   }
                   , { 'time': '2012年3月3日'
                       , 'content': '第二条的内容'
                       , 'repost': 2344
                       , 'comment': 23
                     }]
    var dom_m = $(message_pop(json_m, 4));
    dom_m.css({ 'margin-top': '400px'
              , 'margin-left': '400px'
              , 'z-index': '50000'
              , 'opacity': 0.8
              });
    // $('#layer_pop').append(dom_m);

    var json_u =  { 'id': 234234234
                    , 'screen_name': '咣咣蛋包饭'
                    , 'profile_image_url': 'http://tp4.sinaimg.cn/1963516423/50/40001222013/0'
                    , 'description': '蛋包饭呀蛋包饭'
                    , 'followers_count': 234
                    , 'friends_count': 233242342
                    , 'statuses_count': 3324
                  }

    var html_u = user_pop(json_u, 4, 17);
    var dom_u = $(html_u);
    dom_u.css({ 'margin-top': '100px'
                , 'margin-left': '100px'
                , 'z-index': '50000'
                , 'opacity': 0.8
              });
    // $('#layer_pop').append(dom_u);

    var json_post = {
        'user': { 'id': 234234234
                , 'screen_name': '咣咣蛋包饭'
                , 'profile_image_url': 'http://tp4.sinaimg.cn/1963516423/50/40001222013/0'
                , 'description': '蛋包饭呀蛋包饭'
                , 'followers_count': 234
                , 'friends_count': 233242342
                , 'statuses_count': 3324
                },
        'text': '这里是消息正文'
    }
    var dom_post = $(post_pop(json_post, 1));
    dom_post.css({ 'margin-top': '30px'
                 , 'margin-left': '700px'
                 , 'z-index': '50000'
                 , 'opacity': 0.8
                 });
    // $('#layer_pop').append(dom_post);
    var json_repost = { 'create_at': 'X年X月'
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
    dom_repost.css({ 'margin-top': '200px'
                   , 'margin-left': '700px'
                   , 'z-index': '50000'
                   , 'opacity': 0.8
                 });
    // $('#layer_pop').append(dom_repost);
}
