$(function(){
	var $lightboxThumbs = $("#lightbox-thumbs"),
		thumbsPerRow    = 5,
		totalThumbs,
		lightboxRows,
		
		$indiThumbs     = $("#individual-thumbs"),
		lightboxId      = $("#lightbox").attr("data-lightbox-id"),
		lightboxUrlRoot = "http://istockphoto.com/search/lightbox/";


	totalThumbs  = $lightboxThumbs.find('li').size(),
	lightboxRows = Math.ceil(totalThumbs/thumbsPerRow),
	exactRows    = totalThumbs % thumbsPerRow;

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
		min     : 1,
		max     : lightboxRows,
		value   : lightboxRows,
		animate : true,
		stop    : function(event, ui){
			var rowsToShow   = ui.value,
				thumbsToShow = ((rowsToShow-1)*thumbsPerRow) + thumbsPerRow-1;
			$lightboxThumbs
				.find("li").show().end()
				.find("li:gt(" + thumbsToShow + ")").hide();
			$("body").trigger('slider-lightbox-updated', rowsToShow);
		}
	});
	$("body").trigger('slider-lightbox-updated', lightboxRows);


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
		setTimeout(function(){ console.log($("canvas")[0].toDataURL()); }, 3000);
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
		min     : 1,
		max     : totalThumbs,
		value   : totalThumbs, 
		animate : true,
		stop    : function(event, ui){
			var thumbsToShow = ui.value; 
			$indiThumbs
				.find("li").show().end()
				.find("li:gt(" + (thumbsToShow-1) + ")").hide();
			$("body").trigger("indi-thumbs-updated", thumbsToShow);
		}
	});
	$("body").trigger('indi-thumbs-updated', totalThumbs);


	$("#thumbs-ubb").on("click", function(){
		$(this).get(0).select();
	});
});

