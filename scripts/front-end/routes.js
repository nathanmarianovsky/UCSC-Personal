define(["jquery", "math", "app/functions"], ($, Math, functions) => {
	var exports = {};

	exports.add_listeners = router => {
		router.addRouteListener("def", (toState, fromState) => {
			// Grab the primary html content
			$.get("/client/content.html").done(data => {
				// Attach the primary html content and generate a canvas spiral
			 	var obj = functions.canvasSpiral(data);

			 	// Generate the hexagons and place them along the interior region of the spiral
			 	functions.hexPlacement(obj.denom, obj.pow, obj.centerx, obj.centery);

				// Load the modals for the "contact" and "about" links
		  		$(".modal-trigger").leanModal({
		  			dismissible: true,
					opacity: 2,
					inDuration: 500,
					outDuration: 500
		  		});

		  		$(window).resize(function() {
		  			// Attach the primary html content and generate a canvas spiral
				 	var obj = functions.canvasSpiral(data);

				 	// Generate the hexagons and place them along the interior region of the spiral
				 	functions.hexPlacement(obj.denom, obj.pow, obj.centerx, obj.centery);
		  		});
			});
		});
	};

	return exports;
});