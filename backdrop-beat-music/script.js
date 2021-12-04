
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// canvas

let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// audio

let input = document.querySelector('input');
let audio = document.querySelector('audio');
let audioCtx, analyser, source, raw = [];

input.addEventListener('change', function() {
    if (!audioCtx) {
        // The Web Audio API provides a powerful and versatile system for
        // controlling audio on the Web, allowing us to choose audio
        // sources, add effects to audio, create audio visualizations,
        // apply spatial effects, and much more.
        audioCtx = new AudioContext();

        // The AnalyserNode interface represents a node able to provide real-time
        // frequency and time-domain analysis information. It is an AudioNode that
        // passes the audio stream unchanged from the input to the output, but allows
        // you to take the generated data, process it, and create audio visualizations.
        analyser = audioCtx.createAnalyser();

        // The MediaElementAudioSourceNode interface represents
        // an audio source consisting of an HTML5 <audio> or <video> element.
        source = audioCtx.createMediaElementSource(audio);

        source.connect(analyser);

        // The AudioDestinationNode interface represents the end destination of
        // an audio graph in a given context — usually the speakers of your device.
        analyser.connect(audioCtx.destination);
    }

    let url = URL.createObjectURL(this.files[0]);
    audio.src = url;
    audio.play();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// modes

let beats = [];
let mode = 3;

window.addEventListener('keypress', function(e) {
    if      (e.keyCode == 49) modeSet(1);
    else if (e.keyCode == 50) modeSet(2);
    else if (e.keyCode == 51) modeSet(3);
    else if (e.keyCode == 52) modeSet(4);
    else if (e.keyCode == 53) modeSet(5);
});

modeSet(mode);
function modeSet(m) {
    beats = [];
    mode = m;
    if (mode == 1) {
        for (let i = 0; i < 700; i++) {
            beats.push(new Particle1(i));
        }
    } else if (mode == 2) {
        for (let i = 95; i < 175; i += 0.5) {
            beats.push(new Particle2(i));
        }
        for (let i = 185; i < 265; i += 0.5) {
            beats.push(new Particle2(i));
        }
        for (let i = 275; i < 355; i += 0.5) {
            beats.push(new Particle2(i));
        }
        for (let i = 365; i < 445; i += 0.5) {
            beats.push(new Particle2(i));
        }
    } else if (mode == 3) {
        for (let i = 200; i < canvas.width - 200; i += 3) {
            beats.push(new Particle3(i));
        }
    } else if (mode == 4) {
        for (let i = 0; i < 200; i++) {
            beats.push(new Particle4(i));
        }
    } else if (mode == 5) {
        for (let i = 200; i < canvas.width - 200; i += 3) {
            beats.push(new Particle3(i));
        }
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// main loop

clearCanvas();
setInterval(function() {
    clearCanvas();

    if (!audio.paused) {
        // The frequencyBinCount read-only property of the AnalyserNode interface
        // is an unsigned integer. This generally equates to the number of data
        // values you will have to play with for the visualization.
        raw = new Uint8Array(analyser.frequencyBinCount);

        if (mode == 1 || mode == 3) {
            // The getByteFrequencyData() method of the AnalyserNode interface copies
            // the current frequency data into a Uint8Array (unsigned byte array) passed into it.
            analyser.getByteFrequencyData(raw);
        } else {
            // The getByteTimeDomainData() method of the AnalyserNode Interface copies the
            // current waveform, or time-domain, data into a Uint8Array (unsigned byte array) passed into it.
            analyser.getByteTimeDomainData(raw);
        }
    }

    if (mode == 1) {
        for (let i = 0; i < beats.length; i++) {
            beats[i].update(raw[Math.floor(700 / beats.length) * i]).draw();
        }
        connectParticle1();
    } else if (mode == 2) {
        for (let i = 0; i < beats.length; i++) {
            beats[i].update(raw[i] - 128).draw();
        };
    } else if (mode == 3) {
        for (let i = 0; i < beats.length; i++) {
            beats[i].update(raw[i]).draw();
        }
    } else if (mode == 4) {
        for (let i = 0; i < beats.length; i++) {
            beats[i].update((raw[i] - 128) * 2).draw();
        }
    } else if (mode == 5) {
        for (let i = 0; i < beats.length; i++) {
            beats[i].update(raw[i]).draw();
        }
    }
}, 1000 / 144);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// support functions

function clearCanvas() {
    context.fillStyle = mode == 1 ? 'rgba(0,0,0,0.1)' : 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
};

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function getHypothenuse(x1, y1, x2, y2) {
    let x = Math.abs(x1 - x2);
    let y = Math.abs(y1 - y2);
    return Math.sqrt((x * x) + (y * y));
};

function connectParticle1() {
    let connRadius = 50;
    for (let i = 0; i < beats.length; i++) {
        for (let j = i + 1; j < beats.length; j++) {
            if (getHypothenuse( beats[i].x, beats[i].y, beats[j].x, beats[j].y) <= connRadius && beats[i].opacity > 0 && beats[j].opacity > 0) {
                let opacity = Math.abs((getHypothenuse(beats[i].x, beats[i].y, beats[j].x, beats[j].y)) - connRadius) * (1 / connRadius);
                context.strokeStyle = 'rgba(255, 225, 255, ' + opacity + ')';
                context.beginPath();
                context.moveTo(beats[i].x, beats[i].y);
                context.lineTo(beats[j].x, beats[j].y);
                context.stroke();
                context.beginPath();
                context.moveTo(canvas.width / 2 + (canvas.width / 2 - beats[i].x), beats[i].y);
                context.lineTo(canvas.width / 2 + (canvas.width / 2 - beats[j].x), beats[j].y);
                context.stroke();
            }
        }
    }
    context.strokeStyle = '#fff';
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, 210, Math.PI * 2, false);
    context.fill();
    context.stroke();
};

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    modeSet(mode);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// particle objects

function Particle1(x) {
    this.set = function() {
        this.ang = randomBetween(0, 360);
        let dx = Math.cos(this.ang * Math.PI / 180);
        let dy = Math.sin(this.ang * Math.PI / 180);
        this.x = canvas.width / 2 + dx * randomBetween(0, 200);
        this.y = canvas.height / 2 + dy * randomBetween(0, 200);
        this.x = randomBetween(0, canvas.width);
        this.y = randomBetween(0, canvas.height);
        this.radius = 1;
        this.speed = 1;
        this.opacity = 0;
        this.angle = randomBetween(90 - 45, 270 + 45);
        this.minAngle = this.angle - randomBetween(45, 90);
        this.maxAngle = this.angle + randomBetween(45, 90);
        this.isAngleIncreasing = false;
    }; this.set();

    this.update = function(beat) {
        this.beat = beat;

        if (getHypothenuse(this.x, this.y, canvas.width / 2, canvas.height / 2) > 200) {
            this.set();
        }

        this.opacity -= 0.01;
        if (this.beat > 150) {
            this.opacity = 1;
        } else  {
            this.set();
        }
        this.speed = this.beat / 40;
        if (this.speed <= 0) {
            this.speed = 0.5;
        }

        if (this.angle <= this.minAngle || this.angle >= this.maxAngle) {
            this.isAngleIncreasing = !this.isAngleIncreasing;
        }
        if (this.isAngleIncreasing) {
            this.angle += this.speed;
        } else {
            this.angle -= this.speed;
        }

        let dx = Math.cos(this.angle * Math.PI / 180) * this.speed;
        let dy = Math.sin(this.angle * Math.PI / 180) * this.speed;
        this.x += dx;
        this.y += dy;

        this.color = 'rgba(255,255,255,' + this.opacity + ')';

        if (this.x - this.radius > canvas.width || this.x + this.radius < 0 ||
            this.y - this.radius > canvas.height || this.y + this.radius < 0) {
            this.set();
        }

        return this;
    };

    this.draw = function() {
        context.fillStyle = this.color;
        context.strokeStyle = this.color;

        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        context.fill();
        context.beginPath();
        context.arc(canvas.width / 2 + (canvas.width / 2 - this.x), this.y, this.radius, Math.PI * 2, false);
        context.fill();
    };
};

function Particle2(ang) {
    this.distanceRadius = canvas.height / 4;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.color = 'rgba(255, 255, 255, 1)';
    this.angle = ang;
    this.update = function(beat) {
        this.beat = !beat ? 0 : beat * 2;
        let dx = Math.cos(this.angle * Math.PI / 180);
        let dy = Math.sin(this.angle * Math.PI / 180);
        this.px1 = this.x + dx * this.distanceRadius;
        this.py1 = this.y + dy * this.distanceRadius;
        this.px2 = this.px1 + (dx * this.beat);
        this.py2 = this.py1 + (dy * this.beat);
        return this;
    };
    this.draw = function() {
        context.fillStyle = this.color;
        context.strokeStyle = this.color;
        context.shadowBlur = 25;
        context.shadowColor = 'skyblue';
        context.lineCap = 'round';
        context.lineWidth = 5;

        context.beginPath();
        context.arc(this.px2, this.py2, 5, Math.PI * 2, false);
        context.fill();

        context.shadowBlur = 0;
        context.lineWidth = 1;
    };
};

function Particle3(x) {
    this.x = x;
    this.y = canvas.height / 2;
    this.update = function(beat) {
        this.beat = !beat ? 0 : beat;
        return this;
    };
    this.draw = function() {
        context.lineCap = 'round';
        context.lineWidth = 2;
        context.strokeStyle = 'white';
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x, this.y - this.beat);
        context.stroke();
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x, this.y + this.beat);
        context.stroke();
        context.lineWidth = 1;
    };
};

function Particle4(i) {
    this.i = i;
    this.dim = randomBetween(1, 20);
    this.update = function(beat) {
        this.beat = beat;
        this.dim = beat / 2;
        if (this.dim + this.i > 200) {
            this.dim = 200 - this.i;
        }
        return this;
    };
    this.draw = function() {
        context.fillStyle = 'rgba(253, 81, 98, 0.01)';
        context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        context.lineWidth = 1;
        if (this.beat >= 0) {
            context.beginPath(); // right
            context.arc(canvas.width / 2 + 200 - this.beat, (canvas.height / 2) - this.i, this.dim, Math.PI * 2, false);
            context.stroke();
            context.fill();
            context.beginPath();
            context.arc(canvas.width / 2 + 200 - this.beat, (canvas.height / 2) + this.i, this.dim, Math.PI * 2, false);
            context.stroke();
            context.fill();

            context.beginPath(); // left
            context.arc(canvas.width / 2 - 200 + this.beat, (canvas.height / 2) - this.i, this.dim, Math.PI * 2, false);
            context.stroke();
            context.fill();
            context.beginPath();
            context.arc(canvas.width / 2 - 200 + this.beat, (canvas.height / 2) + this.i, this.dim, Math.PI * 2, false);
            context.stroke();
            context.fill();

            context.beginPath(); // up
            context.arc((canvas.width / 2) - this.i, (canvas.height / 2) - 200 + this.beat, this.dim, Math.PI * 2, false);
            context.stroke();
            context.fill();
            context.beginPath();
            context.arc((canvas.width / 2) + this.i, (canvas.height / 2) - 200 + this.beat, this.dim, Math.PI * 2, false);
            context.stroke();
            context.fill();

            context.beginPath(); // down
            context.arc((canvas.width / 2) - this.i, (canvas.height / 2) + 200 - this.beat, this.dim, Math.PI * 2, false);
            context.stroke();
            context.fill();
            context.beginPath();
            context.arc((canvas.width / 2) + this.i, (canvas.height / 2) + 200 - this.beat, this.dim, Math.PI * 2, false);
            context.stroke();
            context.fill();
        }
        context.strokeRect(canvas.width / 2 - 210, canvas.height / 2 - 210, 420, 420); // draw square
    };
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// end
