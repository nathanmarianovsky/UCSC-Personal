// Define the necessary components
var express = require("express"),
	routes = require("./scripts/back-end/routes"),
	app = express(),
	cluster = require("cluster"),
	numCPUs = require("os").cpus().length;

// Tells the app to use the current directory as the default path
app.use(express.static(__dirname));

// Adds all of the routes
routes.add_routes(app);

// Tells the app to listen
if (cluster.isMaster) {
	for(var i = 0; i < numCPUs; i++) { cluster.fork(); }
	cluster.on("exit", (worker, code, signal) => { cluster.fork(); });
} 
else {
  	app.listen(80, () => {
		console.log("The server is now listening!");
	});
}