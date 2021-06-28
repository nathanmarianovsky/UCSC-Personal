define(function() {

	var exports = {};

	// Creates the canvas in the html body and generates a spiral whose size is dependent upon the screen dimensions
	exports.canvasSpiral = function(data) {
		// Empty the current body and attach the primary html content
		$("body").empty();
		$("body").append(data);
		$("select").material_select();
		$("#main").attr({
			width: $("main").width(),
			height: $("main").height()
		});

		// Create the canvas that will contain the spiral
		var c = document.getElementById("main"),
			context = c.getContext("2d"),
			centerx = context.canvas.width / 2,
			centery = context.canvas.height / 2,
			radMin = context.canvas.width >= context.canvas.height ? context.canvas.height : context.canvas.width,
			radMax = context.canvas.width >= context.canvas.height ? context.canvas.width : context.canvas.height;

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

	    return {"denom": denom, "pow": pow, "centerx": centerx, "centery": centery};
	};



	// Creates hexagons along the interior region of the spiral in the canvas and attaches the logos and links as needed
	exports.hexPlacement = function(denom, pow, centerx, centery) {
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
			var horFix = 0,
				verFix = 0;
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
				horFix = 1.225 - ((.024 / 50) * (denom - 370)),
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
				horFix = 2.5 - ((.2 / 50) * (denom - 370)),
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
			else if(i == hexPos.length - 3) {
				horFix = .785 + ((.03 / 50) * (denom - 370)),
				verFix = 1.25 - ((.14 / 50) * (denom - 370));
				var link = $("<a>").attr({
					"href": "http://www.manualmath.com",
					"target": "_blank",
					"rel": "noopener noreferrer"
				});
				var notes = $("<i>").addClass("material-icons").text("description").css({
					"position": "absolute",
					"font-size": (hexPos[i].size / 1.5) + "px",
					"left": (centerx + (hexPos[i].radius * alpha * horFix * Math.cos(hexPos[i].angle))) + "px",
					"top": (centery + (hexPos[i].radius * alpha * verFix * Math.sin(hexPos[i].angle))) + "px",
					"color": "black",
					"z-index": 3
				}).hide();
				link.append(notes);
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
	};

	return exports;
})