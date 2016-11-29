// Define the necessary components
var express = require("express"),
	routes = require("./scripts/back-end/routes"),
	app = express();

// Tells the app to use the current directory as the default path
app.use(express.static(__dirname));

// Adds all of the routes
routes.add_routes(app);

// Tells the app to listen
app.listen(80, () => {
	console.log("The server is now listening!");
});