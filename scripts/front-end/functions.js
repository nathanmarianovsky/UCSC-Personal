define(["jquery", "app/functions", "math"], ($, functions, math) => {
	var exports = {};



	// Handles all links on the page
	exports.handle_links = function(router) {
		$("a").on("click", function(e) {
			e.preventDefault();
			if($(this).attr("id") == "config") {
				var indicator = 1;
				for(var i = 1; i < 9; i++) {
					if(String($("#variable" + i).val()).length == 0) {
						indicator = 0;
					}
				}
				if(indicator == 1) {
					router.navigate("mod", {
						hor: $("#variable1").val(),
						ver: $("#variable2").val(),
						inner: $("#variable3").val(),
						outer: $("#variable4").val(),
						vel1: $("#variable5").val(),
						vel2: $("#variable6").val(),
						angle: $("#variable7").val(),
						iter: $("#variable8").val(),
					});
				}
				else {
					alert("All of the requested information is necessary! Please fill in whatever data is missing and submit again.")
				}
			}
		});
	};



	// Returns the dot product of vectors v and w
	exports.dotProduct = function(v, w) {
		return (v.x * w.x) + (v.y * w.y);
	};



	// Normalizes a given vector v
	exports.normalizeVector = function(v) {
		var firstComponent = v.x / math.sqrt(exports.dotProduct(v, v)),
			secondComponent = v.y / math.sqrt(exports.dotProduct(v, v));
		return {x: firstComponent, y: secondComponent};
	};



	// Returns the coefficients for the trajectory carved out due to the magnetic field
	exports.evaluateCoefficients = function(x_1, x_2, v_1, v_2) {
		return [x_1, v_1, x_2, v_2];
	};



	// Given the coefficients of the magnetic trajectory this returns a point on the trajectory at time t
	exports.evaluateMagneticTrajectory = function(t, A, B, C, D, K) {
		var value1 = math.sin(math.abs(K) * t),
			value2 = math.cos(math.abs(K) * t),
			firstComponent = A + ((B / math.abs(K)) * value1) + ((D / K) * (1 - value2)),
			secondComponent = C + ((D / math.abs(K)) * value1) + ((B / K) * (value2 - 1)),
			firstVelocityComponent = (B * value2) + (D * math.sign(K) * value1),
			secondVelocityComponent = (D * value2) - (B * math.sign(K) * value1);
		return {x: firstComponent, y: secondComponent, v_x: firstVelocityComponent, v_y: secondVelocityComponent};
	};



	// Given a point and velocity this returns the point on the boundary along which a particle travels a straight line to reach
	exports.evaluateTrajectory = function(x_1, x_2, v_1, v_2, xLength, yLength) {
		var value1 = (math.pow(v_1, 2) / math.pow(xLength, 2)) + (math.pow(v_2, 2) / math.pow(yLength, 2)),
			value2 = ((x_1 * v_1) / math.pow(xLength, 2)) + ((x_2 * v_2) / math.pow(yLength, 2)),
			intersectionTime = (-2 * value2) / value1,
			firstComponent = (intersectionTime * v_1) + x_1,
			secondComponent = (intersectionTime * v_2) + x_2
		return {x: firstComponent, y: secondComponent, v_x: v_1, v_y: v_2};
	};



	// Used to traverse an inner straight line step by step
	exports.evaluateTrajectoryStep = function(t, x_1, x_2, v_1, v_2) {
		return {x: x_1 + (t * v_1), y: x_2 + (t * v_2), v_x: v_1, v_y: v_2};
	};



	// Used to reflect a trajectory according to the law of reflection
	exports.reflectTrajectory = function(x_1, x_2, v_1, v_2, xLength, yLength) {
		var comp1 = (yLength / xLength) * x_1,
			comp2 = (xLength / yLength) * x_2,
			norm = exports.normalizeVector({x: -comp1, y: -comp2}),
			tmp = 2 * exports.dotProduct({x: v_1, y: v_2}, norm);
		return {x: x_1, y: x_2, v_x: v_1 - (tmp * norm.x), v_y: v_2 - (tmp * norm.y)};
	};



	// This represents the implicit function assocaited to the ellipse and is used by the bisection method to determine its roots
	exports.magneticFunction = function(t, A, B, C, D, K, xLength, yLength) {
		var value1 = math.sin(math.abs(K) * t),
			value2 = math.cos(math.abs(K) * t),
			firstComponent = A + ((B / math.abs(K)) * value1) + ((D / K) * (1 - value2)),
			secondComponent = C + ((D / math.abs(K)) * value1) + ((B / K) * (value2 - 1));
		return math.pow(firstComponent / xLength, 2) + math.pow(secondComponent / yLength, 2) - 1;
	};



	// Checks whether a given point is outside the ellipse
	exports.checkRegion = function(info, xLength, yLength, math) {
		return math.pow(info.x / xLength, 2) + math.pow(info.y / yLength, 2) > 1 ? 1 : 0;
	};



	// The bisection method returns an approximation of a root given an interval that contains it
	exports.bisection = function(interval, func, err, A, B, C, D, K, xLength, yLength) {
		var attempt = (interval[0] + interval[1]) / 2,
			evaluation = func(attempt, A, B, C, D, K, xLength, yLength);
		while(math.abs(evaluation) > err) {
			if(func(interval[0], A, B, C, D, K, xLength, yLength) > 0 && func(interval[1], A, B, C, D, K, xLength, yLength) < 0) {
				if(evaluation > 0) {
					interval[0] = attempt;
				}
				else {
					interval[1] = attempt;
				}
			}
			else if(func(interval[0], A, B, C, D, K, xLength, yLength) < 0 && func(interval[1], A, B, C, D, K, xLength, yLength) > 0) {
				if(evaluation > 0) {
					interval[1] = attempt;
				}
				else {
					interval[0] = attempt;
				}
			}
			attempt = (interval[0] + interval[1]) / 2;
			evaluation = func(attempt, A, B, C, D, K, xLength, yLength);
		}
		return attempt;
	}



	exports.plotting = function(point, math, xLength, yLength, iterX, iterY, outerMagneticField) {
		// This corresponds to the case of classical billiards where there are no magnetic fields
		if(outerMagneticField == 0) {
			point = exports.evaluateTrajectory(point.x, point.y, point.v_x, point.v_y, xLength, yLength);
			iterX.push(point.x);
			iterY.push(point.y);
			point = exports.reflectTrajectory(point.x, point.y, point.v_x, point.v_y, xLength, yLength);
		}
		// This corresponds to the case of inverse-magnetic billiards
		else {
			check = exports.evaluateTrajectoryStep(math.pow(10, -4), point.x, point.y, point.v_x, point.v_y)
			if(exports.checkRegion(check, xLength, yLength, math) == 0) {
				while(exports.checkRegion(point, xLength, yLength, math) == 0) {
					point = exports.evaluateTrajectoryStep(math.pow(10, -4), point.x, point.y, point.v_x, point.v_y)
					iterX.push(point.x);
					iterY.push(point.y);
				}
			}
			console.log("about to finish first");
		}
		return point;
	};



	// Records the points attained along a magnetic trajectory in the plane
	exports.magneticPlotting = function(point, math, xLength, yLength, iterX, iterY, scaling, outerMagneticField, ver) {
		// Generates the list of coefficients used for a single magnetic trajectory
		var coefficientList = exports.evaluateCoefficients(point.x, point.y, point.v_x, point.v_y);

		// Resets the start time for the magnetic trajectory
		var param = 0;

		// Keep count of the number of steps to break out when necessary
		var steps = 0,
			bound = math.pow(10, 4),
			index = math.pow(10, -3.5);

		// A point used to determine whether traveling in positive time lands in the exterior or interior of a region
		var check = exports.evaluateMagneticTrajectory(index,
			coefficientList[0], coefficientList[1], coefficientList[2],
			coefficientList[3], scaling);

		// Evaluate outer trajectory and add to the list
		if(exports.checkRegion(check, xLength, yLength, math) == ver) {
			point = check;
			while(exports.checkRegion(point, xLength, yLength, math) == ver) {
				if(steps >= bound) { break; }
				else { steps++; }
				param += index;
				point = exports.evaluateMagneticTrajectory(param, coefficientList[0],
					coefficientList[1], coefficientList[2], coefficientList[3], scaling);
				iterX.push(point.x);
				iterY.push(point.y);
			}
		}
		else {
			while(exports.checkRegion(point, xLength, yLength, math) == ver) {
				if(steps >= bound) { break; }
				else { steps++; }
				param -= index;
				point = exports.evaluateMagneticTrajectory(param, coefficientList[0],
					coefficientList[1], coefficientList[2], coefficientList[3], scaling);
				iterX.push(point.x);
				iterY.push(point.y);
			}
		}
		console.log(point);
		if(outerMagneticField == 0 && ver == 0) {
			point = exports.reflectTrajectory(point.x, point.y, point.v_x, point.v_y, xLength, yLength);
		}
		console.log(point);
		return point;
	};

	return exports;
});