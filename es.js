// spawn the agent on canvas

var std = 1.2;

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
  
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
  
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
  
      h /= 6;
    }
  
    return [ h, s, l ];
}

function reward_at(x, y) {
    if (!pixels) {
        return 0;
    }

    x = Math.round(x);
    y = Math.round(y);
    let index = x + y * canvasBottom.width;
    index *= 4;
    let data = pixels.data;

    // return the alpha as the reward
    if (index+3 > pixels.data.length) {
        return 0;
    }

    return data[index+3]/255;
}

function rand_normal() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function gaussianVector(x, y) {
    const z0 = Math.sqrt((-2*Math.log(x))) * Math.cos(2*Math.PI*y);
    const z1 = Math.sqrt((-2*Math.log(x))) * Math.sin(2*Math.PI*y);
    return [z0, z1];
}

class Sample {
    constructor(x, y) {
        this.x = _.clamp(x, 0, canvasBottom.width);
        this.y = _.clamp(y, 0, canvasBottom.height);
        this.value = null;
        this.updateValue();
    }

    updateValue() {
        this.value = reward_at(this.x, this.y);
    }
}

class Agent {
    constructor(x, y, numSamples, range) {
        this.x = x;
        this.y = y;
        this.range = range;
        this.samples = this.createSamples(numSamples);
        this.image = document.getElementById('moth');
    }

    draw() {
        ctxAgent.clearRect(0, 0, canvasAgent.width, canvasAgent.height);
        // drawCircle(ctxAgent, this.x, this.y, 10, 'red');
        ctxAgent.drawImage(this.image, this.x-(this.image.width/2), this.y-(this.image.height/2), 50, 50);
    }

    createSamples(numSamples) {
        const samples = [];
        for (let i=0; i<numSamples; i++) {
            const theta = _.random(0, 2*Math.PI, true);
            // const x = this.x + _.random(0, this.range, true) * Math.cos(theta);
            // const y = this.y + _.random(0, this.range, true) * Math.sin(theta);
            const x = this.x + rand_normal()*this.range*std * Math.cos(theta);
            const y = this.y + rand_normal()*this.range*std * Math.sin(theta);
            const sample = new Sample(x, y);
            samples.push(sample);
        }
        return samples;

    }

    drawSamples() {        
        for (let s of this.samples) {
            // drawCircle(ctxAgent, s.x, s.y, 2, 'red');
            ctxAgent.drawImage(this.image, s.x-(this.image.width/2), s.y-(this.image.height/2), 5, 5);
        }

    }

    updateSamples() {
        for (let s of this.samples) {
            const theta = _.random(0, 2*Math.PI, true);
            // const x = this.x + _.random(0, this.range, true) * Math.cos(theta);
            // const y = this.y + _.random(0, this.range, true) * Math.sin(theta);
            const x = this.x + rand_normal()*this.range*std * Math.cos(theta);
            const y = this.y + rand_normal()*this.range*std * Math.sin(theta);
            s.x = _.clamp(x, 0, canvasBottom.width);
            s.y = _.clamp(y, 0, canvasBottom.height);
            s.updateValue();
        }
    }

    move(speed) {
        var vec = null;
        for (let s of this.samples) {
            if (!vec) {
                const dist = distance(this.x, this.y, s.x, s.y);
                if (dist > 0) {
                    vec = { x: ((s.x-this.x)/dist)*s.value, y: ((s.y-this.y)/dist)*s.value };
                }
            } else {
                const dist = distance(this.x, this.y, s.x, s.y);
                if (dist > 0) {
                    const vecs = { x: ((s.x-this.x)/dist)*s.value, y: ((s.y-this.y)/dist)*s.value };
                    vec.x += vecs.x;
                    vec.y += vecs.y;
                }
            }
        }
        // after the loop we have a final velocity vector (max magnitude of 1). move the agent using this velocity
        if (vec) {
            this.x += vec.x * speed;
            this.y += vec.y * speed;
            
        }
    }


}