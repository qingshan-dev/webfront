$(document).ready(function(){

	/* set time count */
	// countdown(5);

	/* parallax effect */
	$("body").mousemove(function(e){
		var dx = 0, dy = 0;

		if(e.pageX) {
			dx = e.pageX*0.01;
		}
		if(e.pageY) {
			dy = e.pageY*0.01;
		}

		/* quser-notfound */
		if(".parallax-qer"){
			$(".parallax-qer").css("left", dx);
			$(".parallax-qer").css("top", dy);

			$(".parallax-quser").css("left", -dx);
			$(".parallax-quser").css("top", -dy);
		}

		/* qpage-notfound */
		if(".parallax-qpoints"){
			$(".parallax-qpoints").css("left", dx);
			$(".parallax-qpoints").css("top", dy);

			$(".parallax-noqd").css("bottom", -dy);
		}

		/* q404 & q50x*/
		if(".cloud") {
			// var left = $(".cloud").css();
			$(".cloud").css("left", -dx);
			$(".cloud").css("top", -dy);

			$(".img-tip").css("left", dx-10);
			$(".img-tip").css("bottom", dy);
		}

	});	
	
});


function countdown(i){
	$(".timer").html(i);
	if(i==0){
		window.location.href='http://qudian.so';
	}else{
		i--;
		setTimeout("countdown(" + i + ")",1000);
	}
}