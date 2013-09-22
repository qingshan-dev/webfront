var elem = $('div');
var count = elem.length;

var loop = function(){ 
  
  setTimeout(function(){
    elem.each(function(){
      var $this = $(this);
      var height = (Math.random() * 30) + 1;
      $this.css({
        'background': 'rgba(0, 0, 0,'+(.75-($this.index()/count)/2)+')',
        'bottom': height,
        'height': height
      });
    });
    loop();
  }, 300);
  
}
    
loop();