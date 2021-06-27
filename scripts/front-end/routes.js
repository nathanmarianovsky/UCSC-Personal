define(["jquery", "math"], ($, Math) => {
	var exports = {};

	exports.add_listeners = router => {
		router.addRouteListener("def", (toState, fromState) => {
			// Grab the primary html content
			$.get("/client/content.html").done(data => {
				// Empty the current body and attach the primary html content
				$("body").empty();
				$("body").append(data);
				$("select").material_select();
				$("#main").attr({
					width: $("main").width(),
					height: $("main").height()
				})

				// Create the canvas that will contain the spiral
				var c = document.getElementById("main"),
					context = c.getContext("2d"),
					centerx = context.canvas.width / 2,
					centery = context.canvas.height / 2,
					radMin = context.canvas.width >= context.canvas.height ? context.canvas.height : context.canvas.width,
					radMax = context.canvas.width >= context.canvas.height ? context.canvas.width : context.canvas.height;

				console.log(context.canvas.width);

				// Create scaling to account for screen sizes
			 	var num = 1,
			 		denom = ((5 / 36) * (2554 - context.canvas.width)) + 370,
			 		pow = num / denom;

			 	// Create a variable to maintain the last line width prior to the opacity change
			 	var	holder = 0;

			 	// Create a background gradient on the canvas
			 	var grd = context.createRadialGradient(centerx, centery, radMin / 100, centerx, centery, radMin);
				grd.addColorStop(0, "#858181");
				grd.addColorStop(.2, "#444242");
				grd.addColorStop(.4, "#000000");
				grd.addColorStop(.6, "#000000");
				grd.addColorStop(.8, "#000000");
				grd.addColorStop(1, "#000000");
				context.fillStyle = grd;
				context.fillRect(0, 0, context.canvas.width, context.canvas.height);

			    context.moveTo(centerx, centery);

			    // Generate the spiral on the canvas
			    for(var j = 0; j < 17; j++) {
			    	context.beginPath();
				    for(i = 15 * j; i <= 15 * (j + 1); i++) {
				        angle = 0.1 * i;
				        x = centerx + Math.pow(angle, pow) * (2 * angle) * Math.cos(-angle);
				        y = centery + Math.pow(angle, pow) * (2 * angle) * Math.sin(-angle);
				        context.lineTo(x, y);
					    context.lineWidth = j / 2.5;
					    num++;
					    pow = num/denom;
				    }
				    num--;
				    pow = num/denom;
				    context.strokeStyle = "#FF0000";
				    context.stroke();
				    if(j == 16) {
				    	holder = context.lineWidth;
				    }
			    }
			    for(var j = 0; j < 30; j++) {
			    	context.beginPath();
				    for(i = 255 + j; i <= 255 + j + 1; i++) {
				        angle = 0.1 * i;
				        x = centerx + Math.pow(angle, pow) * (2 * angle) * Math.cos(-angle);
				        y = centery + Math.pow(angle, pow) * (2 * angle) * Math.sin(-angle);
				        context.lineTo(x, y);
					    context.lineWidth = holder;
					    num++;
					    pow = num/denom;
				    }
				    num--;
				    pow = num/denom;
				    context.globalAlpha = 1 - (j / 30);
				    context.strokeStyle = "#FF0000";
				    context.stroke();
			    }
			    context.globalAlpha = 1;
			    
			    // Create an array to house all of the positioning and sizing information for the hexagons 
			    var hexPos = [];
		    	hexPos = [
		    		{ "angle": -3.3, "radius": Math.pow(3.3, pow) * (2 * 3.3), "size": 10 },
		    		{ "angle": -5, "radius": Math.pow(4, pow) * (2 * 4), "size": 15 },
		    		{ "angle": -6.6, "radius": Math.pow(4.7, pow) * (2 * 4.7), "size": 20 },
		    		{ "angle": -8, "radius": Math.pow(5.4, pow) * (2 * 5.4), "size": 25 },
		    		{ "angle": -9.2, "radius": Math.pow(6.2, pow) * (2 * 6.2), "size": 30 },
		    		{ "angle": -10.5, "radius": Math.pow(7.2, pow) * (2 * 7.2), "size": 35 },
		    		{ "angle": -11.5, "radius": Math.pow(8, pow) * (2 * 8), "size": 40 },
		    		{ "angle": -12.5, "radius": Math.pow(8.5, pow) * (2 * 8.5), "size": 45 },
		    		{ "angle": -13.4, "radius": Math.pow(9.2, pow) * (2 * 9.2), "size": 50 },
		    		{ "angle": -14.2, "radius": Math.pow(10, pow) * (2 * 10), "size": 55 },
		    		{ "angle": -15, "radius": Math.pow(10.6, pow) * (2 * 10.6), "size": 65 },
		    		{ "angle": -16, "radius": Math.pow(11.7, pow) * (2 * 11.7), "size": 80 },
		    		{ "angle": -16.8, "radius": Math.pow(13, pow) * (2 * 13), "size": 100 },
		    		{ "angle": -17.6, "radius": Math.pow(14, pow) * (2 * 14), "size": 125 },
		    		{ "angle": -18.4, "radius": Math.pow(15, pow) * (2 * 15), "size": 155 },
		    		{ "angle": -19.3, "radius": Math.pow(15.8, pow) * (2 * 15.8), "size": 190 },
		    		{ "angle": -20.5, "radius": Math.pow(17.3, pow) * (2 * 17.3), "size": 230 },
		    		{ "angle": -21.6, "radius": Math.pow(19, pow) * (2 * 19), "size": 275 }
		    	];

		    	// Adjust the size of the hexagons as needed
		    	if(denom != 370) {
		    		hexPos = hexPos.map(elem => {
		    			var obj = {
		    				"angle": elem.angle,
		    				"radius": elem.radius,
		    				"size": elem.size - ((elem.size * .25) / 50) * (denom - 370)
		    			};
		    			return obj;
		    		});
		    	}

		    	// Create an array to temporarily hold the hexagons and a container div to house them 
				var	collection = [],
					width = $(window).width(),
					height = $(window).height(),
					div = $("<div>").attr("id", "container").css("height", "inherit");

				// Create a multiplier for the radial length of the hexagons
				var alpha = 1.2 + (.045 / 50) * (denom - 370);

				// Create the hexagons and add them to the temporary collection
				for(var i = 0; i < hexPos.length; i++) {
					var img = $("<img>").attr({
							"src": "/client/hex.svg",
							"id": "hex" + i
						}).addClass("polygon").css({
							"position": "absolute",
							"width": (hexPos[i].size) + "px",
							"left": ((centerx + ((hexPos[i].radius * alpha) * Math.cos(hexPos[i].angle))) - (hexPos[i].size) / 2) + "px",
							"top": ((42 + centery + ((hexPos[i].radius * alpha) * Math.sin(hexPos[i].angle))) - (hexPos[i].size / 2)) + "px",
							"z-index": 1
						}).hide();
					if(i == hexPos.length - 1) {
						var horFix = 1.225 - ((.024 / 50) * (denom - 370)),
							verFix = 1.4 - ((.12 / 50) * (denom - 370));
						var link = $("<a>").attr({
							"href": "https://www.github.com/nathanmarianovsky",
							"target": "_blank",
							"rel": "noopener noreferrer"
						});
						var github = $("<img>").attr("src", "/client/github.png").css({
							"position": "absolute",
							"width": (hexPos[i].size / 1.5) + "px",
							"left": (centerx + (hexPos[i].radius * alpha * horFix * Math.cos(hexPos[i].angle))) + "px",
							"top": (centery + (hexPos[i].radius * alpha * verFix * Math.sin(hexPos[i].angle))) + "px",
							"z-index": 3
						}).hide();
						link.append(github);
						collection.push(img, link);
					}
					else if(i == hexPos.length - 2) {
						var horFix = 2.5 - ((.2 / 50) * (denom - 370)),
							verFix = 1.11 - ((.052 / 50) * (denom - 370));
						var link = $("<a>").attr({
							"href": "http://www.manualmath.com",
							"target": "_blank",
							"rel": "noopener noreferrer"
						});
						var manualmath = $("<img>").attr("src", "/client/manualmath.svg").css({
							"position": "absolute",
							"width": (hexPos[i].size / 2) + "px",
							"left": (centerx + (hexPos[i].radius * alpha * horFix * Math.cos(hexPos[i].angle))) + "px",
							"top": (centery + (hexPos[i].radius * alpha * verFix * Math.sin(hexPos[i].angle))) + "px",
							"z-index": 3
						}).hide();
						link.append(manualmath);
						collection.push(img, link);
					}
					else {
						collection.push(img);
					}
				}

				// Modify the hexagon container and attach it to the main body of the page
				div.css({
					"width": width,
					"height": height - 42
				});
				$("main").append(div);

				// Show the hexagons on the page by loading them with delays along the spiral of the canvas
				for(var i = 0; i < collection.length; i++) {
					setTimeout(function(param) {
						div.append(param);
						param.show("slow");
						param.children().show("slow");
					}, 100 * (i + 2), collection[i]);
				}

				// Load the modals for the "contact" and "about" links
		  		$(".modal-trigger").leanModal({
		  			dismissible: true,
					opacity: 2,
					inDuration: 500,
					outDuration: 500
		  		});

		  		$(window).resize(function() {
		  			$("body").empty();
					$("body").append(data);
					$("select").material_select();

					$("#main").attr({
						width: $("main").width(),
						height: $("main").height()
					})

					var c = document.getElementById("main"),
						context = c.getContext("2d"),
						centerx = context.canvas.width / 2,
						centery = context.canvas.height / 2,
						radMin = context.canvas.width >= context.canvas.height ? context.canvas.height : context.canvas.width,
						radMax = context.canvas.width >= context.canvas.height ? context.canvas.width : context.canvas.height;

				 	var num = 1,
				 		denom = ((5 / 36) * (2554 - context.canvas.width)) + 370;

				 	// if(radMin < 500) { denom = 450; }
				 	// else if(500 <= radMin && radMin < 1000) { denom = 420; }
				 	// else if(1000 <= radMin && radMin < 2000) { denom = 370; }

				 	var pow = num / denom,
				 		holder = 0;

				 	console.log(radMin, denom);

				 	var grd = context.createRadialGradient(centerx, centery, radMin / 100, centerx, centery, radMin);
					grd.addColorStop(0, "#858181");
					grd.addColorStop(.2, "#444242");
					grd.addColorStop(.4, "#000000");
					grd.addColorStop(.6, "#000000");
					grd.addColorStop(.8, "#000000");
					grd.addColorStop(1, "#000000");
					context.fillStyle = grd;
					context.fillRect(0, 0, context.canvas.width, context.canvas.height);

				    context.moveTo(centerx, centery);

				    for(var j = 0; j < 17; j++) {
				    	context.beginPath();
					    for(i = 15 * j; i <= 15 * (j + 1); i++) {
					        angle = 0.1 * i;
					        x = centerx + Math.pow(angle,pow) * (2 * angle) * Math.cos(-angle);
					        y = centery + Math.pow(angle,pow) * (2 * angle) * Math.sin(-angle);
					        context.lineTo(x, y);
						    context.lineWidth = j / 2.5;
						    num++;
						    pow = num/denom;
					    }
					    num--;
					    pow = num/denom;
					    context.strokeStyle = "#FF0000";
					    context.stroke();
					    holder = context.lineWidth;
				    }

				    for(var j = 0; j < 30; j++) {
				    	context.beginPath();
					    for(i = 255 + j; i <= 255 + j + 1; i++) {
					        angle = 0.1 * i;
					        x = centerx + Math.pow(angle,pow) * (2 * angle) * Math.cos(-angle);
					        y = centery + Math.pow(angle,pow) * (2 * angle) * Math.sin(-angle);
					        context.lineTo(x, y);
						    context.lineWidth = holder;
						    num++;
						    pow = num/denom;
					    }
					    num--;
					    pow = num/denom;
					    context.globalAlpha = 1 - (j / 30);
					    context.strokeStyle = "#FF0000";
					    context.stroke();
				    }

				    context.globalAlpha = 1;

				    var baseImage = "";
				    // if(denom == 370) {
					    var sizeArr = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 65, 80, 100, 125, 155, 190, 230, 275];
					    var horArr = [.98, 1, 1.02, .995, .945, .945, 1, 1.06, 1.06, 1, .91, .83, .86, 1, 1.15, 1.13, .9, .6];
					    var verArr = [1.06, 1.1, 1.04, .97, 1, 1.12, 1.17, 1.08, .92, .81, .8, .98, 1.24, 1.34, 1.12, .61, .26, .46];
				    // }
				    // else if(denom == 420) {
				    // 	var sizeArr = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 65, 80, 100, 125, 155, 190, 230];
					   //  var horArr = [.975, 1, 1.025, .995, .935, .93, 1, 1.065, 1.06, .98, .86, .8, .9, 1.1, 1.17, .97, .59];
					   //  var verArr = [1.08, 1.13, 1.06, .975, .995, 1.14, 1.21, 1.1, .89, .77, .82, 1.08, 1.36, 1.27, .8, .3, .42];
				    // }

				    if(denom >= 400) {
					    horArr[0] = (-(.001 / 50) * (denom - 370)) + horArr[0];
					    horArr[2] = ((.003 / 50) * (denom - 370)) + horArr[2];
					    // horArr[4] = ((.00 / 50) * (denom - 370)) + horArr[4];
					    horArr[5] = (-(.002 / 50) * (denom - 370)) + horArr[5];
					    horArr[7] = ((.00 / 50) * (denom - 370)) + horArr[7];
					    horArr[9] = (-(.02 / 50) * (denom - 370)) + horArr[9];
					    horArr[10] = (-(.03 / 50) * (denom - 370)) + horArr[10];
					    // horArr[11] = (-(.00 / 50) * (denom - 370)) + horArr[11];
					    horArr[12] = ((.04 / 50) * (denom - 370)) + horArr[12];
					    horArr[13] = ((.065 / 50) * (denom - 370)) + horArr[13];
					    // horArr[14] = ((.00 / 50) * (denom - 370)) + horArr[14];
					    // horArr[16] = ((.00 / 50) * (denom - 370)) + horArr[16];
					    horArr[17] = ((.015 / 50) * (denom - 370)) + horArr[17];
				    	horArr.splice(15, 1);

				    	verArr[0] = ((.02 / 50) * (denom - 370)) + verArr[0];
					    verArr[1] = ((.018 / 50) * (denom - 370)) + verArr[1];
					    verArr[2] = ((.02 / 50) * (denom - 370)) + verArr[2];
					    verArr[3] = ((.005 / 50) * (denom - 370)) + verArr[3];
					    verArr[4] = ((.001 / 50) * (denom - 370)) + verArr[4];
					    verArr[5] = ((.02 / 50) * (denom - 370)) + verArr[5];
					    verArr[6] = ((.02 / 50) * (denom - 370)) + verArr[6];
					    verArr[7] = ((.02 / 50) * (denom - 370)) + verArr[7];
					    // verArr[8] = (-(.00 / 50) * (denom - 370)) + verArr[8];
					    verArr[9] = (-(.00 / 50) * (denom - 370)) + verArr[9];
					    verArr[10] = ((.06 / 50) * (denom - 370)) + verArr[10];
					    verArr[11] = ((.1 / 50) * (denom - 370)) + verArr[11];
					    verArr[12] = ((.07 / 50) * (denom - 370)) + verArr[12];
					    verArr[13] = (-(.07 / 50) * (denom - 370)) + verArr[13];
					    verArr[15] = ((.1 / 50) * (denom - 370)) + verArr[15];
					    verArr[16] = ((.08 / 50) * (denom - 370)) + verArr[16];
					    verArr[17] = ((.1 / 50) * (denom - 370)) + verArr[17];
					    verArr.splice(14, 1);

					    sizeArr.splice(-1, 1);
				    }
				    else {
				    	horArr[0] = (-(.005 / 50) * (denom - 370)) + horArr[0];
					    horArr[2] = ((.005 / 50) * (denom - 370)) + horArr[2];
					    horArr[4] = (-(.01 / 50) * (denom - 370)) + horArr[4];
					    horArr[5] = (-(.015 / 50) * (denom - 370)) + horArr[5];
					    horArr[7] = ((.005 / 50) * (denom - 370)) + horArr[7];
					    horArr[9] = (-(.02 / 50) * (denom - 370)) + horArr[9];
					    horArr[10] = (-(.05 / 50) * (denom - 370)) + horArr[10];
					    horArr[11] = (-(.03 / 50) * (denom - 370)) + horArr[11];
					    horArr[12] = ((.04 / 50) * (denom - 370)) + horArr[12];
					    horArr[13] = ((.1 / 50) * (denom - 370)) + horArr[13];
					    horArr[14] = ((.02 / 50) * (denom - 370)) + horArr[14];
					    horArr[15] = ((.02 / 50) * (denom - 370)) + horArr[15];
					    horArr[16] = ((.07 / 50) * (denom - 370)) + horArr[16];
					    horArr[17] = (-(.01 / 50) * (denom - 370)) + horArr[17];

				    	verArr[0] = ((.02 / 50) * (denom - 370)) + verArr[0];
					    verArr[1] = ((.03 / 50) * (denom - 370)) + verArr[1];
					    verArr[2] = ((.02 / 50) * (denom - 370)) + verArr[2];
					    verArr[3] = ((.005 / 50) * (denom - 370)) + verArr[3];
					    verArr[4] = (-(.005 / 50) * (denom - 370)) + verArr[4];
					    verArr[5] = ((.02 / 50) * (denom - 370)) + verArr[5];
					    verArr[6] = ((.04 / 50) * (denom - 370)) + verArr[6];
					    verArr[7] = ((.02 / 50) * (denom - 370)) + verArr[7];
					    verArr[8] = (-(.03 / 50) * (denom - 370)) + verArr[8];
					    verArr[9] = (-(.04 / 50) * (denom - 370)) + verArr[9];
					    verArr[10] = ((.02 / 50) * (denom - 370)) + verArr[10];
					    verArr[11] = ((.1 / 50) * (denom - 370)) + verArr[11];
					    verArr[12] = ((.12 / 50) * (denom - 370)) + verArr[12];
					    verArr[13] = (-(.07 / 50) * (denom - 370)) + verArr[13];
					    verArr[14] = ((.02 / 50) * (denom - 370)) + verArr[14];
					    verArr[15] = ((.19 / 50) * (denom - 370)) + verArr[15];
					    verArr[16] = ((.04 / 50) * (denom - 370)) + verArr[16];
					    verArr[17] = (-(.04 / 50) * (denom - 370)) + verArr[17];
				    }

				    // verArr = verArr.map(elem => ((.02 / 50) * (denom - 370)) + elem);

					var	collection = [],
						width = $(window).width(),
						height = $(window).height(),
						div = $("<div>").attr("id", "container").css("height", "inherit");

					// if(denom >= 400) {
					// 	sizeArr.splice(-1, 1);
					// 	horArr.splice(9, 1);
					// 	verArr.splice(9, 1);
					// }

					var sizeFix = 1 - ((.12 / 50) * (denom - 370));

					for(var i = 0; i < sizeArr.length; i++) {
						var img = $("<img>").attr({
								"src": "/client/hex.svg",
								"id": "hex" + i
							}).addClass("polygon").css({
								"position": "absolute",
								"width": (sizeArr[i] * sizeFix) + "px",
								"left": (centerx * horArr[i]) + "px",
								"top": (centery * verArr[i]) + "px",
								"z-index": 1
							}).hide();
						if(i == sizeArr.length - 1) {
							var horFix = (-(.002 / 50) * (denom - 370)) + .035,
								verFix = horFix;
							// if(denom == 370) {
							// 	var horFix = .035,
							// 		verFix = .035;
							// }
							// else if(denom == 420) {
							// 	var horFix = .04,
							// 		verFix = .04;
							// }
							var link = $("<a>").attr({
								"href": "https://www.github.com/nathanmarianovsky",
								"target": "_blank",
								"rel": "noopener noreferrer"
							});
							var github = $("<img>").attr("src", "/client/github.png").css({
								"position": "absolute",
								"width": ((sizeArr[i] * sizeFix) / 1.5) + "px",
								"left": (centerx * (horArr[i] + horFix)) + "px",
								"top": (centery * (verArr[i] + verFix)) + "px",
								"z-index": 3
							}).hide();
							link.append(github);
							collection.push(img, link);
						}
						else if(i == sizeArr.length - 2) {
							var horFix = (-(.002 / 50) * (denom - 370)) + .055,
								verFix = ((.000 / 50) * (denom - 370)) + .045;
							// if(denom == 370) {
							// 	var horFix = .055,
							// 		verFix = .045;
							// }
							// else if(denom == 420) {
							// 	var horFix = .06,
							// 		verFix = .05;
							// }
							var link = $("<a>").attr({
								"href": "http://www.manualmath.com",
								"target": "_blank",
								"rel": "noopener noreferrer"
							});
							var manualmath = $("<img>").attr("src", "/client/manualmath.svg").css({
								"position": "absolute",
								"width": ((sizeArr[i] * sizeFix) / 2) + "px",
								"left": (centerx * (horArr[i] + horFix)) + "px",
								"top": (centery * (verArr[i] + verFix)) + "px",
								"z-index": 3
							}).hide();
							link.append(manualmath);
							collection.push(img, link);
						}
						else {
							collection.push(img);
						}
					}

					div.css({
						"width": width,
						"height": height - 42
					});

					for(var i = 0; i < collection.length; i++) {
						$("main").append(div);
						setTimeout(function(param) {
							div.append(param);
							param.show("slow");
							param.children().show("slow");
						}, 100 * i, collection[i]);
					}

			  		$(".modal-trigger").leanModal({
			  			dismissible: true,
						opacity: 2,
						inDuration: 500,
						outDuration: 500
			  		});
		  		});
		  		// context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			});
		});
	};

	return exports;
});