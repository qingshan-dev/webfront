var marker = null;
var map = null;

$(document).ready(function(){
  initMap();
  
  $(".search-btn").click(function() {
    var location = $(".search-text").val();
    geoPosition(location);
    return false;
  });
});

//创建和初始化地图函数：
function initMap(){
  createMap();//创建地图
  setMapEvent();//设置地图事件
}

//创建地图函数：
function createMap(){
    map = new BMap.Map("allmap");
    locCity();
}

//根据经纬度进行定位
function setPosition(lng, lat){
  var point = new BMap.Point(lng, lat);
  map.centerAndZoom(point,19);
  var marker = new BMap.Marker(point);
  map.addOverlay(marker); 
}

//地图事件设置函数：
function setMapEvent(){
    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
    map.enableScrollWheelZoom();//启用地图滚轮放大缩小
    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard();//启用键盘上下左右键移动地图
    map.addEventListener("click", showInfo); //点击获取地图坐标
}

//向地图添加控件
function addMapControl(){

}

//向地图中添加marker
function addMarker(){

}

//点击获取地图坐标
function showInfo(e){
  map.removeOverlay(marker);
  $(".position").val(e.point.lng + ", " + e.point.lat);
  marker = new BMap.Marker(e.point);
  map.addOverlay(marker);
}

// 地址解析
function geoPosition(str){
  var myGeo = new BMap.Geocoder();
  // 将地址解析结果显示在地图上,并调整地图视野
  myGeo.getPoint(str, function(point){
    if (point) {
      $(".position").val(point.lng + ", " + point.lat);
      if(marker){
        map.removeOverlay(marker);
      }
      map.centerAndZoom(point, 16);
      marker = new BMap.Marker(point);
      map.addOverlay(marker);
    }
  }, "全国");
}

//IP定位获取当前城市
function locCity() {
  function myFun(result){
    var cityName = result.name;
    window.cityName = cityName;
    map.centerAndZoom(cityName,16);
  }
  var myCity = new BMap.LocalCity();
  myCity.get(myFun);
}
