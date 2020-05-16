document.getElementById('inp-showSamples').checked = false;

var showSamples = false;



document.getElementById('inp-showSamples').addEventListener('change', e => {
    showSamples = e.target.checked;
});



const agent = new Agent(200, 200, 200, 200);

var mouseX;
var mouseY;

function animate() {
    requestAnimationFrame(animate);
    // agent.x += 1
    // if (agent.x > canvasAgent.width) agent.x = 0;

    // agent.draw() needs to be above agent.drawSamples() because agent.draw() will can clear the agentContext
    agent.draw();
    if (showSamples) {
        agent.drawSamples();
    }
    agent.updateSamples();
    agent.move(0.75);
    if (agent.samples[0].values > 0) console.log(agent.samples[0]);
}

animate();