// Base demo class, with the facility for draggable points

class Demo {
	
	constructor(canvasId, customUpdate, customRender, ...points) {
		this.customUpdate = customUpdate;
		this.customRender = customRender;
		this.points = points;
		
		this.canvas = document.getElementById("demo" + canvasId);
		this.canvas.width = 300;
		this.canvas.height = 300;
		
		this.dragging = -1;
		
		this.rect = this.canvas.getBoundingClientRect();
		
		this.canvas.onmousemove = (ev)=>{
			let mouse = this.mouseCoords(ev);
			
			// Check if the mouse is over any points
			for (let point of this.points) {
				point.mouseOver =
					point.draggable &&
					mouse.x >= point.x - point.handleSize &&
					mouse.x <= point.x + point.handleSize &&
					mouse.y >= point.y - point.handleSize &&
					mouse.y <= point.y + point.handleSize;
			}
			
			// Move the point being dragged (if any)
			if (this.dragging != -1) {
				let point = this.points[this.dragging];
				point.x = mouse.x;
				point.y = mouse.y;
				point.updateFunc(point);
			}
			
			this.update();
			this.render();
		}
		
		this.canvas.onmousedown = ()=>{
			// Check if the mouse is over any points
			for (let i = 0; i < this.points.length; i++) {
				if (this.points[i].mouseOver && this.points[i].draggable) {
					this.dragging = i;
					break;
				}
			}
			
			this.update();
			this.render();
		}
		
		this.canvas.onmouseup = ()=>{
			this.dragging = -1;
			
			this.update();
			this.render();
		}
		
		this.ctx = this.canvas.getContext("2d");
		
		this.update();
		this.render();		
	}
	
	mouseCoords(ev) {
		this.rect = this.canvas.getBoundingClientRect();
		return {
			x: ev.clientX - this.rect.left,
			y: ev.clientY - this.rect.top
		}
	}
	
	update() {
		this.customUpdate(this.ctx, this.points);
		
		// Update the points
	}
	
	render() {
		// Clear the canvas
		this.ctx.fillStyle = "#212121";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		// Custom rendering!
		this.customRender(this.ctx, this.points);
		
		// Render the points
		for (let point of this.points) {
			if (point.visible) {
				this.ctx.fillStyle = (point.mouseOver) ? "#E91E63" : "#ffffff";
				this.ctx.beginPath();
				this.ctx.ellipse(
					point.x,
					point.y,
					point.handleSize,
					point.handleSize,
					0,
					0,
					2 * Math.PI
				);
				this.ctx.fill();
			}
		}
	}
	
}

class Point {
	constructor(x, y, draggable = true, visible = true, handleSize = 4, updateFunc = ()=>{}) {
		this.x = x;
		this.y = y;
		this.draggable = draggable;
		this.visible = visible;
		this.handleSize = handleSize;
		this.mouseOver = false;
		this.updateFunc = updateFunc;
	}
}

// Create the demos

let demos = [];

window.onload = ()=>{
	
	new Demo(1, ()=>{}, (ctx, pts)=>{
		canvasGrid(ctx, 30, 30);
		
		ctx.strokeStyle = "#03A9F4";
		ctx.lineWidth = 5;
		ctx.lineCap = "round";
		ctx.beginPath();
		canvasArrow(ctx, pts[0].x, pts[0].y, pts[1].x, pts[1].y);
		ctx.stroke();
		ctx.closePath();
	}, new Point(150, 150, false, false), new Point(210, 30, true, false, 20, (pt)=>{
		let vector = document.querySelectorAll("#demo1Jax .MJXc-TeX-main-R");
		vector[0].innerHTML = parseFloat(((pt.x / 30) - 5).toFixed(2)); // X
		vector[1].innerHTML = -1 * parseFloat(((pt.y / 30) - 5).toFixed(2)); // Y
	}));
	
	let demoTwo;
	
	const updateDemoTwo = ()=>{
		// Make the first two points into a vector
		let x1 = parseFloat(((demoTwo.points[1].x - demoTwo.points[0].x) / 30).toFixed(2));
		let y1 = parseFloat((-1 * ((demoTwo.points[1].y - demoTwo.points[0].y) / 30)).toFixed(2));
		
		// Make the second two points into a vector
		let x2 = parseFloat(((demoTwo.points[2].x - demoTwo.points[1].x) / 30).toFixed(2));
		let y2 = parseFloat((-1 * ((demoTwo.points[2].y - demoTwo.points[1].y) / 30)).toFixed(2));
		
		// Add the vectors together
		let x3 = parseFloat((x1 + x2).toFixed(2));
		let y3 = parseFloat((y1 + y2).toFixed(2));
		
		// Update the JAX
		let vector = document.querySelectorAll("#demo2Jax .MJXc-TeX-main-R");
		
		vector[0].innerHTML = x1;
		vector[1].innerHTML = y1;
		vector[3].innerHTML = x2;
		vector[4].innerHTML = y2;
		vector[6].innerHTML = x1;
		vector[8].innerHTML = x2;
		vector[9].innerHTML = y1;
		vector[11].innerHTML = y2;
		vector[13].innerHTML = x3;
		vector[14].innerHTML = y3;
	}
	
	demoTwo = new Demo(2, ()=>{}, (ctx, pts)=>{
		canvasGrid(ctx, 30, 30);
		
		ctx.strokeStyle = "#03A9F4";
		ctx.lineWidth = 5;
		ctx.lineCap = "round";
		
		ctx.beginPath();
		canvasArrow(ctx, pts[0].x, pts[0].y, pts[1].x, pts[1].y);
		ctx.stroke();
		ctx.closePath();
		
		ctx.strokeStyle = "#00BCD4";
		ctx.beginPath();
		canvasArrow(ctx, pts[1].x, pts[1].y, pts[2].x, pts[2].y);
		ctx.stroke();
		ctx.closePath();
		
		ctx.strokeStyle = "#FFC107";
		ctx.beginPath();
		canvasArrow(ctx, pts[0].x, pts[0].y, pts[2].x, pts[2].y);
		ctx.stroke();
		ctx.closePath();
	},
		new Point(30, 180, true, true, 4, updateDemoTwo),
		new Point(120, 90, true, false, 20, updateDemoTwo),
		new Point(270, 60, true, false, 20, updateDemoTwo)
	);
	
	setTimeout(()=>{
		let matrices = document.querySelectorAll("#demo2Jax .mjx-math > .mjx-mrow > .mjx-mrow");
		matrices[0].style.color = "#03A9F4";
		matrices[1].style.color = "#00BCD4";
		matrices[3].style.color = "#FFC107";
	}, 1000);
	
	let demoThreeNotZero = true;
	
	let demoThree = new Demo(3, ()=>{}, (ctx, pts)=>{
		canvasGrid(ctx, 30, 30);
		
		ctx.strokeStyle = "#03A9F488";
		ctx.lineWidth = 5;
		ctx.lineCap = "round";
		
		ctx.beginPath();
		canvasArrow(ctx, pts[0].x, pts[0].y, pts[1].x, pts[1].y);
		ctx.stroke();
		ctx.closePath();
		
		if (demoThreeNotZero) {
			ctx.strokeStyle = "#03A9F4";
			ctx.beginPath();
			canvasArrow(ctx, pts[2].x, pts[2].y, pts[3].x, pts[3].y);
			ctx.stroke();
			ctx.closePath();
		}
	}, 
		new Point(30, 180, false, false),
		new Point(120, 120, false, false),
		new Point(120, 180, false, false),
		new Point(300, 60, false, false)
	);
	
	document.getElementById("scalarInput").oninput = (ev)=>{
		// Update diagram
		let newValue = ev.target.value;
		demoThree.points[3].x = (90 * newValue) + 120;
		demoThree.points[3].y = (-60 * newValue) + 180;
		demoThreeNotZero = newValue != 0;
		demoThree.render();
		
		// Update JAX
		let vector = document.querySelectorAll("#demo3Jax .MJXc-TeX-main-R");
		vector[0].innerHTML = newValue;
		vector[5].innerHTML = newValue;
		vector[8].innerHTML = newValue;
		vector[12].innerHTML = newValue * 3;
		vector[13].innerHTML = newValue * 2;
	}
	
	new Demo(4, ()=>{}, (ctx, pts)=>{
		canvasGrid(ctx, 30, 30);
		
		ctx.lineWidth = 5;
		ctx.lineCap = "round";
		
		ctx.strokeStyle = "#888";
		ctx.beginPath();
		ctx.moveTo(pts[0].x, pts[0].y);
		ctx.lineTo(pts[1].x, pts[0].y);
		ctx.moveTo(pts[1].x, pts[0].y);
		ctx.lineTo(pts[1].x, pts[1].y);
		ctx.stroke();
		
		ctx.strokeStyle = "#03A9F4";
		ctx.beginPath();
		canvasArrow(ctx, pts[0].x, pts[0].y, pts[1].x, pts[1].y);
		ctx.stroke();
		ctx.closePath();
	}, new Point(150, 150, false, false), new Point(210, 30, true, false, 20, (pt)=>{
		let vector = document.querySelectorAll("#demo1Jax .MJXc-TeX-main-R");
		vector[0].innerHTML = parseFloat(((pt.x / 30) - 5).toFixed(2)); // X
		vector[1].innerHTML = -1 * parseFloat(((pt.y / 30) - 5).toFixed(2)); // Y
	}));
	
	new Demo(5, ()=>{}, (ctx, pts)=>{
		canvasGrid(ctx, 30, 30);
		
		ctx.lineWidth = 5;
		ctx.lineCap = "round";
		
		// Get the vectors
		
		let A = pts[0];
		let B = pts[1];
		let C = pts[2];
		
		// Do the projection
		
		let BMinusA = {x: B.x - A.x, y: B.y - A.y};
		let CMinusA = {x: C.x - A.x, y: C.y - A.y};
		let dot = (BMinusA.x * CMinusA.x) + (BMinusA.y * CMinusA.y);
		let mag = Math.sqrt((BMinusA.x*BMinusA.x) + (BMinusA.y*BMinusA.y));
		let mag2 = mag * mag;
		
		let s = dot / mag2;
		
		let pX = ((1-s)*A.x) + (s * B.x);
		let pY = ((1-s)*A.y) + (s * B.y);
		
		
		// let BB = {x: ((B.x) / 30) - 5, y: -1 * (((B.y) / 30) - 5)};
		// let CC = {x: ((C.x) / 30) - 5, y: -1 * (((C.y) / 30) - 5)};
		
		// Find the angle
		// let abDot = (BB.x * CC.x) + (BB.y * CC.y);
		// let aMag = Math.sqrt((BB.x * BB.x) + (BB.y * BB.y));
		// let bMag = Math.sqrt((CC.x * CC.x) + (CC.y * CC.y));
		// 
		// let angle = Math.acos((abDot) / (aMag * bMag));
		// 
		// ctx.beginPath();
		// ctx.arc(150, 150, 20, 0, angle);
		// ctx.stroke();
		
		// Do the drawing
		
		ctx.strokeStyle = "#888";
		ctx.beginPath();
		ctx.moveTo(pts[2].x, pts[2].y);
		ctx.lineTo(pX, pY);
		ctx.stroke();
		ctx.closePath();
		
		ctx.strokeStyle = "#f44336";
		ctx.beginPath();
		canvasArrow(ctx, pts[0].x, pts[0].y, pts[1].x, pts[1].y);
		ctx.stroke();
		ctx.closePath();
		
		ctx.strokeStyle = "#03A9F4";
		ctx.beginPath();
		canvasArrow(ctx, pts[0].x, pts[0].y, pts[2].x, pts[2].y);
		ctx.stroke();
		ctx.closePath();
		
		ctx.strokeStyle = "#FFC107";
		ctx.beginPath();
		ctx.moveTo(pts[0].x, pts[0].y);
		ctx.lineTo(pX, pY);
		ctx.stroke();
		ctx.closePath();
		
	},
		new Point(150, 150, false, false),
		new Point(240, 150, true, false, 20),
		new Point(210, 90, true, false, 20)
	);
	
	let demoSix = new Demo(6, ()=>{}, (ctx, pts)=>{
		canvasGrid(ctx, 30, 30);
		
		ctx.strokeStyle = "#03A9F4";
		ctx.lineWidth = 5;
		ctx.lineCap = "round";
		ctx.beginPath();
			ctx.moveTo(pts[0].x, pts[0].y);
			for (let point of pts) {
				ctx.lineTo(point.x, point.y);
			}
			ctx.lineTo(pts[0].x, pts[0].y);
		ctx.stroke();
		ctx.closePath();
	}, 
		new Point(90, 90),
		new Point(210, 90),
		new Point(210, 210),
		new Point(90, 210)
	);
	
	document.getElementById("matrixApply").onclick = ()=>{
		let matrix = [
			matrixValue(1), matrixValue(2), matrixValue(3),
			matrixValue(4), matrixValue(5), matrixValue(6),
			matrixValue(7), matrixValue(8), matrixValue(9)
		];
		
		for (let point of demoSix.points) {
			let x = (matrix[0] * point.x) + (matrix[1] * point.y) + (matrix[2] * 1);
			let y = (matrix[3] * point.x) + (matrix[4] * point.y) + (matrix[5] * 1);
			//let z = (matrix[6] * point.x) + (matrix[7] * point.y) + (matrix[8] * 1);
			
			point.x = x;
			point.y = y;
		}
		
		demoSix.update();
		demoSix.render();
	}
	
	document.getElementById("matrix3Pts").onclick = ()=>{
		demoSix.points = [
			new Point(150, 90),
			new Point(210, 210),
			new Point(90, 210)
		]
		demoSix.update();
		demoSix.render();
	}
	
	document.getElementById("matrix4Pts").onclick = ()=>{
		demoSix.points = [
			new Point(90, 90),
			new Point(210, 90),
			new Point(210, 210),
			new Point(90, 210)
		]
		demoSix.update();
		demoSix.render();
	}
	
	document.getElementById("matrix5Pts").onclick = ()=>{
		demoSix.points = [
			new Point(150, 90),
			new Point(210, 150),
			new Point(180, 210),
			new Point(120, 210),
			new Point(90, 150)
		]
		demoSix.update();
		demoSix.render();
	}
	
	document.getElementById("matrixId").onclick = ()=>{
		for (let i = 1; i <= 9; i++) {
			document.getElementById("matrix" + i).value = (i == 1 || i == 5 || i == 9) ? "1" : "0";
			let type = document.getElementById("matrix" + i + "type");
			if (type) type.value = "";
		}
	}
	
	// updateDemos();
}

function matrixValue(id) {
	let type  = document.getElementById("matrix" + id + "type");
	let value = document.getElementById("matrix" + id).value;
	
	if (type) {
		type = type.value;
		
		if (type == "") return value;
		
		if (document.getElementById("degs").checked) {
			value = value * (Math.PI / 180);
		}
		
		if      (type == "sin")  value =  Math.sin(value);
		else if (type == "-sin") value = -Math.sin(value);
		else if (type == "cos")  value =  Math.cos(value);
		else                     return value;
	}
	
	return value;
}

function updateDemos() {
	for (let demo of demos) {
		demo.update();
		demo.render();
	}
	
	// Run again ASAP
	window.requestAnimationFrame(()=>{
		updateDemos();
	})
}

// Thanks to https://stackoverflow.com/a/6333775
function canvasArrow(context, fromx, fromy, tox, toy) {
	var headlen = 15; // length of head in pixels
	var dx = tox - fromx;
	var dy = toy - fromy;
	var angle = Math.atan2(dy, dx);
	context.moveTo(fromx, fromy);
	context.lineTo(tox, toy);
	context.moveTo(tox, toy)
	context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
	context.moveTo(tox, toy);
	context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function canvasGrid(ctx, xSize, ySize) {
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.strokeStyle = "#555";
	for (let x = 0; x < 300; x += xSize) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, 300);
	}
	for (let y = 0; y < 300; y += ySize) {
		ctx.moveTo(0, y);
		ctx.lineTo(300, y);
	}
	ctx.stroke();
	ctx.closePath();
	
	// ctx.beginPath();
	// ctx.strokeStyle = "#888";
	// ctx.moveTo(((300 / xSize) / 2) * xSize, 0);
	// ctx.lineTo(((300 / xSize) / 2) * xSize, 300);
	// ctx.moveTo(0, ((300 / ySize) / 2) * ySize);
	// ctx.lineTo(300, ((300 / ySize) / 2) * ySize);
	// ctx.stroke();
	// ctx.closePath();
}