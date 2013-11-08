$(document).ready(function () {
  var angle = 0;

  $(".transformed").click(function(){
      startRound(angle);
  });
});

function startRound(angle){
  setInterval(function(){
    angle++;
    if(angle>360){
      return false;
    }
    if((angle%360) >= 90 && (angle%360) <= 270) {
      $(".transformed").css("background","blue");
    }
    else{
     $(".transformed").css("background","black"); 
    }
    $(".transformed").css("webkit-transform","rotateY("+angle+"deg)");
    $(".child").css("webkit-transform","rotateX("+angle+"deg)");
  },1);
}
 

