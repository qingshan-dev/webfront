if(Modernizr.csstransforms3d) {
  $('.cube-switch .switch').click(function(){
    if($('.cube').hasClass('spin') && $('.cube-switch').hasClass('active')){
      $('.cube-switch').removeClass('active');
      $('.cube').removeClass('spin');
    } else {
      $('.cube-switch').addClass('active');
      $('.cube').addClass('spin');
    }
  });
}