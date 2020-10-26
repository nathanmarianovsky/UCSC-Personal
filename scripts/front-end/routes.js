define(["jquery", "app/functions"], ($, functions) => {
	var exports = {};

	// console.log(math);

	exports.add_listeners = (router, Plotly, math, Materialize) => {

		// Default route is designed to simply be a data collector
		router.addRouteListener("def", (toState, fromState) => {
			$("#myDiv").empty();
			$("select").material_select();
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
			Materialize.updateTextFields();
			functions.handle_links(router);
		});

		// This route takes in initial conditions and provides a visual of the trajectory
		router.addRouteListener("mod", (toState, fromState) => {
			$("#myDiv").remove();
			var myDiv = $("<div>").attr("id", "myDiv").css({
					"display": "flex",
					"align-items": "center",
					"justify-content": "center"
				}),
				wrapper = $("<div>").addClass("preloader-wrapper big active"),
				spinner = $("<div>").addClass("spinner-layer spinner-red-only"),
				clipper1 = $("<div>").addClass("circle-clipper left").append(
					$("<div>").addClass("circle")),
				patch = $("<div>").addClass("gap-patch").append(
					$("<div>").addClass("circle")),
				clipper2 = $("<div>").addClass("circle-clipper right").append(
					$("<div>").addClass("circle"));
			spinner.append(clipper1, patch, clipper2);
			wrapper.append(spinner);
			myDiv.append(wrapper);
			$("main").append(myDiv);
			$("select").material_select();
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);

			// Initial Conditions
			var theta = 0,
				a = math.abs(parseFloat(toState.params.hor)),
				b = math.abs(parseFloat(toState.params.ver)),
				max = math.max(a,b),
				param = 0,
				steps = 0,
				stop = 0,
				iterX = [],
				iterY = [],
				coefficientList = [],
				check = 0,
				mass = 1,
				charge = -1,
				innerMagneticField = parseFloat(toState.params.inner),
				outerMagneticField = parseFloat(toState.params.outer),
				outerScaling = (charge * outerMagneticField) / mass,
				innerScaling = (charge * innerMagneticField) / mass,
				velocity = functions.normalizeVector({
					x: math.bignumber(toState.params.vel1),
					y: math.bignumber(toState.params.vel2)
				});

			var point = {
				x: a * math.cos(math.bignumber(toState.params.angle) * (Math.PI / 180)),
				y: b * math.sin(math.bignumber(toState.params.angle) * (Math.PI / 180)),
				v_x: velocity.x,
				v_y: velocity.y
			};

			$("#variable1").val(a);
			$("#variable2").val(b);
			$("#variable3").val(innerMagneticField);
			$("#variable4").val(outerMagneticField);
			$("#variable5").val(toState.params.vel1);
			$("#variable6").val(toState.params.vel2);
			$("#variable7").val(toState.params.angle);
			$("#variable8").val(toState.params.iter);
			Materialize.updateTextFields();

			// Collecting Data

			// Add starting point
			iterX.push(point.x);
			iterY.push(point.y);

			for(var i = 0; i < parseInt(toState.params.iter); i++) {
				// Inner Dynamics
				if(innerMagneticField == 0) {
					point = functions.plotting(point, math, a, b,
						iterX, iterY, outerMagneticField);
				}
				else {
					point = functions.magneticPlotting(point, math, a, b,
						iterX, iterY, innerScaling, outerMagneticField, 0);
				}

				// Outer Dynamics
				if(outerMagneticField != 0) {
					point = functions.magneticPlotting(point, math, a, b,
						iterX, iterY, outerScaling, outerMagneticField, 1);
				}
			}

			// Plotting Data

			var arrX = [],
				arrY = [],
				top = math.evaluate(2 * math.pi);

			for(var i = 0; i < top; i += 0.01) {
				arrX.push(a * math.cos(i));
				arrY.push(b * math.sin(i));
			}

			var trace1 = {
			  	x: arrX,
			  	y: arrY,
			 	name: "Ellipse",
			  	type: "scatter"
			};

			var trace2 = {
				x: iterX,
				y: iterY,
				name: "Trajectory",
				type: "scatter"
			};

			var data = [trace1, trace2];

			var scaleFactor = .5;
			if(outerMagneticField != 0) { scaleFactor *= (5 / outerMagneticField); }

			var layout = {
			  	grid: {rows: 1, columns: 1, pattern: 'independent'},
			  	showlegend: false,
			  	xaxis: {range: [-(max + scaleFactor), max + scaleFactor]},
	  			yaxis: {range: [-(max + scaleFactor), max + scaleFactor]}
			};

			$("#myDiv").remove();
			myDiv = $("<div>").attr("id", "myDiv").css({
				"margin": "0 auto",
				"width": "700px",
				"height": "700px" 
			});
			$("main").append(myDiv);
			Plotly.newPlot("myDiv", data, layout, {scrollZoom: true, responsive: true});
			$("#myDiv").children().first().children().first().children().first().css({
				"border-style": "solid",
				"border-radius": "100px"
			});

			functions.handle_links(router);
		});
	};

	return exports;
});