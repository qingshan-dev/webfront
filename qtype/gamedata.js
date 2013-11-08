function numbers(count) {
  var data = [];
  for(var i = 0; i < count; i++) {
      data.push(i);
    }
  return data;
} 

var names = ["滕","波","涛","灰","敏","楠","宏","钟"];

var letters = ["t","h","e",
               "q","i","c","k",
               "b","r","w","n",
               "f","o","x",
               "j","u","m","p","s",
                "v",
               "l","a","z","y",
               "d","g"];

var phrases = [
  {
    "en":"The quick brown fox jumps over a lazy dog",
    "zh":"快速的棕色狐狸跳过一条懒狗"
  },
  {
    "en":"Pack my box with five dozen liquor jugs",
    "zh":"将五打酒瓶装在我的箱子里"
  },
  {
    "en":"The five boxing wizards jump quickly",
    "zh":"五个打拳的男巫快速跳动"
  },
  {
    "en":"Quick wafting zephyrs vex bold Jim",
    "zh":"疾风使勇敢的吉姆不知所措"
  },
  {
    "en":"Waltz nymph，for quick jigs vex Bud",
    "zh":"女神轻快的华尔滋舞步激怒了巴德"
  },
  {
    "en":"J．Q．Schwartz flung D．V．Pile my box",
    "zh":"J．Q．Schwartz向D．V． Pike挥动我的箱子"
  }
];

var people = [
  {"name": "ty", "avatar": "images/ty.jpg"},
  {"name": "zgxb", "avatar": "images/zgxb.jpg"},
  {"name": "wtj", "avatar": "images/wtj.jpg"},
  {"name": "zcy", "avatar": "images/zcy.jpg"},
  {"name": "zm", "avatar": "images/zm.jpg"},
  {"name": "hjh", "avatar": "images/hjh.jpg"},
  {"name": "xpf", "avatar": "images/xpf.jpg"},
  {"name": "lxl", "avatar": "images/lxl.jpg"},
  {"name": "zyn", "avatar": "images/zyn.gif"}
]

var netpath = [
{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" },
{ "mac":"98-4B-4A-29-0F-5E", "ip":"192.168.1.100", "name": "hjh", "dev":"moto" },
{ "mac":"0C-74-C2-70-08-A3", "ip":"192.168.1.101", "name": "wtj", "dev":"iphone" },
{ "mac":"1C-E6-2B-9C-D2-54", "ip":"192.168.1.102", "name": "qd", "dev":"pad-mini" },
{ "mac":"00-26-C6-4B-BF-86", "ip":"192.168.1.103", "name": "wtj", "dev":"t4h" },

{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" },
{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" },
{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" },
{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" },
{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" },
{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" },
{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" },
{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" },
{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" },
{ "mac":"00-15-99-A9-4B-BD", "ip":"192.168.1.10", "name": "qd", "dev":"printer" }

         
// 00-16-6D-D6-30-1C    192.168.1.104        zcy    coolpad
// 04-E5-36-0A-6B-95    192.168.1.105        qd    pad
// 8C-A9-82-61-CC-1A    192.168.1.106        ty    t40
// 8C-89-A5-50-D8-8D    192.168.1.107        xpf    pc
// 00-1B-B1-50-E8-5C    192.168.1.108        zcy    tf
// 0C-77-1A-6B-2A-B4    192.168.1.109        zgxb    iphone
// 00-23-4E-D4-4B-BD    192.168.1.111        zm    t4h
// 00-26-08-E0-BD-18    192.168.1.112        zgxb    mb
// 38-AA-3C-2B-0F-64    192.168.1.113        ty    galaxy
// 84-74-2A-FA-18-08    192.168.1.114        zm    zte
// 00-1B-B1-50-B2-DE    192.168.1.115        lxl    tf
// 30-39-26-DD-0C-A3    192.168.1.116        lxl    xpedia
// 6C-FD-B9-80-50-A5    192.168.1.117        hjh    s4of
// 00-22-68-19-99-A0    192.168.1.118        xxx    yyy
// 1C-65-9D-CF-08-B0    192.168.1.119        zyn    t410
// AC-F7-F3-8E-BC-67    192.168.1.120        zyn    xiaomi
]