define(["jquery"], ($) => {
	var exports = {};

	exports.add_listeners = router => {
		router.addRouteListener("def", (toState, fromState) => {
			$.get("/client/content.html").done(data => {
				$("body").empty();
				$("body").append(data);
				$('select').material_select();
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
			});
		});
	};

	return exports;
});