define(["jquery"], ($) => {
	var exports = {};

	exports.add_listeners = (router, math, Plotly) => {
		router.addRouteListener("def", (toState, fromState) => {
			$('select').material_select();
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);



			// Functions

			// Returns the dot product of vectors v and w
			function dotProduct(v,w) {
				return (v.x * w.x) + (v.y * w.y);
			}

			// Normalizes a given vector v
			function normalizeVector(v) {
				var firstComponent = v.x / math.sqrt(dotProduct(v,v)),
					secondComponent = v.y / math.sqrt(dotProduct(v,v));
				return {x: firstComponent, y: secondComponent, v_x: v.v_x, v_y: v.v_y};
			}

			// The bisection method returns an approximation of a root given an interval that contains it
			function bisection(interval,func,err,A,B,C,D,K,xLength,yLength) {
				var attempt = (interval[0] + interval[1]) / 2,
					evaluation = func(attempt,A,B,C,D,K,xLength,yLength);
				while(math.abs(evaluation) > err) {
					if(func(interval[0],A,B,C,D,K,xLength,yLength) > 0 && func(interval[1],A,B,C,D,K,xLength,yLength) < 0) {
						if(evaluation > 0) {
							interval[0] = attempt;
						}
						else {
							interval[1] = attempt;
						}
					}
					else if(func(interval[0],A,B,C,D,K,xLength,yLength) < 0 && func(interval[1],A,B,C,D,K,xLength,yLength) > 0) {
						if(evaluation > 0) {
							interval[1] = attempt;
						}
						else {
							interval[0] = attempt;
						}
					}
					attempt = (interval[0] + interval[1]) / 2;
					evaluation = func(attempt,A,B,C,D,K,xLength,yLength);
				}
				return attempt;
			}

			// Returns the coefficients for the trajectory carved out due to the magnetic field
			function evaluateCoefficients(x_1,x_2,v_1,v_2) {
				return [x_1,v_1,x_2,v_2];
			}

			// Given the coefficients of the magnetic trajectory this returns a point on the trajectory at time t
			function evaluateMagneticTrajectory(t,A,B,C,D,K) {
				var value1 = math.sin(t),
					value2 = math.cos(t),
					firstComponent = A + ((B / K) * value1) + ((D / K) * (1 - value2)),
					secondComponent = C + ((D / K) * value1) + ((B / K) * (value2 - 1)),
					firstVelocityComponent = (B * value2) + (D * value1),
					secondVelocityComponent = (D * value2) - (B * value1);
				return {x: firstComponent, y: secondComponent, v_x: firstVelocityComponent, v_y: secondVelocityComponent};
			}

			// Given a point and velocity this returns the point on the boundary along which a particle travels a straight line to reach
			function evaluateTrajectory(x_1,x_2,v_1,v_2,xLength,yLength) {
				var value1 = (math.pow(v_1,2) / math.pow(xLength,2)) + (math.pow(v_2,2) / math.pow(yLength,2)),
					value2 = ((x_1 * v_1) / math.pow(xLength,2)) + ((x_2 * v_2) / math.pow(yLength,2)),
					intersectionTime = (-2 * value2) / value1,
					firstComponent = (intersectionTime * v_1) + x_1,
					secondComponent = (intersectionTime * v_2) + x_2
				return {x: firstComponent, y: secondComponent, v_x: v_1, v_y: v_2};
			}

			// This represents the implicit function assocaited to the ellipse and is used by the bisection method to determine its roots
			function magneticFunction(t,A,B,C,D,K,xLength,yLength) {
				var value1 = math.sin(t),
					value2 = math.cos(t),
					firstComponent = A + ((B / K) * value1) + ((D / K) * (1 - value2)),
					secondComponent = C + ((D / K) * value1) + ((B / K) * (value2 - 1));
				return math.pow(firstComponent / xLength,2) + math.pow(secondComponent / yLength,2) - 1;
			}

			// Checks whether a given point is outside the ellipse
			function checkRegion(info,xLength,yLength) {
				return math.pow(info.x / xLength,2) + math.pow(info.y / yLength,2) > 1 ? 1 : 0;
			}



			// Initial Conditions

			var theta = 3 * math.pi / 2,
				a = 1,
				b = 1,
				max = math.max(a,b);
				param = 0,
				stop = 0,
				iterX = [],
				iterY = [],
				coefficientList = [],
				check = 0,
				mass = 1,
				charge = 1,
				magneticField = 1,
				scaling = (charge * magneticField) / mass,
				velocity = normalizeVector({x: 1, y: .5, v_x: 0, v_y: 0});

			var point = {x: a * math.cos(theta), y: b * math.sin(theta), v_x: velocity.x, v_y: velocity.y};



			// Collecting Data

			// Add starting point
			iterX.push(point.x);
			iterY.push(point.y);

			for(var i = 0; i < 50; i++) {
				// Evaluate inner trajectory and add to the list
				point = evaluateTrajectory(point.x,point.y,point.v_x,point.v_y,a,b);
				iterX.push(point.x);
				iterY.push(point.y);

				// Generates the list of coefficients used for a single magnetic trajectory
				coefficientList = evaluateCoefficients(point.x,point.y,point.v_x,point.v_y);

				// The bisection method provides an approximation as to where a magnetic arc should stop, i.e. along the intersection
				stop = bisection([.5,6],magneticFunction,math.pow(10,-15),coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],scaling,a,b);

				// Resets the start time for the magnetic trajectory
				param = 0;

				// A point used to determine whether traveling in positive time lands in the exterior or interior of a region
				check = evaluateMagneticTrajectory(stop / 2,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],scaling);
				
				// Evaluate outer trajectory and add to the list
				if(checkRegion(check,a,b) == 1) {
					while(param <= stop) {
						param += .01;
						point = evaluateMagneticTrajectory(param,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],scaling);
						iterX.push(point.x);
						iterY.push(point.y);
					}
				}
				else {
					while(stop - (2 * math.pi) <= param) {
						param -= .01;
						point = evaluateMagneticTrajectory(param,coefficientList[0],coefficientList[1],coefficientList[2],coefficientList[3],scaling);
						iterX.push(point.x);
						iterY.push(point.y);
					}
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
			  	type: 'scatter'
			};

			var trace2 = {
				x: iterX,
				y: iterY,
				type: 'scatter'
			};

			var data = [trace1,trace2];

			var layout = {
			  	grid: {rows: 1, columns: 1, pattern: 'independent'},
			  	showlegend: false,
			  	xaxis: {range: [-(max + 2), max + 2]},
	  			yaxis: {range: [-(max + 2), max + 2]}
			};

			Plotly.newPlot('myDiv', data, layout, {scrollZoom: true, responsive: true});
			$("#myDiv").children().first().children().first().children().first().css({
				"border-style": "solid",
				"border-radius": "100px"
			});
		});
	};

	return exports;
});