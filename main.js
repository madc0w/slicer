const pointRadius = 4;
const initialPointRadius = 16;
const sounds = {
	incorrect : new Audio("incorrect.mp3"),
};

const points = {
	polygon1 : [],
	polygon2 : [],
};

const isClosed = {
	polygon1 : false,
	polygon2 : false,
};

function onLoad() {
	//	console.log("load");

	$("canvas").on("click", function(e) {
		const elementId = e.currentTarget.id;
		if (isClosed[elementId]) {
			return;
		}
		const point = {
			x : e.offsetX,
			y : e.offsetY
		};
		const context = e.currentTarget.getContext("2d");
		const _lastPoint = points[elementId].length > 0 ? points[elementId][points[elementId].length - 1] : null;
		if (_lastPoint) {
			for (var i in points[elementId]) {
				if (i > 0) {
					const polygonSideSegment = [ points[elementId][i - 1], points[elementId][i] ];
					const newSegment = [ _lastPoint, point ];
					if (isIntersecting(polygonSideSegment, newSegment)) {
						sounds.incorrect.play();
						return;
					}
				}
			}

			if (distance(points[elementId][0], point) < initialPointRadius) {
				// close the polygon
				point.x = points[elementId].x;
				point.y = points[elementId].y;
				isClosed[elementId] = true;
				repaint(elementId);

				if (isClosed.polygon1 && isClosed.polygon2) {
					slice();
				}
				return;
			}
		}

		const radius = _lastPoint ? pointRadius : initialPointRadius;
		context.fillStyle = "rgba(255, 20, 0, 0.4)";
		context.beginPath();
		context.arc(point.x, point.y, radius, 0, Math.PI * 2);
		context.fill();
		context.strokeStyle = "#000000";
		context.beginPath();
		context.arc(point.x, point.y, radius, 0, Math.PI * 2);
		context.stroke();

		if (_lastPoint) {
			context.beginPath();
			context.moveTo(point.x, point.y);
			context.lineTo(_lastPoint.x, _lastPoint.y);
			context.stroke();
		}
		points[elementId].push(point);
	});
	const canvasWidth = (innerWidth - 32) / 2;
	$("canvas").attr("width", canvasWidth);

	$("#polygon2").css("left", 16 + canvasWidth);
}

function slice() {
	for (var polygonId = 1; polygonId <= 2; polygonId++) {
		const canvas = $("#polygon" + polygonId).get(0);
		const context = canvas.getContext("2d");
		context.strokeStyle = "#00ff00";
		const segments = [];
		const _points = [];
		for (var point of points["polygon" + polygonId]) {
			_points.push(point); //
		}
		console.log("points", _points);

		while (_points.length > 3) {
			var ear = findEar(_points);
			context.beginPath();
			context.moveTo(ear.segment[0].x, ear.segment[0].y);
			context.lineTo(ear.segment[1].x, ear.segment[1].y);
			context.stroke();

			_points.splice(ear.pointIndex, 1);
		}


	//		for (var i in _points) {
	//			if (i > 0) {
	//				segments.push([ _points[i - 1], _points[i] ]);
	//			} else {
	//				segments.push([ _points[i], _points[_points.length - 1] ]);
	//			}
	//		}
	//		for (var i in _points) {
	//			i = parseInt(i);
	//			for (var j = i + 2; j < _points.length; j++) {
	//				j = parseInt(j);
	//				const segment = [ _points[i], _points[j] ];
	//				for (var k in segments) {
	//					k = parseInt(k);
	//					var isGood = true;
	//					if (isIntersecting(segment, segments[k])) {
	//						isGood = false;
	//						break;
	//					}
	//				}
	//
	//				if (isGood) {
	//
	//					// ensure that segment is not outside of polygon
	//					const midpoint = {
	//						x : (segment[0].x + segment[1].x) / 2,
	//						y : (segment[0].y + segment[1].y) / 2
	//					};
	//					// reverse x & y to get perpendicular slope
	//					const dx = segment[0].y - segment[1].y;
	//					const dy = segment[0].x - segment[1].x;
	//					var p1,
	//						p2;
	//					var scaleFactor = 1;
	//					do {
	//						const scale = scaleFactor++ / (dx * dx + dy * dy);
	//						p1 = {
	//							x : Math.round(midpoint.x + dx * scale),
	//							y : Math.round(midpoint.y + dy * scale)
	//						};
	//						p2 = {
	//							x : Math.round(midpoint.x - dx * scale),
	//							y : Math.round(midpoint.y - dy * scale)
	//						};
	//					} while (distance(p1, p2) < 4);
	//
	//					const p1Data = context.getImageData(p1.x, p1.y, 1, 1).data;
	//					const p2Data = context.getImageData(p1.x, p1.y, 1, 1).data;
	//					console.log("i", i);
	//					console.log("j", j);
	//					console.log("p1", p1);
	//					console.log("p1Data", p1Data);
	//					console.log("p2", p2);
	//					console.log("p2Data", p2Data);
	//
	//					if (p1Data[0] == 0 && p1Data[1] == 0 && p1Data[2] == 0 &&
	//						p2Data[0] == 0 && p2Data[1] == 0 && p2Data[2] == 0) {
	//						// outside!
	//						console.log("outside");
	//						isGood = false;
	//					}
	//
	//					if (isGood) {
	//						segments.push(segment);
	//						context.beginPath();
	//						context.moveTo(segment[0].x, segment[0].y);
	//						context.lineTo(segment[1].x, segment[1].y);
	//						context.stroke();
	//					}
	//				}
	//			}
	//		}
	//
	//		for (var i in segments) {
	//			const segment1 = segments[i];
	//			for (var j in segments) {
	//				const segment2 = segments[j];
	//
	//			}
	//
	//			//			const triangle = {
	//			//				points : [ segment[0], segment[1], _points[(i + 1) % _points.length] ]
	//			//			};
	//
	//		}
	}
}

function test() {
	points.polygon1 = [

		//		{
		//			x : 86,
		//			y : 153
		//		},
		//		{
		//			x : 104,
		//			y : 304
		//		},
		//		{
		//			x : 177,
		//			y : 156
		//		},
		//		{
		//			x : 143,
		//			y : 42
		//		},
		//		{
		//			x : 156,
		//			y : 180
		//		}

		{
			x : 86,
			y : 153
		},
		{
			x : 104,
			y : 304
		},
		{
			x : 243,
			y : 153
		},
		{
			x : 231,
			y : 299
		},
		{
			x : 380,
			y : 229
		},
		{
			x : 404,
			y : 133
		},
		{
			x : 318,
			y : 32
		},
		{
			x : 344,
			y : 172
		},
		{
			x : 220,
			y : 41
		},
		{
			x : 177,
			y : 156
		},
		{
			x : 143,
			y : 42
		},
		{
			x : 156,
			y : 180
		},

	//		{
	//			x : 86,
	//			y : 133
	//		},
	//		//		{
	//		//			x : 72,
	//		//			y : 289
	//		//		},
	//		//		{
	//		//			x : 132,
	//		//			y : 200
	//		//		},
	//		{
	//			x : 160,
	//			y : 326
	//		},
	//		{
	//			x : 204,
	//			y : 187
	//		},
	//		//		{
	//		//			x : 246,
	//		//			y : 337
	//		//		},
	//		//		{
	//		//			x : 266,
	//		//			y : 167
	//		//		},
	//		{
	//			x : 160,
	//			y : 38
	//		} 
	];
	points.polygon2 = [
		{
			x : 155,
			y : 137
		},
		{
			x : 132,
			y : 315
		},
		{
			x : 323,
			y : 286
		},
	];

	isClosed.polygon1 = true;
	isClosed.polygon2 = true;
	repaint("polygon1");
	repaint("polygon2");
	slice();
}

function clearCanvases() {
	points.polygon1 = [];
	points.polygon2 = [];

	isClosed.polygon1 = false;
	isClosed.polygon2 = false;
	repaint("polygon1");
	repaint("polygon2");
}

function repaint(elementId) {
	const canvas = $("#" + elementId).get(0);
	const context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.height, canvas.width);
	// for obscure reasons, clearRect refuses to clear the whole canvas.  fillRect has the same problem.  so......
	context.clearRect(canvas.width / 2, 0, canvas.height, canvas.width);
	if (points[elementId].length > 0) {
		var prevPoint = points[elementId][points[elementId].length - 1];
		context.strokeStyle = "#000000";
		context.fillStyle = "rgba(255, 20, 0, 0.4)";
		context.beginPath();
		context.moveTo(prevPoint.x, prevPoint.y);
		for (var point of points[elementId]) {
			context.lineTo(point.x, point.y); //
		}
		context.closePath();
		context.fill();

		for (var point of points[elementId]) {
			context.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
			context.fill();
			context.beginPath();
			context.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
			context.stroke(); //
		}
	}
}


function drawLine(canvas, x1, y1, m) {
	const context = canvas.getContext("2d");
	context.strokeStyle = "#00ff00";
	context.beginPath();
	var y = m * -x1 + y1;
	context.moveTo(0, y);
	const x = canvas.width;
	y = m * (x - x1) + y1;
	context.lineTo(x, y);
	context.stroke();
}

function isIntersecting(segment1, segment2) {
	var slope1 = (segment1[0].y - segment1[1].y) / (segment1[0].x - segment1[1].x);
	if (!Number.isFinite(slope1)) {
		slope1 = Number.MAX_SAFE_INTEGER;
	}
	var slope2 = (segment2[0].y - segment2[1].y) / (segment2[0].x - segment2[1].x);
	if (!Number.isFinite(slope2)) {
		slope2 = Number.MAX_SAFE_INTEGER;
	}
	//					console.log("slope1 ", slope1);
	//					console.log("slope2 ", slope2);

	const b1 = segment1[1].y - slope1 * segment1[1].x;
	const b2 = segment2[1].y - slope2 * segment2[1].x;

	const intersectionPoint = {};
	intersectionPoint.x = (b2 - b1) / (slope1 - slope2);
	intersectionPoint.y = slope2 * (intersectionPoint.x - segment2[1].x) + segment2[1].y;
	//					console.log("intersectionPoint", intersectionPoint);
	const minX1 = Math.min(segment2[0].x, segment2[1].x);
	const maxX1 = Math.max(segment2[0].x, segment2[1].x);
	const minY1 = Math.min(segment2[0].y, segment2[1].y);
	const maxY1 = Math.max(segment2[0].y, segment2[1].y);
	const minX2 = Math.min(segment1[0].x, segment1[1].x);
	const maxX2 = Math.max(segment1[0].x, segment1[1].x);
	const minY2 = Math.min(segment1[0].y, segment1[1].y);
	const maxY2 = Math.max(segment1[0].y, segment1[1].y);
	//					console.log("current segment min x", minX1);
	//					console.log("current segment max x", maxX1);
	//					console.log("current segment min y", minY1);
	//					console.log("current segment max y", maxY1);
	//					console.log("intersecting segment min x", minX2);
	//					console.log("intersecting segment max x", maxX2);
	//					console.log("intersecting segment min y", minY2);
	//					console.log("intersecting segment max y", maxY2);
	return intersectionPoint.x > minX1 &&
		intersectionPoint.x < maxX1 &&
		intersectionPoint.y > minY1 &&
		intersectionPoint.y < maxY1 &&
		intersectionPoint.x > minX2 &&
		intersectionPoint.x < maxX2 &&
		intersectionPoint.y > minY2 &&
		intersectionPoint.y < maxY2 &&
		!(segment2[0].x == Math.round(intersectionPoint.x) && segment2[0].y == Math.round(intersectionPoint.y));
}

function distance(p1, p2) {
	return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

function pointsEqual(p1, p2) {
	return p1.x == p2.x && p1.y == p2.y;
}

function isPointIn(point, _points) {
	for (var p of points) {
		if (pointsEqual(p, point)) {
			return true;
		} //
	}
	return false;
}

function findEar(_points) {
	const canvas = $("#test-canvas").get(0);
	const context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.height, canvas.width);
	// for obscure reasons, clearRect refuses to clear the whole canvas.  fillRect has the same problem.  so......
	context.clearRect(canvas.width / 2, 0, canvas.height, canvas.width);
	context.fillStyle = "rgba(255, 20, 0, 0.4)";
	context.font = "30px Arial";
	const prevPoint = _points[_points.length - 1];
	context.beginPath();
	context.moveTo(prevPoint.x, prevPoint.y);
	for (var point of _points) {
		context.lineTo(point.x, point.y); //
	}
	context.closePath();
	context.fill();

	//	for (var i in _points) {
	//		const point = _points[i];
	//		context.fillText(i, point.x, point.y); //
	//	}

	var segment = null;
	for (var i in _points) {
		i = parseInt(i);
		segment = [ _points[i], _points[(i + 2) % _points.length] ];

		var isOutside = false;
		// ensure that segment is not outside of polygon
		const dx = segment[1].x - segment[0].x;
		const dy = segment[1].y - segment[0].y;
		const numSteps = 32;
		for (var j = 1; j < numSteps; j++) {
			const midpoint = {
				x : segment[0].x + (j * dx / numSteps),
				y : segment[0].y + (j * dy / numSteps)
			};

			const pData = context.getImageData(midpoint.x, midpoint.y, 1, 1).data;
			console.log("i", i);
			console.log("step", j);
			console.log("pData", pData);

			if (pData[0] == 0 && pData[1] == 0 && pData[2] == 0) {
				// outside
				isOutside = true;
				break;
			}
		}
		if (!isOutside) {
			return {
				segment : segment,
				pointIndex : i + 1
			};
		}
	}
	return null;
}
