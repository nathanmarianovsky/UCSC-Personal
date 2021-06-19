define(["jquery", "math"], ($, Math) => {
	var exports = {};

	exports.add_listeners = router => {
		router.addRouteListener("def", (toState, fromState) => {
			$.get("/client/content.html").done(data => {
				$("body").empty();
				$("body").append(data);
				$('select').material_select();

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
			 		denom = 0;

			 	if(radMin < 500) { denom = 450; }
			 	else if(500 <= radMin && radMin < 1000) { denom = 420; }
			 	else if(1000 <= radMin && radMin < 2000) { denom = 370; }

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
			    if(denom == 370) {
				    var sizeArr = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 65, 80, 100, 125, 155, 190, 230, 275];
				    var horArr = [.98, 1, 1.02, .995, .945, .945, 1, 1.06, 1.06, 1, .91, .83, .86, 1, 1.15, 1.13, .9, .6];
				    var verArr = [1.06, 1.1, 1.04, .97, 1, 1.12, 1.17, 1.08, .92, .81, .8, .98, 1.24, 1.34, 1.12, .61, .26, .46];
			    }
			    else if(denom == 420) {
			    	var sizeArr = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 65, 80, 100, 125, 155, 190, 230];
				    var horArr = [.975, 1, 1.025, .995, .935, .93, 1, 1.065, 1.06, .98, .86, .8, .9, 1.1, 1.17, .97, .59];
				    var verArr = [1.08, 1.13, 1.06, .975, .995, 1.14, 1.21, 1.1, .89, .77, .82, 1.08, 1.36, 1.27, .8, .3, .42];
			    }

				var	collection = [],
					width = $(window).width(),
					height = $(window).height(),
					div = $("<div>").attr("id", "container").css("height", "inherit");

				for(var i = 0; i < sizeArr.length; i++) {
					var img = $("<img>").attr({
							"src": "/client/hex.svg",
							"id": "hex" + i
						}).addClass("polygon").css({
							"position": "absolute",
							"width": sizeArr[i] + "px",
							"left": (centerx * horArr[i]) + "px",
							"top": (centery * verArr[i]) + "px",
							"z-index": 1
						}).hide();
					if(i == sizeArr.length - 1) {
						if(denom == 370) {
							var horFix = .035,
								verFix = .035;
						}
						else if(denom == 420) {
							var horFix = .04,
								verFix = .04;
						}
						var link = $("<a>").attr({
							"href": "https://www.github.com/nathanmarianovsky",
							"target": "_blank",
							"rel": "noopener noreferrer"
						});
						var github = $("<img>").attr("src", "/client/github.png").css({
							"position": "absolute",
							"width": (sizeArr[i] / 1.5) + "px",
							"left": (centerx * (horArr[i] + horFix)) + "px",
							"top": (centery * (verArr[i] + verFix)) + "px",
							"z-index": 3
						}).hide();
						link.append(github);
						collection.push(img, link);
					}
					else if(i == sizeArr.length - 2) {
						if(denom == 370) {
							var horFix = .055,
								verFix = .045;
						}
						else if(denom == 420) {
							var horFix = .06,
								verFix = .05;
						}
						var link = $("<a>").attr({
							"href": "http://www.manualmath.com",
							"target": "_blank",
							"rel": "noopener noreferrer"
						});
						var manualmath = $("<img>").attr("src", "/client/manualmath.svg").css({
							"position": "absolute",
							"width": (sizeArr[i] / 2) + "px",
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
		});
	};

	return exports;
});