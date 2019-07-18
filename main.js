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
	var polygonId = 1;
	const canvas = $("#polygon" + polygonId).get(0);
	const context = canvas.getContext("2d");
	context.strokeStyle = "#00ff00";
	for (var i in points["polygon" + polygonId]) {

	}
}

function repaint(elementId) {
	const canvas = $("#" + elementId).get(0);
	const context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.height, canvas.width);
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
		context.stroke(); }
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
