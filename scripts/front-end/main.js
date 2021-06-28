define(["jquery", "materialize", "router5", "mathjax", "app/routes", "math", "app/functions"], ($, Materialize, router5, MathJax, routes, Math, functions) => {
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