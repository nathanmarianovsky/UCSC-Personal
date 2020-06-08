define(["jquery", "materialize", "router5", "mathjax", "math", "Plotly", "app/routes"], ($, Materialize, router5, MathJax, math, Plotly, routes) => {
	$(function() {
		var router = new router5.Router5([
			new router5.RouteNode("def", "/")
		],{
			defaultRoute: "def"
		});
		routes.add_listeners(router, math, Plotly);
		router.start();
	});
});