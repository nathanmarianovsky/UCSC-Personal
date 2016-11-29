var exports = {};

// Adds all of the client routes
exports.add_routes = app => {
	// Default url
	app.get("/", (request, response) => {
		response.sendFile("./client/template.html", { "root": "./" });
	});
};

module.exports = exports;