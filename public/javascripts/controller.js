/**
 * Created by Pastuh on 19.10.2017.
 */

import bindDependencies from './dependencies';
import {SELECT_SELECTORS, CHECK_SELECTORS, CLICK_SELECTORS, SEARCH_SELECTORS, GO_TO_SELECTORS,
    CLICK, GO_TO, OFF, SELECT,SCROLL_DOWN, SCROLL_UP, SCROLL_TO_BOTTOM, SCROLL_TO_TOP, SEARCH, STOP_TYPE,
    REG_EXP_CLICK, REG_EXP_GO_TO, REG_EXP_OFF, REG_EXP_SEARCH, REG_EXP_CHECK, REG_EXP_SELECT, REG_EXP_SCROLL_DOWN,
    REG_EXP_SCROLL_TO_TOP, REG_EXP_SCROLL_TO_BOTTOM,REG_EXP_STOP_TYPE, REG_EXP_SCROLL_UP,
    MODE_TYPE, MODE_SELECT, MODE_NO_MODE} from './const';
/*import frequencyAnalyser from './frequencyAnalyser';*/


bindDependencies();

let elements = [];
let INPUT_SELECTORS = 'a, li, :button';
let FORM_SELECTORS = 'label, input[type="email"], input[type="text"], input[type="password"], input[type="number"],input[type="search"], input[type="tel"]';

let selectedInputField;
let inputMode = '';
let regExpClick = /(click)\s[[a-zA-Z0-9\.]/;
let regExpGo = /(go to)\s[[a-zA-Z0-9\.]/;
let regExpCheck = /(check)\s[[a-zA-Z0-9\.]/;
console.log('Test Click: ' + regExpClick.test('please click Link kek'));
console.log('Test Go: ' + regExpGo.test('please go to Email address:'));
console.log('Test Check: ' + regExpCheck.test('please check male'));

window.onload = function () {

    //frequencyAnalyser();

    $('#request').click(function () {
        sendRequest();
    });

    $('#start-search').click(function () {
        checkInputType($('#search-input').val());
    });

    function checkInputType(input) {

        let userInput = input.toString().toLowerCase().trim();
        let t0 = performance.now();

        switch (true){
            case REG_EXP_SCROLL_DOWN.test(userInput):
                scrollDown();
            break;
            case REG_EXP_SCROLL_UP.test(userInput):
                scrollUp();
            break;
        }
        /*if (REG_EXP_SCROLL_DOWN.test(userInput)){
            scrollDown();
        }*/

        if (REG_EXP_CLICK.test(userInput)) {

            changeInputMode('click');

            let result = userInput.slice((userInput.indexOf(CLICK) + 5)).trim();
            if (result != undefined) {
                console.log('Search string for CLICKS: ' + result);
                searchElements(CLICK_SELECTORS, result);
            }
        }
        else if (REG_EXP_GO_TO.test(userInput)) {

            let result = userInput.slice((userInput.indexOf(GO_TO) + 5)).trim();

            if (result) {
                console.log('Search string: ' + result);
                searchElements(GO_TO_SELECTORS, result)
            }
        } else if (inputMode === MODE_TYPE && selectedInputField) {
            console.log('---------Typing text......: ' + userInput);
            let textContent = $(selectedInputField).val();
            if (textContent.trim().length === 0) {
                console.log('++++VALUE in undefinedn+++++: ' + textContent);
                textContent += userInput;
            } else {
                console.log('++++VALUE in defined+++++: ' + textContent);
                textContent += ' ' + userInput;
            }
            $(selectedInputField).val(textContent);
        }
        selectElements(elements);
        elements = [];
        let t1 = performance.now();
        console.log('Execution time: ' + (t1 - t0) + 'mil');
    }

    function searchElements(selector, userInput) {
        selectedInputField = null;
        let selectedElements = $(selector);
        if (selectedElements.length > 0) {
            for (let i = 0; i < selectedElements.length; i++) {
                //console.log('######Found Elemets#####: ' + selectedElements[i].textContent);
                if (selectedElements[i].textContent.toLowerCase().trim() === userInput
                    || hasValue(selectedElements[i], userInput)) {
                    elements.push(selectedElements[i]);
                }
            }
        }
    }

    function selectElements() {
        //console.log('++++Count Elemets+++++: ' + elements.length);
        if (elements.length >= 2) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.border = 'black 5px solid';
                console.log('++++Selected Elemets+++++: ' + elements[i].textContent);
            }
        } else if (elements.length === 1 && elements[0] !== undefined) {
            if ($(elements).is('label')) {
                changeInputMode(MODE_TYPE);
                $(elements).next().focus();
                selectedInputField = $(elements).next();
            } else {
                console.log('++++Selected Elemets+++++: ' + elements[0].textContent);
                elements[0].style.backgroundColor = 'black';
                elements[0].style.color = 'white';
                elements[0].click();
            }
        } else {
            console.error('-------------No element found------------------------------');
        }
    }

    function hasValue(element, userInput) {
        if (element.value !== undefined) {
            if (element.value.toString().toLowerCase() === userInput) {
                return true;
            }
        }
        return false;
    }

    function changeInputMode(newInputMode) {
        inputMode = newInputMode;
        if (inputMode !== 'typing') {
            $(selectedInputField).blur();
            selectedInputField = null;
        }
        console.log('------MODUS------' + inputMode);
    }

    function scrollDown() {
        //window.scrollBy(0, window.innerHeight / 2); // horizontal and vertical scroll increments
        $('html, body').animate({
            scrollTop: $(window).scrollTop() + (window.innerHeight / 2)
        });
    }

    function scrollUp() {
        //window.scrollBy(0, window.innerHeight / 2); // horizontal and vertical scroll increments
        $('html, body').animate({
            scrollTop: $(window).scrollTop() - (window.innerHeight / 2)
        });
    }

    function sendRequest() {
        $.ajax({
            host: 'localhost',
            port: '3000',
            dataType: 'text',
            url: '/test',
            type: 'POST'
        }).done(function (data) {
            //alert('Greetings from Server: ' + data);
            console.log(data);
            checkInputType(data);
        }).fail(function (jqXHR, errorMessage, error) {
            console.log('AJAx error: ' + error);
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;

    /*if (inputMode){
        recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')
            console.log('**********'  + transcript);
            if (e.results[0].isFinal){
                checkInputType(result);
            }
        });
    }*/
    recognition.onresult = function (event) {
        let result = event.results[0][0].transcript;
        console.info('-----ON RESULT------: ' + result);
        if (result) {
            checkInputType(result);
        }
    };
    recognition.addEventListener('end', recognition.start);


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

    let audioChunks = [];
    let rec;
    let isRecording = false;

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
            runAudioContext();
            startAudioRecord();
            $('#startRecord').textContent = 'Stop';
            console.log('Audio settings stored');
        }
    } else {
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
            recognition.start();
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
                    visualize();
                    voiceMute();

                    rec = new MediaRecorder(stream);

                    rec.ondataavailable = e => {
                        audioChunks.push(e.data);
                    };
                    rec.onstop = function () {

                        isRecording = false;

                        if (audioChunks.length > 0) {
                            let audio = new Blob(audioChunks, {type: 'audio/wave'});
                            recordedAudio.src = URL.createObjectURL(audio);
                            recordedAudio.controls = true;
                            audioDownload.href = recordedAudio.src;
                            audioDownload.download = 'wave';
                            audioDownload.innerHTML = 'download';
                            audioChunks = [];
                        }
                    }
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
            analyser.fftSize = 512;
            let bufferLengthAlt = analyser.frequencyBinCount;
            console.log(bufferLengthAlt);
            let dataArrayAlt = new Uint8Array(bufferLengthAlt);

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

                    /*if (barHeight >= 100) {
                        /!*console.log('#####' + barHeight);*!/
                        if (isRecording === false) {
                            console.log('...Starting recorder');
                            rec.start();
                            isRecording = true;
                            setTimeOut();
                        }
                    }*/
                }
            };
            drawAlt();
        }

    }

    function voiceMute() {
        gainNode.gain.value = 0;
    }

    function stopAudioContext() {
        //sendRequest();
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

    function setTimeOut() {
        setTimeout(function () {
            rec.stop();
            sendRequest();
            console.log('...Stopping recorder');
        }, 1500);

    }
};

