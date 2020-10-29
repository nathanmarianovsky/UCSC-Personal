define(["jquery", "app/functions"], ($, functions) => {
	var exports = {};

	// Adds all necessary front-end listeners
	exports.add_listeners = (router, Plotly, math, Materialize) => {

		// Default route is designed to simply be a data collector
		router.addRouteListener("def", (toState, fromState) => {
			$("main").empty();
			$.get("/client/intro.html").done(function(intro) {
				$("main").append(intro);
				$.get("/client/main.html").done(function(result) {
					$("main").append(result);
					$(".indicator").hide();
					$("#myDiv").empty();
					$("select").material_select();
					Materialize.updateTextFields();
					functions.handle_links(router);
					functions.messageHandler(0);
					MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
				});
			});
		});


		router.addRouteListener("example", (toState, fromState) => {
			var num = parseInt(toState.params.num);
			$("main").empty();
			$(".indicator").show();
			$.get("/client/intro.html").done(function(intro) {
				$("main").append(intro);
				$.get("/client/example.html").done(function(result) {
					$("main").append(result);
					functions.messageHandler(0);
					$("#intro table tbody tr").hide();
					var str = "All of the following visualizations are associated" +
						" to the scenario where ";
					if(num == 1) {
						str += "$a = 1$ (horizontal stretch of the ellipse)," +
							" $b = 1$ (vertical stretch of the ellipse," +
							" $B_1 = 0$ (strength of the inner magnetic field)," +
							" $B_2 = 1$ (strength of the outer magnetic field)," + 
							" $\\mathbf{\\dot{x}}_{10} = -1$ (initial velocity" +
							" of electron in the $x_1$ direction)," +
							" $\\mathbf{\\dot{x}}_{20} = -1$ (initial velocity" +
							" of electron in the $x_2$ direction)," +
							" and $\\theta = 40^\\circ$ (initial angle for position" +
							" along the ellipse)."
					}
					else if(num == 2) {
						str += "$a = 1$ (horizontal stretch of the ellipse)," +
							" $b = 1$ (vertical stretch of the ellipse," +
							" $B_1 = 1$ (strength of the inner magnetic field)," +
							" $B_2 = 0$ (strength of the outer magnetic field)," + 
							" $\\mathbf{\\dot{x}}_{10} = -1$ (initial velocity" +
							" of electron in the $x_1$ direction)," +
							" $\\mathbf{\\dot{x}}_{20} = -1$ (initial velocity" +
							" of electron in the $x_2$ direction)," +
							" and $\\theta = 45^\\circ$ (initial angle for position" +
							" along the ellipse)."
					}
					else if(num == 3) {
						str += "$a = 1$ (horizontal stretch of the ellipse)," +
							" $b = 1$ (vertical stretch of the ellipse," +
							" $B_1 = 1.5$ (strength of the inner magnetic field)," +
							" $B_2 = \\infty$ (strength of the outer magnetic field)," + 
							" $\\mathbf{\\dot{x}}_{10} = -1$ (initial velocity" +
							" of electron in the $x_1$ direction)," +
							" $\\mathbf{\\dot{x}}_{20} = -1$ (initial velocity" +
							" of electron in the $x_2$ direction)," +
							" and $\\theta = 80^\\circ$ (initial angle for position" +
							" along the ellipse)."
					}
					else if(num == 4) {
						str += "$a = 1$ (horizontal stretch of the ellipse)," +
							" $b = 1$ (vertical stretch of the ellipse," +
							" $B_1 = 3$ (strength of the inner magnetic field)," +
							" $B_2 = 0.5$ (strength of the outer magnetic field)," + 
							" $\\mathbf{\\dot{x}}_{10} = -1$ (initial velocity" +
							" of electron in the $x_1$ direction)," +
							" $\\mathbf{\\dot{x}}_{20} = 0$ (initial velocity" +
							" of electron in the $x_2$ direction)," +
							" and $\\theta = 0^\\circ$ (initial angle for position" +
							" along the ellipse)."
					}
					else if(num == 5) {
						str += "$a = 1$ (horizontal stretch of the ellipse)," +
							" $b = 1$ (vertical stretch of the ellipse," +
							" $B_1 = \\infty$ (strength of the inner magnetic field)," +
							" $B_2 = 0.5$ (strength of the outer magnetic field)," + 
							" $\\mathbf{\\dot{x}}_{10} = -1$ (initial velocity" +
							" of electron in the $x_1$ direction)," +
							" $\\mathbf{\\dot{x}}_{20} = 1$ (initial velocity" +
							" of electron in the $x_2$ direction)," +
							" and $\\theta = 70^\\circ$ (initial angle for position" +
							" along the ellipse)."
					}
					else if(num == 6) {
						str += "$a = 1$ (horizontal stretch of the ellipse)," +
							" $b = 1$ (vertical stretch of the ellipse," +
							" $B_1 = \\infty$ (strength of the inner magnetic field)," +
							" $B_2 = -3$ (strength of the outer magnetic field)," + 
							" $\\mathbf{\\dot{x}}_{10} = -1$ (initial velocity" +
							" of electron in the $x_1$ direction)," +
							" $\\mathbf{\\dot{x}}_{20} = 0$ (initial velocity" +
							" of electron in the $x_2$ direction)," +
							" and $\\theta = 130^\\circ$ (initial angle for position" +
							" along the ellipse)."
					}
					else if(num == 7) {
						str += "$a = 2$ (horizontal stretch of the ellipse)," +
							" $b = 1$ (vertical stretch of the ellipse," +
							" $B_1 = 0$ (strength of the inner magnetic field)," +
							" $B_2 = \\infty$ (strength of the outer magnetic field)," + 
							" $\\mathbf{\\dot{x}}_{10} = -1$ (initial velocity" +
							" of electron in the $x_1$ direction)," +
							" $\\mathbf{\\dot{x}}_{20} = 2$ (initial velocity" +
							" of electron in the $x_2$ direction)," +
							" and $\\theta = 160^\\circ$ (initial angle for position" +
							" along the ellipse)."
					}
					else if(num == 8) {
						str += "$a = 2$ (horizontal stretch of the ellipse)," +
							" $b = 1$ (vertical stretch of the ellipse," +
							" $B_1 = 1$ (strength of the inner magnetic field)," +
							" $B_2 = \\infty$ (strength of the outer magnetic field)," + 
							" $\\mathbf{\\dot{x}}_{10} = -1$ (initial velocity" +
							" of electron in the $x_1$ direction)," +
							" $\\mathbf{\\dot{x}}_{20} = 3$ (initial velocity" +
							" of electron in the $x_2$ direction)," +
							" and $\\theta = 140^\\circ$ (initial angle for position" +
							" along the ellipse)."
					}
					else if(num == 9) {
						str += "$a = 3$ (horizontal stretch of the ellipse)," +
							" $b = 1$ (vertical stretch of the ellipse," +
							" $B_1 = -1$ (strength of the inner magnetic field)," +
							" $B_2 = -2$ (strength of the outer magnetic field)," + 
							" $\\mathbf{\\dot{x}}_{10} = -1$ (initial velocity" +
							" of electron in the $x_1$ direction)," +
							" $\\mathbf{\\dot{x}}_{20} = 1$ (initial velocity" +
							" of electron in the $x_2$ direction)," +
							" and $\\theta = 165^\\circ$ (initial angle for position" +
							" along the ellipse)."
					}
					else if(num == 10) {
						str += "$a = 3$ (horizontal stretch of the ellipse)," +
							" $b = 1$ (vertical stretch of the ellipse," +
							" $B_1 = 4$ (strength of the inner magnetic field)," +
							" $B_2 = 0$ (strength of the outer magnetic field)," + 
							" $\\mathbf{\\dot{x}}_{10} = -1$ (initial velocity" +
							" of electron in the $x_1$ direction)," +
							" $\\mathbf{\\dot{x}}_{20} = 1$ (initial velocity" +
							" of electron in the $x_2$ direction)," +
							" and $\\theta = 100^\\circ$ (initial angle for position" +
							" along the ellipse)."
					}
					$("#fill").append(str);

					for(var i = 1; i < 7; i++) {
						var prepare = "/client/img/example" + num + "/example" +
							num + "-" + i + ".png",
							image = $("<img>").attr("src", prepare).css({
								"border-bottom-left-radius": "15px",
								"border-bottom-right-radius": "15px"
							});
						var temp = "";
						if(i == 1) { temp = "15 Iterations"; }
						else if(i == 2) { temp = "25 Iterations"; }
						else if(i == 3) { temp = "50 Iterations"; }
						else if(i == 4) { temp = "75 Iterations"; }
						else if(i == 5) { temp = "125 Iterations"; }
						else if(i == 6) { temp = "200 Iterations"; }
						var title = $("<div>").text(temp).css({
								"height": "50px",
								"background-color": "white",
								"border-bottom": "0.8mm solid black",
								"border-top-left-radius": "15px",
								"border-top-right-radius": "15px",
								"text-align": "center",
								"line-height": "45px",
								"font-size": "18px"
							});
							bdy = $("<div>").append(title, image).css({
								"width": "707px",
								"height": "807px",
								"background-color": "white",
								"border": "1mm solid black",
								"border-radius": "15px",
								"margin": "0 auto 40px auto"
							});
						$("main").append(bdy);
					}

					MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
					functions.handle_links(router);
				});
			});
		});












		// This route takes in initial conditions and provides a visual of the trajectory
		router.addRouteListener("mod", (toState, fromState) => {
			$("main").empty();
			$.get("/client/intro.html").done(function(intro) {
				$("main").append(intro);
				$.get("/client/main.html").done(function(result) {
					$("main").append(result);
					functions.messageHandler(1);
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
					MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);

					// Initial Conditions
					var innerMagneticField = 0,
						outerMagneticField = 0;

					toState.params.inner == "Inf" ? innerMagneticField = Infinity
						: innerMagneticField = parseFloat(toState.params.inner);
					toState.params.outer == "Inf" ? outerMagneticField = Infinity
						: outerMagneticField = parseFloat(toState.params.outer);

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

					var scaleFactor = .5;
					if(outerMagneticField != 0 && outerMagneticField != Infinity) {
						scaleFactor *= (5 / math.abs(outerMagneticField));
					}
					else if(outerMagneticField == Infinity) {
						scaleFactor = 1;
					}

					// Prefill the table with the current data
					$("#variable1").val(a);
					$("#variable2").val(b);
					if(innerMagneticField == Infinity) {
						$("#innerInf").attr("checked", true);
						$("#variable3").val(null);
					}
					else {
						$("#innerInf").attr("checked", false);
						$("#variable3").val(innerMagneticField);
					}
					if(outerMagneticField == Infinity) {
						$("#outerInf").attr("checked", true);
						$("#variable4").val(null);
					}
					else {
						$("#outerInf").attr("checked", false);
						$("#variable4").val(outerMagneticField);
					}
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
						if(innerMagneticField != Infinity) {
							if(innerMagneticField == 0) {
								point = functions.plotting(point, math, a, b,
									iterX, iterY, innerMagneticField,
									outerMagneticField, scaleFactor, 0);
							}
							else {
								point = functions.magneticPlotting(point, math, a, b,
									iterX, iterY, innerScaling, innerMagneticField,
									outerMagneticField, 0);
							}
						}
						else if(i == 0) {
							var check = functions.evaluateTrajectoryStep(math.pow(10, -4),
								point.x, point.y, point.v_x, point.v_y);
							if(functions.checkRegion(check, a, b, math) == 0) {
								point.v_x *= -1;
								point.v_y *= -1;
							}
						}

						// Outer Dynamics
						if(outerMagneticField != Infinity) {
							if(outerMagneticField != 0) {
								point = functions.magneticPlotting(point, math, a, b,
									iterX, iterY, outerScaling, innerMagneticField,
									outerMagneticField, 1);
							}
							else {
								point = functions.plotting(point, math, a, b,
									iterX, iterY, innerMagneticField,
									outerMagneticField, scaleFactor, 1);
							}
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
						type: "scatter",
						mode: "lines",
						connectgaps: false
					};

					var data = [trace1, trace2];

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
			});
		});
	};

	return exports;
});