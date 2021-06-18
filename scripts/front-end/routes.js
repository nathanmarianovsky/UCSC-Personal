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

				var c = document.getElementById("main");
				var context = c.getContext("2d");
				var centerx = context.canvas.width / 2;
				var centery = context.canvas.height / 2;
				var radMin = context.canvas.width >= context.canvas.height ? context.canvas.height : context.canvas.width;
				var radMax = context.canvas.width >= context.canvas.height ? context.canvas.width : context.canvas.height;

			 	var num = 1;
			 	var denom = 0;

			 	if(radMin < 500) { denom = 450; }
			 	else if(500 <= radMin && radMin < 1000) { denom = 420; }
			 	else if(1000 <= radMin && radMin < 2000) { denom = 370; }

			 	var pow = num / denom;
			 	var holder = 0;

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
			    	var sizeArr = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 65, 80, 100, 125, 155, 190, 230, 275];
				    var horArr = [.975, 1, 1.025, .995, .935, .93, 1, 1.065, 1.06, .98, .86, .8, .9, 1.1, 1.17, .97, .59];
				    var verArr = [1, 1.04, .98, .88, .915, 1.06, 1.12, 1.02, .81, .69, .74, 1, 1.28, 1.18, .72, .17, .3];
			    }

			   //  baseImage = new Image();
			  	// baseImage.src = "/client/hex.svg";
			  	// baseImage.onload = function() {
			   //  	context.drawImage(baseImage, centerx * .98, centery, 10, 10);
			  	// }

			  	// baseImage = new Image();
			  	// baseImage.src = "/client/hex.svg";
			  	// baseImage.onload = function() {
			   //  	context.drawImage(baseImage, centerx, centery * 1.03, 15, 15);
			  	// }

			 //  	var index = 0;
				// var interval = setInterval(function() {
				// 	baseImage = new Image();
				// 	baseImage.onload = (function(cur) {
				// 		return function() {
		  //   				context.drawImage(baseImage, centerx * horArr[cur], centery * verArr[cur], sizeArr[cur], sizeArr[cur]);
				// 		}
			 //  		}(index));
				// 	baseImage.src = "/client/hex.svg";

				// 	if(index == 17) {
				// 		baseImage.useMap = 
				// 	}

			 //  		index++;
			 //  		if(index >= sizeArr.length) { clearInterval(interval); }
				// }, 150);




				// for(var i = 0; i < collection.length; i++) {
				// 	$("main").append(div);
				// 	// console.log(collection[i]);
				// 	setTimeout(function(param) {
				// 		// console.log("hello");
				// 		// console.log(param);
				// 		$("#container").append(param);
				// 		param.show("slow");
				// 	}, 100 * i, collection[i]);














				// // console.log("hello");

				// var sizeArr = ["10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "65", "80", "100", "125", "155", "190", "230", "275", "325"],
				// 	leftArr = ["50.6", "51", "50", "48.6", "48.5", "51", "52", "50", "46.3", "45.6", "49", "54", "53", "44", "38", "48", "60.5", "53", "28"],
				// 	topArr = ["61.5", "59.5", "57.3", "58", "62", "62.6", "58", "53", "55", "62", "67.7", "62", "47", "42.2", "60", "77.8", "56", "20.5", "23"],
				var	collection = [];

				var width = $(window).width(),
					height = $(window).height(),
					origWidth = width,
					origHeight = height;

				// // console.log(width, height);

				// $(window).resize(function() {
				// 	var curWidth = $(window).width(),
				// 		curHeight = $(window).height();
				// 	// console.log(width, height);
				// 	if(curHeight >= curWidth) {
				// 		$("main").css("background-size", "auto 100%");
				// 	}
				// 	else {
				// 		$("main").css("background-size", "100% auto");
				// 	}
				// 	console.log(curWidth, origWidth);
				// 	if(curWidth < origWidth) {
				// 		// sizeArr = sizeArr.map(x => String(parseFloat(x) * .6));
				// 		// leftArr = leftArr.map(x => String(parseFloat(x) - 0.1));
				// 		// topArr = topArr.map(x => String(parseFloat(x) + 2.7));
				// 		$(".polygon").each(function(index) {
				// 			// var iterWidth = ($(this).css("width")),
				// 			// 	iterLeft = $(this).css("left"),
				// 			// 	iterTop = $(this).css("top");
				// 			// $(this).css({
				// 			// 	"width": parseFloat(iterWidth.slice
				// 			// });
				// 			console.log($(this).css("left"));
				// 		});
				// 	}
				// 	else {
				// 		// sizeArr = sizeArr.map(x => String(parseFloat(x) * 1.18));
				// 		// leftArr = leftArr.map(x => String(parseFloat(x) + 0.1));
				// 		// topArr = topArr.map(x => String(parseFloat(x) - 2.7));
				// 	}
				// 	width = curWidth;
				// 	height = curHeight;
				// });

				// sizeArr = sizeArr.map(x => String(parseFloat(x) * .8));

				// // var sizeArr = ["10", "15", "20"],
				// // 	leftArr = ["50.6", "51", "50"],
				// // 	topArr = ["61.5", "59.5", "57.3"],
				// // 	collection = [];

				// // $("main").append($("<div/>").append($("<img>").attr("src", "/client/hex.svg")));
				var div = $("<div>").attr("id", "container").css("height", "inherit");
				// var map = $("<map>").attr("name", "border");

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
						// img.attr("usemap", "#border");
						var x = centerx * horArr[i],
							y = centery * verArr[i],
							w = sizeArr[i],
							h = (13 / 15) * w,
							k = (75.371 / 150) * w,
							l = (w - k) / 2;
						// var arr = [x + l, y, x + l + k, y, x + w, y - (h / 2), x + l + k, y - h, x + l, y - h, x, y - (h / 2)];
						// arr = arr.map(num => Math.round(num * Math.pow(10, 4)) / Math.pow(10, 4));
						// var area = $("<area>").attr({
						// 	"shape": "poly",
						// 	"coords": arr.join(),
						// });
						// map.append(area);
						var link = $("<a>").attr({
							"href": "https://www.github.com/nathanmarianovsky",
							"target": "_blank",
							"rel": "noopener noreferrer"
						});
						var github = $("<img>").attr("src", "/client/github.png").css({
							"position": "absolute",
							"width": (sizeArr[i] / 1.5) + "px",
							"left": (centerx * (horArr[i] + .035)) + "px",
							"top": (centery * (verArr[i] + .035)) + "px",
							"z-index": 3
						}).hide();
						// var link = $("<a>").attr({
						// 	"href": "https://www.github.com",
						// 	"target": "_blank",
						// 	"rel": "noopener noreferrer"
						// });
						// var link = $("<div>");
						link.append(github);
						collection.push(img, link);
					}
					else {
						collection.push(img);
					}
					// if(sizeArr[i] == "65") {
					// 	img.append($("<img>").attr("src", "/client/github.png"))
					// }
					// var div = $("<div>").css("height", "inherit").append(img);
					// div.append(img);
				}

				console.log(width);

				div.css({
					"width": width,
					"height": height - 42
				});

				for(var i = 0; i < collection.length; i++) {
					$("main").append(div);
					// console.log(collection[i]);
					setTimeout(function(param, index) {
						// console.log("hello");
						// console.log(param);
						div.append(param);
						if(index == 18) {
							// console.log(param.children());
							param.children().show("slow");
						}
						else {
							param.show("slow");
						}
					}, 100 * i, collection[i], i);

					// sleep(1000).then(() => {$("#container").append(collection[i]);});
					// var start = new Date().getTime();
					// console.log("start " + start);
			  // 		for (var i = 0; i < 1e7; i++) {
				 //    	if ((new Date().getTime() - start) > 100){
				 //     		console.log("breaking");
				 //     		break;
				 //    	}
			  // 		}
			  // 		console.log("hello");
			  // 		console.log($("#container"));
				}

				// // $("body").css({
				// // 	"background-image": "url('/client/Untitled-1.svg')",
				// // 	"background-repeat": "no-repeat",
				// // 	"background-attachment": "fixed",
				// // 	"background-size": "100% 100%",
				// // 	"-webkit-mask-image": "radial-gradient(circle at center, transparent 25%, black 75%)",
		  // // 			"mask-image": "radial-gradient(circle at center, transparent 25%, black 75%)"
				// // });

				// // MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);

				// // $(".notes_table > tbody > tr").hide();

				// // $(".notes_table > thead > tr").click(function() {
		  // //      		$obj = $(this).closest(".notes_table").find("tbody > tr");
		  // //      		$obj.slideToggle();
		  // //   	});
			});
		});
	};

	return exports;
});