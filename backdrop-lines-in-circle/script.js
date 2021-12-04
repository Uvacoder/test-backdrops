let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let radius = 300;
let pointsCount = 300;
let skip = 0;
let points = [];
function generatePoints() {
    points = [];
    for (let i = 0; i < pointsCount; i++) {
        let angle = (360 / pointsCount) * i;
        points.push({
            x: (canvas.width / 2) + (Math.cos(angle * (Math.PI / 180)) * radius),
            y: (canvas.height / 2) + (Math.sin(angle * (Math.PI / 180)) * radius)
        });
    };
}; generatePoints();

function step() {
    context.fillStyle = 'rgba(0, 0, 0, 1)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        let skipIndex = (i * skip) % points.length;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(points[skipIndex].x, points[skipIndex].y);
        context.strokeStyle = 'rgba(255, 255, 255, 1)';
        context.stroke();
    }
    skip++;
    if (skip == pointsCount) {
        skip = 0;
    }
    window.requestAnimationFrame(step);
};
window.requestAnimationFrame(step);
