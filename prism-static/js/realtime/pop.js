var user_pop = function(json_u, class_u, num){
    var post_type_list = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'];
    json_u['class'] = post_type_list[class_u];
    json_u['tweets_num'] = num;
    d_u = [ '<div class="{{ class }}">'
          , '    <div class="u_pic">'
          , '        <img src="{{ profile_image_url }}" class="img-polaroid"/>'
          , '    </div>'
          , '    <div class="u_name">'
          , '        <h3> {{ screen_name }}  </h3>'
          , '    </div>'
          , '    <div class="u_count">'
          , '        <h4><small> 关注:&nbsp; {{ friends }}&nbsp; 粉丝:&nbsp; {{ followers }}&nbsp; 微博:&nbsp; {{ statuses_count }} </small></h4>'
          , '    </div>'
          , '    <div class="u_description">'
          , '        <div><small>简介：</small>{{ description }}</div>'
          , '    </div>'
          , '    <div class="u_post_count">'
          , '        <div>更新微博<small>&nbsp;{{ tweets_num }}&nbsp;</small>条</div>'
          , '    </div>'
          , '</div>'
          ].join('');
    return Mustache.render(d_u, json_u);
}

var message_pop = function(json_list, type_m){
    console.log("falood: DEBUG", json_list);
    var message_type_list = [ { 'type_name': '生活'
                              , 'type_logo': 'ϖ'
                              , 'class': 'm1'
                              }
                            , { 'type_name': '科技'
                              , 'type_logo': 'Ω'
                              , 'class': 'm2'
                              }
                            , { 'type_name': '情感'
                              , 'type_logo': '♥'
                              , 'class': 'm3'
                              }
                            , { 'type_name': '广告'
                              , 'type_logo': '∅'
                              , 'class': 'm4'
                              }
                            , { 'type_name': '商政'
                              , 'type_logo': '$'
                              , 'class': 'm5'
                              }
                            , { 'type_name': '其它'
                              , 'type_logo': 'Θ'
                              , 'class': 'm6'
                              }];
    var randomid = function(){
        return 'msg-xxxxxxxxxxxxxxxx'.replace(/x/g, function(c){
            return (Math.random()*16|0).toString(16);
        })
    }
    json_list[0]['first'] = true;
    json_m = { 'msgid': randomid()
             , 'm_list': json_list};
    if (json_list.length > 1){
        json_m['slide'] = true;
    };
    var json_m = $.extend(json_m, message_type_list[type_m]);
    d_m = [ '<div class="{{ class }}">'
          , '    <div class="m_line"> </div>'
          , '    <div class="m_type_logo"> {{ type_logo }} </div>'
          , '    <div class="m_name">'
          , '         <small> {{ type_name }} </small>'
          , '    </div>'
          , '    <div id="{{ msgid }}" class="carousel slide m_slide">'
          , '        <div class="carousel-inner m_carousel-inner">'
          , '            {{#m_list}}'
          , '            <div class="{{#first}}active {{/first}}item m_item">'
          , '                <div class="m_time">'
          , '                     <small>'
          , '                         {{# time }} {{ time }} {{/ time }}'
          , '                         {{^ time }} &nbsp; {{/ time }}'
          , '                     </small>'
          , '                </div>'
          , '                <div class="m_content">'
          , '                      {{# content }} {{ content }} {{/ content }}'
          , '                      {{^ content }} 转发微博 {{/ content }}'
          , '                </div>'
          , '                <div class="m_post_count">'
          , '                      <small> 转发&nbsp;{{ repost }} | 评论&nbsp;{{ comment }} </small>'
          , '                </div>'
          , '            </div>'
          , '            {{/m_list}}'
          , '        </div>'
          , '        {{ #slide }}'
          , '        <a class="m_control m_left" href="#{{ msgid }}" data-slide="prev">&lsaquo;</a>'
          , '        <a class="m_control m_right" href="#{{ msgid }}" data-slide="next">&rsaquo;</a>'
          , '        {{ /slide }}'
          , '    </div>'
          , '</div>'
          ].join('');
    return Mustache.render(d_m, json_m);
}

var post_pop = function(json_p, class_p){
    var post_type_list = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
    json_p['class'] = post_type_list[class_p];
    d_p = ['<div class="{{ class }}">'
          ,'    <div class="p_pic">'
          ,'        <img src="{{ user.profile_image_url }}" class="img-polaroid"/>'
          ,'    </div>'
          ,'    <div class="p_content">'
          ,'        <div><small>{{ user.screen_name }}：</small>{{ text }}</div>'
          ,'    </div>'
          , '</div>'
          ].join('');
    return Mustache.render(d_p, json_p);
}

var repost_pop = function(json_rp, class_rp){
    var repost_type_list = ['rp1', 'rp2', 'rp3', 'rp4', 'rp5', 'rp6'];
    json_rp['class'] = repost_type_list[class_rp];
    d_rp = [ '<div class="{{ class }}">'
          , '    <div class="rp_pic">'
          , '        <img src="{{ user.profile_image_url }}" class="img-polaroid"/>'
          , '    </div>'
          , '    <div class="rp_name">'
          , '        <h3> {{ user.screen_name }}  </h3>'
          , '    </div>'
          , '    <div class="rp_count">'
          , '        <h4><small> 关注:&nbsp; {{ user.friends_count }}&nbsp; 粉丝:&nbsp; {{ user.followers_count }}&nbsp; 微博:&nbsp; {{ user.statuses_count }} </small></h4>'
          , '    </div>'
          , '    <div class="rp_content">'
          , '        <div>{{ text }}</div>'
          , '    </div>'
          , '    <div class="rp_time">'
          , '          <small> {{ create_at }} </small>'
          , '    </div>'
          , '    <div class="rp_post_count">'
          , '          <small> 转发&nbsp;{{ reposts_count }} | 评论&nbsp;{{ comments_count }} </small>'
          , '    </div>'
          , '</div>'
          ].join('');
    return Mustache.render(d_rp, json_rp);
}
var  clear_pop = function(){
    $('#layer_pop').empty();
}

