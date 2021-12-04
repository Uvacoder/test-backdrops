var canvas = document.getElementById('golden');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var points = [];
var mult = 0;

var mouse = {x: -1, y: -1};
var pressing = false;

function Point(angle, i) {
    this.i = i * 2;
    this.r = 3;
    this.updateAngle = function(a) {
        this.a = a % 360;
        this.x = (canvas.width / 2) + (Math.cos(this.a * (180 / Math.PI)) * this.i);
        this.y = (canvas.height / 2) + (Math.sin(this.a * (180 / Math.PI)) * this.i);
    };
    this.updateAngle(angle);
    this.draw = function() {
        context.fillStyle = 'white';
        context.shadowBlur = 16;
        context.shadowColor = 'gold';
        context.beginPath();
        context.arc(this.x, this.y, this.r, Math.PI*2, false);
        context.fill();
        context.shadowBlur = 0;
        if (pressing && mouse.x > -1) {
            // context.strokeStyle = i % 2 == 0 ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.1)';
            context.strokeStyle = 'rgba(255,215,0,0.1)';
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
        }
    }
}

function initializePoints(count, mult) {
    var a = 0;
    for (var i = 0; i < count; i++) {
        points.push(new Point(a + (360 * mult), i));
        a += (360 * mult);
    }
};

function updatePoints(mult) {
    var a = 0;
    for (var point of points) {
        point.updateAngle(a + (360 * mult));
        a += (360 * mult);
    }
};

context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);
function clearCanvas() {
    context.fillStyle = 'rgba(0, 0, 0, 1)';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function getHypothenuse(x1, y1, x2, y2) {
    var x = Math.abs(x1 - x2);
    var y = Math.abs(y1 - y2);
    return Math.sqrt((x * x) + (y * y));
}

initializePoints(200, mult);
function world() {
    clearCanvas();
    updatePoints(mult);
    for (var p of points) {
        p.draw();
    }
    if (!pressing) {
        for (var pp of points) {
            for (var p of points) {
                if (pp != p && getHypothenuse(pp.x, pp.y, p.x, p.y) < 100) {
                    context.strokeStyle = 'rgba(255,215,0,0.1)';
                    context.beginPath();
                    context.moveTo(pp.x, pp.y);
                    context.lineTo(p.x, p.y);
                    context.stroke();
                }
            }
        }
    }
    mult += 0.00000001;
    mult = mult >= 1 ? mult % 1: mult;
}

setInterval(world, 30);

window.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});

window.addEventListener('mousedown', function(e) {
    pressing = true;
});

window.addEventListener('mouseup', function(e) {
    pressing = false;
});
