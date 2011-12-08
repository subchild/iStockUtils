$(function(){
	var $lightboxThumbs = $("#lightbox-thumbs"),
		thumbsPerRow    = 5,
		lightboxRows    = Math.floor($lightboxThumbs.find("li").size()/thumbsPerRow),
		lightboxStep    = 100/lightboxRows,

		$indiThumbs = $("#individual-thumbs"),
		totalThumbs = $indiThumbs.find("li").size(),
		thumbsStep  = 100/totalThumbs;
		
	$lightboxThumbs.sortable({
		opacity: 0.5	
	});

	/**
	 * @TODO Correct max value when exact
	 */
	$("#slider-lightbox-rows").slider({
		step  : lightboxStep, 
		value : lightboxRows*lightboxStep,
		stop  : function(event, ui){
			var rowsToShow = ui.value/lightboxStep;
			$lightboxThumbs
				.find("li").show().end()
				.find("li:gt(" + ((rowsToShow*thumbsPerRow) + thumbsPerRow-1) + ")").hide();
			$("#slider-label-lightbox-rows span").text(rowsToShow+1);
		}
	});
	$("#slider-label-lightbox-rows span").text(lightboxStep+1);

	$("#generate-image").on("click", function(){
		$("#lightbox").html2canvas({renderViewport:'true'});
		setTimeout(function(){
			console.log($("canvas")[0].toDataURL());
		}, 3000);
	});

	$("#individual-thumbs").sortable({
		opacity: 0.5,
		update: function(event, ui){
			// update UBB	
			var ubb = '';
			$(ui.item).parent().children().each(function(i, el){
				ubb += $(el).attr('data-ubb');
			});
			$('#thumbs-ubb').val(ubb);
		}
	});
	/**
	 * @TODO Prevent zero
	 * @TODO Fix largest value
	 * @TODO Adjust UBB value - make separate method
	 */
	$("#slider-thumb-count").slider({
		step  : thumbsStep,
		value : totalThumbs*thumbsStep, 
		stop  : function(event, ui){
			$indiThumbs
				.find("li").show().end()
				.find("li:gt(" + ui.value/thumbsStep + ")").hide();
			$("#slider-label-thumb-count span").text(ui.value/thumbsStep);
		}
	});
	$("#thumbs-ubb").on("click", function(){
		$(this).get(0).select();
	});
});

