define(["jquery"], ($) => {
	var exports = {};

	exports.add_listeners = router => {
		router.addRouteListener("def", (toState, fromState) => {
			$.get("/client/content.html").done(data => {
				$("body").empty();
				$("body").append(data);
				$('select').material_select();
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);

				$(".notes_table > tbody > tr").hide();

				$(".notes_table > thead > tr").click(function() {
		       		$obj = $(this).closest(".notes_table").find("tbody > tr");
		       		$obj.slideToggle();
		    	});
		    	$(".modal-trigger").leanModal({
					dismissible: false,
					opacity: 2,
					inDuration: 1000,
					outDuration: 1000
				});
			});
		});
	};

	return exports;
});