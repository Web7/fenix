(function(){
	var classNames = {
		fxSlider: 'fx-slider'
	};

	var ids = {};

	var selectors = smart.buildSelectors(classNames, ids);

	$(function(){
		var $fxSlider = $(selectors.fxSlider);

		if ($fxSlider.exists()) {
			$fxSlider.slick({
				arrows: false,
				dots: true
			});
		}
	});
})();

(function(){
	$(document).ready (function(){
		$('.tool').tooltip();
	})
})();

(function(){
$(document).ready( function() {
    $("#fx-form-input").change(function(){
         var filename = $(this).val().replace(/.*\\/, "");
         $("#fx-form-name").val(filename);
    });
});
})();