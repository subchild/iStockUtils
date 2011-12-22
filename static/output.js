$(function(){
	var $lightboxThumbs = $("#lightbox-thumbs"),
		totalThumbs     = $lightboxThumbs.find('li').size(),
		thumbsPerRow    = 5,
		lightboxRows    = Math.floor(totalThumbs/thumbsPerRow),
		lightboxStep    = 100/lightboxRows,

		$indiThumbs = $("#individual-thumbs"),
		thumbsStep  = 100/totalThumbs,

		lightboxId      = $("#lightbox").attr("data-lightbox-id"),
		lightboxUrlRoot = "http://istockphoto.com/search/lightbox/";
	
	$lightboxThumbs.sortable({
		opacity: 0.5	
	});

	$("body")
		.bind("slider-lightbox-updated", function(event, count){
			$("#slider-label-lightbox-rows span").text(count);
		})
		.bind("indi-thumbs-updated", function(event, count){
			var ubb = '';
			$indiThumbs.children(":visible").each(function(i, el){
				ubb += $(el).attr('data-ubb');
			});
			$('#thumbs-ubb').val(ubb);
			$("#slider-label-thumb-count span").text(count);
		});


	/**
	 * @TODO Correct max value when exact
	 */
	$("#slider-lightbox-rows").slider({
		step  : lightboxStep, 
		value : lightboxRows*lightboxStep,
		stop  : function(event, ui){
			var rowsToShow   = ui.value/lightboxStep,
				thumbsToShow = (rowsToShow*thumbsPerRow) + thumbsPerRow-1;
			$lightboxThumbs
				.find("li").show().end()
				.find("li:gt(" + thumbsToShow + ")").hide();
			$("body").trigger('slider-lightbox-updated', rowsToShow+1);
		}
	});
	$("body").trigger('slider-lightbox-updated', lightboxRows+1);


	$("#lightbox-ubb")
		.val("[url="+ lightboxUrlRoot + lightboxId +"][img]IMAGESRC[/img][/url]")
		.on("click", function(){
			// @TODO Highlight word IMAGESRC
		});


	/**	
	 * @TODO If enabling this:
	 * - Make a service for converting to png (potentially even serving it)
	 * - Try creating UBB code with data-uri (won't work on all browsers; IE only supports via CSS)
	 */
	$("#generate-image").on("click", function(){
		$("#lightbox").html2canvas({renderViewport:'true'});
		setTimeout(function(){
			console.log($("canvas")[0].toDataURL());
		}, 3000);
	});


	$("#individual-thumbs").sortable({
		opacity: 0.5,
		update: function(event, ui){
			$("body").trigger("indi-thumbs-updated");
		}
	});

	/**
	 * @TODO Prevent zero
	 * @TODO Fix largest value
	 */
	$("#slider-thumb-count").slider({
		step  : thumbsStep,
		value : totalThumbs*thumbsStep, 
		stop  : function(event, ui){
			var thumbsToShow = Math.floor(ui.value/thumbsStep); 
			$indiThumbs
				.find("li").show().end()
				.find("li:gt(" + thumbsToShow + ")").hide();
			$("body").trigger("indi-thumbs-updated", thumbsToShow+1);
		}
	});
	$("body").trigger('indi-thumbs-updated', totalThumbs);

	$("#thumbs-ubb").on("click", function(){
		$(this).get(0).select();
	});
});

