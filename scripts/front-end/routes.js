define(["jquery", "app/functions"], ($, functions) => {
	var exports = {};

	// console.log(math);

	exports.add_listeners = (router, Plotly, math) => {

		// console.log(math);

		router.addRouteListener("mod", (toState, fromState) => {
			$('select').material_select();
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
				velocity = functions.normalizeVector({x: math.bignumber(toState.params.vel1), y: math.bignumber(toState.params.vel2)});

			console.log(max);

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

			// console.log(parseFloat(toState.params.vel1))

			// console.log("point:");
			// console.log(point);

			// Collecting Data

			// Add starting point
			iterX.push(point.x);
			iterY.push(point.y);

			for(var i = 0; i < parseInt(toState.params.iter); i++) {
				// console.log(i);

				if(innerMagneticField == 0) {
					// Evaluate inner trajectory and add to the list
					if(outerMagneticField == 0) {
						point = functions.evaluateTrajectory(point.x,point.y,point.v_x,point.v_y,a,b);
						iterX.push(point.x);
						iterY.push(point.y);
						point = functions.reflectTrajectory(point.x, point.y, point.v_x, point.v_y, a, b);
					}
					else {
						check = functions.evaluateTrajectoryStep(math.pow(10, -4), point.x, point.y, point.v_x, point.v_y)
						// console.log(functions.checkRegion(check, a, b));
						if(functions.checkRegion(check, a, b) == 0) {
							while(functions.checkRegion(point, a, b) == 0) {
								point = functions.evaluateTrajectoryStep(math.pow(10, -4), point.x, point.y, point.v_x, point.v_y)
								iterX.push(point.x);
								iterY.push(point.y);
							}
						}
					}
				}
				else {
					// // Generates the list of coefficients used for a single magnetic trajectory
					// coefficientList = functions.evaluateCoefficients(point.x,point.y,point.v_x,point.v_y);

					// // Resets the start time for the magnetic trajectory
					// param = 0;

					// // A point used to determine whether traveling in positive time lands in the exterior or interior of a region
					// check = functions.evaluateMagneticTrajectory(math.pow(10, -4),
					// 	coefficientList[0], coefficientList[1], coefficientList[2],
					// 	coefficientList[3], outerScaling);
					
					// // Keep count of the number of steps to break out when necessary
					// steps = 0;

					// // Evaluate outer trajectory and add to the list
					// if(functions.checkRegion(check,a,b) == 0) {
					// 	while(functions.checkRegion(point,a,b) == 0) {
					// 		if(steps >= math.pow(10, 4)) { break; }
					// 		else { steps++; }
					// 		param += math.pow(10, -4);
					// 		point = functions.evaluateMagneticTrajectory(param,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],innerScaling);
					// 		iterX.push(point.x);
					// 		iterY.push(point.y);
					// 	}
					// }
					// else {
					// 	while(functions.checkRegion(point,a,b) == 0) {
					// 		if(steps >= math.pow(10, 4)) { break; }
					// 		else { steps++; }
					// 		param -= math.pow(10, -4);
					// 		point = functions.evaluateMagneticTrajectory(param,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],innerScaling);
					// 		iterX.push(point.x);
					// 		iterY.push(point.y);
					// 	}
					// }
					// if(outerMagneticField == 0) {
					// 	point = functions.reflectTrajectory(point.x, point.y, point.v_x, point.v_y, a, b);
					// }
					point = functions.magneticPlotting(point, math, a, b, iterX, iterY, innerScaling, outerMagneticField, 0);
;				}






				if(outerMagneticField != 0) {
					// // Generates the list of coefficients used for a single magnetic trajectory
					// coefficientList = functions.evaluateCoefficients(point.x,point.y,point.v_x,point.v_y);

					// // Resets the start time for the magnetic trajectory
					// param = 0;

					// // A point used to determine whether traveling in positive time lands in the exterior or interior of a region
					// check = functions.evaluateMagneticTrajectory(math.pow(10, -4),
					// 	coefficientList[0], coefficientList[1], coefficientList[2],
					// 	coefficientList[3], outerScaling);
					
					// // Keep count of the number of steps to break out when necessary
					// steps = 0;

					// // Evaluate outer trajectory and add to the list
					// if(functions.checkRegion(check,a,b) == 1) {
					// 	// while(param <= stop) {
					// 	while(functions.checkRegion(point,a,b) == 1) {
					// 		if(steps >= math.pow(10,4)) { break; }
					// 		else { steps++; }
					// 		param += math.pow(10, -4);
					// 		point = functions.evaluateMagneticTrajectory(param,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],outerScaling);
					// 		iterX.push(point.x);
					// 		iterY.push(point.y);
					// 	}
					// }
					// else {
					// 	while(functions.checkRegion(point,a,b) == 1) {
					// 		if(steps >= math.pow(10,4)) { break; }
					// 		else { steps++; }
					// 		param -= math.pow(10, -4);
					// 		point = functions.evaluateMagneticTrajectory(param,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],outerScaling);
					// 		iterX.push(point.x);
					// 		iterY.push(point.y);
					// 	}
					// }
					point = functions.magneticPlotting(point, math, a, b, iterX, iterY, outerScaling, outerMagneticField, 1);
				}
			}

			// Plotting Data

			var arrX = [],
				arrY = [];

			for(var i = 0; i < math.evaluate(2 * math.pi); i += 0.01) {
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

			var data = [trace1,trace2];

			var scaleFactor = .5;
			if(outerMagneticField != 0) { scaleFactor *= (3 / outerMagneticField); }

			var layout = {
			  	grid: {rows: 1, columns: 1, pattern: 'independent'},
			  	showlegend: false,
			  	xaxis: {range: [-(max + scaleFactor), max + scaleFactor]},
	  			yaxis: {range: [-(max + scaleFactor), max + scaleFactor]}
			};

			console.log("all the way at the end");

			Plotly.newPlot('myDiv', data, layout, {scrollZoom: true, responsive: true});
			$("#myDiv").children().first().children().first().children().first().css({
				"border-style": "solid",
				"border-radius": "100px"
			});

			functions.handle_links(router);

		});












		router.addRouteListener("def", (toState, fromState) => {
			$('select').material_select();
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);

			console.log(math);

			// Initial Conditions

			var theta = 0,
				a = 1,
				b = 1,
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
				outerMagneticField = 1,
				innerMagneticField = -1,
				outerScaling = (charge * outerMagneticField) / mass,
				innerScaling = (charge * innerMagneticField) / mass,
				velocity = functions.normalizeVector({x: -1, y: -1, v_x: 0, v_y: 0});

			var point = {x: a * math.cos(theta), y: b * math.sin(theta), v_x: velocity.x, v_y: velocity.y};

			// Collecting Data

			// Add starting point
			iterX.push(point.x);
			iterY.push(point.y);

			for(var i = 0; i < 15; i++) {
				// Evaluate inner trajectory and add to the list
				// point = functions.evaluateTrajectory(point.x,point.y,point.v_x,point.v_y,a,b);
				// iterX.push(point.x);
				// iterY.push(point.y);


				// Generates the list of coefficients used for a single magnetic trajectory
				coefficientList = functions.evaluateCoefficients(point.x,point.y,point.v_x,point.v_y);

				// The bisection method provides an approximation as to where a magnetic arc should stop, i.e. along the intersection
				// stop = functions.bisection([.05,5.8],functions.magneticFunction,math.pow(10,-15),coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],innerScaling,a,b);
				// console.log("here2");
				// console.log(stop);

				// Resets the start time for the magnetic trajectory
				param = 0;

				// A point used to determine whether traveling in positive time lands in the exterior or interior of a region
				// check = evaluateMagneticTrajectory(stop / 2,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],innerScaling);
				check = functions.evaluateMagneticTrajectory(.01, coefficientList[0], coefficientList[1], coefficientList[2], coefficientList[3], innerScaling);

				steps = 0;

				// Evaluate outer trajectory and add to the list
				if(functions.checkRegion(check,a,b) == 0) {
					while(functions.checkRegion(point,a,b) == 0) {
						if(steps >= math.pow(10, 4)) { break; }
						else { steps++; }
						param += .01;
						point = functions.evaluateMagneticTrajectory(param,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],innerScaling);
						iterX.push(point.x);
						iterY.push(point.y);
					}
				}
				else {
					while(functions.checkRegion(point,a,b) == 0) {
						if(steps >= math.pow(10, 4)) { break; }
						else { steps++; }
						param -= .01;
						point = functions.evaluateMagneticTrajectory(param,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],innerScaling);
						iterX.push(point.x);
						iterY.push(point.y);
					}
				}





				// Generates the list of coefficients used for a single magnetic trajectory
				coefficientList = functions.evaluateCoefficients(point.x,point.y,point.v_x,point.v_y);

				// The bisection method provides an approximation as to where a magnetic arc should stop, i.e. along the intersection
				// stop = functions.bisection([.01,6],functions.magneticFunction,math.pow(10,-15),coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],outerScaling,a,b);
				// console.log("bisecting over here brah");

				// Resets the start time for the magnetic trajectory
				param = 0;

				// A point used to determine whether traveling in positive time lands in the exterior or interior of a region
				// check = evaluateMagneticTrajectory(stop / 2,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],outerScaling);
				check = functions.evaluateMagneticTrajectory(.01,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],outerScaling);
				
				steps = 0;

				// Evaluate outer trajectory and add to the list
				if(functions.checkRegion(check,a,b) == 1) {
					// while(param <= stop) {
					while(functions.checkRegion(point,a,b) == 1) {
						if(steps >= math.pow(10,4)) { break; }
						else { steps++; }
						param += .01;
						point = functions.evaluateMagneticTrajectory(param,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],outerScaling);
						iterX.push(point.x);
						iterY.push(point.y);
					}
				}
				else {
					// while(stop - (2 * math.pi) <= param) {
					while(functions.checkRegion(point,a,b) == 1) {
						if(steps >= math.pow(10,4)) { break; }
						else { steps++; }
						param -= .01;
						point = functions.evaluateMagneticTrajectory(param,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],outerScaling);
						iterX.push(point.x);
						iterY.push(point.y);
					}
				}
			}

			console.log("about to plot brah");

			// Plotting Data

			var arrX = [],
				arrY = [];

			for(var i = 0; i < math.evaluate(2 * math.pi); i += 0.01) {
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

			var data = [trace1,trace2];

			var layout = {
			  	grid: {rows: 1, columns: 1, pattern: 'independent'},
			  	showlegend: false,
			  	xaxis: {range: [-(max + 2), max + 2]},
	  			yaxis: {range: [-(max + 2), max + 2]}
			};

			console.log("all the way at the end");

			Plotly.newPlot('myDiv', data, layout, {scrollZoom: true, responsive: true});
			$("#myDiv").children().first().children().first().children().first().css({
				"border-style": "solid",
				"border-radius": "100px"
			});

			

		});
















	};

	return exports;
});