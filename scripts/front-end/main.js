define(["jquery", "materialize", "router5", "mathjax", "app/routes", "math"], ($, Materialize, router5, MathJax, routes, Math) => {
	$(function() {
		var router = new router5.Router5([
			new router5.RouteNode("def", "/")
		],{
			defaultRoute: "def"
		});
		routes.add_listeners(router);
		router.start();
	});
});