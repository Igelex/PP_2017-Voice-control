// create the audio context (chrome only for now)
// create the audio context (chrome only for now)
if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}

console.log('IN ANALYSER!!!!!!!!!');

let context = new AudioContext();
let sourceNode;
let analyser;
let javascriptNode;
// get the context from the canvas to draw on

// create a gradient for the fill. Note the strange
// offset, since the gradient is calculated based on
// the canvas, not the specific element we draw
let gradient = ctx.createLinearGradient(0, 0, 0, 300);
gradient.addColorStop(1,'#000000');
gradient.addColorStop(0.75,'#ff0000');
gradient.addColorStop(0.25,'#ffff00');
gradient.addColorStop(0,'#ffffff');


export {setupAudioNodes};

function setupAudioNodes(stream) {
    // setup a javascript node
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);
    // setup a analyzer
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 512;
    // create a buffer source node
    sourceNode = context.createMediaStreamSource(stream);
    sourceNode.connect(analyser);
    analyser.connect(javascriptNode);
    sourceNode.connect(context.destination);
}
// when the javascript node is called
// we use information from the analyzer node
// to draw the volume
javascriptNode.onaudioprocess = function() {
    // get the average for the first channel
    var array =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    // clear the current state
    ctx.clearRect(0, 0, 1000, 325);
    // set the fill style
    ctx.fillStyle=gradient;
    drawSpectrum(array);
}
function drawSpectrum(array) {
    for ( var i = 0; i < (array.length); i++ ){
        var value = array[i];
        ctx.fillRect(i*5,325-value,3,325);
        //  console.log([i,value])
    }
};
