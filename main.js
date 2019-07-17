points = {
	polygon1 : [],
	polygon2 : [],
};

function onLoad() {
	//	console.log("load");

	const radius = 16;
	$("canvas").on("click", function(e) {
		const point = {
			x : e.offsetX,
			y : e.offsetY
		};
		const elementId = e.currentTarget.id;
		const context = e.currentTarget.getContext("2d");
		const _lastPoint = points[elementId].length > 0 ? points[elementId][points[elementId].length - 1] : null;
		if (_lastPoint) {
			for (var i in points[elementId]) {
				if (i > 0) {
					var slope1 = (points[elementId][i - 1].y - points[elementId][i].y) / (points[elementId][i - 1].x - points[elementId][i].x);
					if (!Number.isFinite(slope1)) {
						slope1 = MAX_SAFE_INTEGER;
					}
					var slope2 = (_lastPoint.y - point.y) / (_lastPoint.x - point.x);
					if (!Number.isFinite(slope2)) {
						slope2 = MAX_SAFE_INTEGER;
					}
					console.log("slope1 ", slope1);
					console.log("slope2 ", slope2);

					const b1 = points[elementId][i].y - slope1 * points[elementId][i].x;
					const b2 = point.y - slope2 * point.x;

					const intersectionPoint = {};
					intersectionPoint.x = (b2 - b1) / (slope1 - slope2);
					intersectionPoint.y = slope2 * (intersectionPoint.x - point.x) + point.y;
					console.log("intersectionPoint", intersectionPoint);
					const minX1 = Math.min(_lastPoint.x, point.x);
					const maxX1 = Math.max(_lastPoint.x, point.x);
					const minY1 = Math.min(_lastPoint.y, point.y);
					const maxY1 = Math.max(_lastPoint.y, point.y);
					const minX2 = Math.min(points[elementId][i - 1].x, points[elementId][i].x);
					const maxX2 = Math.max(points[elementId][i - 1].x, points[elementId][i].x);
					const minY2 = Math.min(points[elementId][i - 1].y, points[elementId][i].y);
					const maxY2 = Math.max(points[elementId][i - 1].y, points[elementId][i].y);
					console.log("current segment min x", minX1);
					console.log("current segment max x", maxX1);
					console.log("current segment min y", minY1);
					console.log("current segment max y", maxY1);
					console.log("intersecting segment min x", minX2);
					console.log("intersecting segment max x", maxX2);
					console.log("intersecting segment min y", minY2);
					console.log("intersecting segment max y", maxY2);
					if (intersectionPoint.x.toFixed(4) > minX1 &&
						intersectionPoint.x.toFixed(4) < maxX1 &&
						intersectionPoint.y.toFixed(4) > minY1 &&
						intersectionPoint.y.toFixed(4) < maxY1 &&
						intersectionPoint.x.toFixed(4) > minX2 &&
						intersectionPoint.x.toFixed(4) < maxX2 &&
						intersectionPoint.y.toFixed(4) > minY2 &&
						intersectionPoint.y.toFixed(4) < maxY2 &&
						!(_lastPoint.x == Math.round(intersectionPoint.x) && _lastPoint.y == Math.round(intersectionPoint.y))) {

						context.fillStyle = "rgba(255, 0, 0, 1)";
						context.beginPath();
						context.arc(intersectionPoint.x, intersectionPoint.y, 4, 0, Math.PI * 2);
						context.fill();
						context.strokeStyle = "#000000";
						context.beginPath();
						context.arc(intersectionPoint.x, intersectionPoint.y, 4, 0, Math.PI * 2);
						context.stroke();

						return;
					}
				}
			}
		}

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
