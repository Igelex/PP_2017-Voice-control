// fork getUserMedia for multiple browser versions, for those
// that need prefixes
export default function () {

    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

// set up forked web audio context, for multiple browsers
// window. is needed otherwise Safari explodes

    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let source;

//set up the different audio nodes we will use for the app
    let analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;

    let distortion = audioCtx.createWaveShaper();
    let gainNode = audioCtx.createGain();
    let biquadFilter = audioCtx.createBiquadFilter();
    let convolver = audioCtx.createConvolver();

// set up canvas context for visualizer

    let canvas = document.querySelector('.visualizer');
    let canvasCtx = canvas.getContext("2d");
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    let drawVisual;

    /*if (typeof (Storage) !== 'undefined') {
        console.log('audio value : ' + localStorage.getItem('audio'));
        if (localStorage.getItem('audio') == true) {
            startAudioRecord();
            $('#startRecord').textContent = 'Stop';
            console.log('Audio settings stored');
        }
    }else {
        console.log('Storage is undefined: ' + Storage);
    }*/

    $('#startRecord').click(function () {
        if (this.textContent.toLowerCase().trim() === 'start') {
            if (typeof (Storage) === 'undefined') {
                if (localStorage.getItem('audio') !== true) {
                    localStorage.setItem('audio', true);
                    console.log('Save audio settings');
                }
            }
            runAudioContext();
            startAudioRecord();
            this.textContent = 'Stop';
        } else {
            stopAudioContext();
            this.textContent = 'Start';
        }
    });

//main block for doing the audio recording
    function startAudioRecord() {
        console.log('Start Audio Record');
        if (navigator.getUserMedia) {
            console.log('getUserMedia supported.');
            navigator.getUserMedia(
                // constraints - only audio needed for this app
                {
                    audio: true
                },

                // Success callback
                function (stream) {
                    source = audioCtx.createMediaStreamSource(stream);
                    source.connect(analyser);
                    analyser.connect(distortion);
                    distortion.connect(biquadFilter);
                    biquadFilter.connect(convolver);
                    convolver.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    voiceMute();
                    visualize();
                },
                // Error callback
                function (err) {
                    console.log('The following gUM error occured: ' + err);
                }
            );
        } else {
            console.log('getUserMedia not supported on your browser!');
        }

        function visualize() {
            analyser.fftSize = 256;
            let bufferLengthAlt = analyser.frequencyBinCount;
            console.log(bufferLengthAlt);
            let dataArrayAlt = new Uint8Array(bufferLengthAlt);
            getAverageVolume(dataArrayAlt);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            let drawAlt = function () {
                drawVisual = requestAnimationFrame(drawAlt);

                analyser.getByteFrequencyData(dataArrayAlt);

                canvasCtx.fillStyle = 'white';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                let barWidth = (WIDTH / bufferLengthAlt) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLengthAlt; i++) {
                    barHeight = dataArrayAlt[i];

                    canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
                    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

                    x += barWidth + 1;
                }
            };
            drawAlt();
        }

        function voiceMute() {
            gainNode.gain.value = 0;
        }

        function getAverageVolume(array) {
            let values = 0;
            let average;
            let length = array.length;
            // get all the frequency amplitudes
            for (let i = 0; i < length; i++) {
                values += array[i];
            }
            average = values / length;
            console.log('AVArAGE:' + average);
            return average;
        }
    }

    function stopAudioContext() {
        if (audioCtx.state === 'running') {
            audioCtx.suspend().then(function () {
                window.cancelAnimationFrame(drawVisual);
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                canvasCtx.fillStyle = "transparent";
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
                console.log('AudioContext state: ' + audioCtx.state);
            });

        }
    }

    function runAudioContext() {
        if (audioCtx.state === 'suspended' || audioCtx.state === 'closed') {
            audioCtx.resume().then(function () {
                console.log('AudioContext state: ' + audioCtx.state);
            });
        }
    }
}


