var canvas = document.getElementById('fireworks');
var context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var fireworks = [];
var fireworkCount = 5;

initClearCanvas();
generateFireworks();

function initClearCanvas() {
	context.fillStyle = "rgba(0,0,0,1)";
	context.fillRect(0,0,canvas.width,canvas.height);
}

function generateFireworks() {
	for (var i = 0; i < fireworkCount; i++) {
		fireworks.push(new Firework());
	}
}

setInterval(world, 30);

function clearCanvas() {
	context.fillStyle = "rgba(0,0,0,0.5)";
	context.fillRect(0,0,canvas.width,canvas.height);
}

function randomBetween(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function world() {
	clearCanvas();
	for (var i = 0; i < fireworks.length; i++) {
		if (!fireworks[i].explode) {
			fireworks[i].update().draw();
		};
		if (fireworks[i].explode) {
			for (var j = 0; j < fireworks[i].particles.length; j++) {
				if (fireworks[i].particles[j].life > 0) {
					fireworks[i].particles[j].update().draw();
				};
				if (fireworks[i].particles[0].life <= 0) {
					fireworks[i] = new Firework();
				};
			}
		};
	}
}

function Flash() {
	// context.fillStyle = "rgba(255,255,255,0.5)";
	// context.fillRect(0,0,canvas.width,canvas.height);
}

function Firework() {
	this.x = randomBetween(0,canvas.width);
	this.y = canvas.height;
	this.radius = randomBetween(1,1);
	this.explode = false;
	this.speed = randomBetween(7,10) * this.radius;

	this.particles = [];
	this.particleCount = 100;

	this.col = randomBetween(1,7);
	this.life = randomBetween(canvas.height/2, canvas.height - 100);
	this.tail = 100;

	this.generateParticles = function() {
		for (var i = 0; i < this.particleCount; i++) {
			this.particles.push(new Particle(this.x, this.y, this.col));
		}
	}

	this.update = function() {
		if (this.life > 0 && this.y <= this.y + this.tail) {
			this.life -= this.speed;
			this.y -= this.speed;
		};
		if (this.life <= 0 || this.y >= this.y + this.tail) {
			this.explode = true;
		};
		if (this.explode) {
			Flash();
			this.generateParticles();
		};

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.fillStyle = "#fff";
		context.fill();
		context.strokeStyle = "#fff";
		context.stroke();

		return this;
	}
}

function Particle(x,y,col) {
	this.x = x;
	this.y = y;
	this.angle = randomBetween(1, 360);
	this.radius = randomBetween(1,3);
	this.speed = randomBetween(1,10);
	this.life = 2;
	this.r = 0;
	this.g = 0;
	this.b = 0;

	this.color = function() {
	    var prioColor = col;
	    
        if (prioColor == 1) {
            this.r = randomBetween(50,255);
        };
        if (prioColor == 2) {
            this.g = randomBetween(50,255);
        };
        if (prioColor == 3) {
            this.b = randomBetween(50,255);
        };
        if (prioColor == 4) {
            this.r = randomBetween(50,255);
            this.g = randomBetween(50,255);
        };
        if (prioColor == 5) {
            this.g = randomBetween(50,255);
            this.b = randomBetween(50,255);
        };
        if (prioColor == 6) {
            this.b = randomBetween(50,255);
            this.r = randomBetween(50,255);
        };
	}
	this.color();

	this.update = function() {
		this.life-=0.03;

		var dx = Math.cos(this.angle) * this.speed;
		var dy = Math.sin(this.angle) * this.speed;
		this.x += dx;
		this.y += dy;

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+","+this.life+")";
		context.fill();

		return this;
	}
}