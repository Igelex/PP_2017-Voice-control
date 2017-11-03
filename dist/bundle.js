/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _dependencies = _interopRequireDefault(__webpack_require__(1));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Pastuh on 19.10.2017.
 */

/*import frequencyAnalyser from './frequencyAnalyser';*/
(0, _dependencies.default)();
var elements = [];
var INPUT_SELECTORS = 'a, li, :button';
var FORM_SELECTORS = 'label, input[type="email"], input[type="text"], input[type="password"], input[type="number"],input[type="search"], input[type="tel"]';
var selectedInputField;
var inputMode = '';
var regExpClick = /(click)\s[[a-zA-Z0-9\.]/;
var regExpGo = /(go to)\s[[a-zA-Z0-9\.]/;
var regExpCheck = /(check)\s[[a-zA-Z0-9\.]/;
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
    var userInput = input.toString().toLowerCase().trim();
    var t0 = performance.now();
    console.log(regExpClick.test(userInput));

    if (regExpClick.test(userInput)) {
      changeInputMode('click');
      var result = userInput.slice(userInput.indexOf('click') + 5).trim();

      if (result != undefined) {
        console.log('Search string for CLICKS: ' + result);
        searchElements(INPUT_SELECTORS, result);
      }
    } else if (regExpGo.test(userInput)) {
      changeInputMode('typing');

      var _result = userInput.slice(userInput.indexOf('go to') + 5).trim();

      if (_result) {
        console.log('Search string: ' + _result);
        searchElements(FORM_SELECTORS, _result);
      }
    } else if (inputMode === 'typing' && selectedInputField) {
      console.log('---------Typing text......: ' + userInput); //selectedInputField.value += userInput;

      document.getElementById($(selectedInputField).attr('id')).value += ' ' + userInput;
    }

    selectElements(elements);
    elements = [];
    var t1 = performance.now();
    console.log('Execution time: ' + (t1 - t0) + 'mil');
  }

  function searchElements(selector, userInput) {
    selectedInputField = null;
    var selectedElements = $(selector);

    if (selectedElements.length > 0) {
      for (var i = 0; i < selectedElements.length; i++) {
        if (selectedElements[i].textContent.toLowerCase().trim() === userInput || hasValue(selectedElements[i], userInput)) {
          elements.push(selectedElements[i]);
        }
      }
    }
  }

  function selectElements() {
    if (elements.length >= 2) {
      for (var j = 0; j < elements.length; j++) {
        elements[j].style.border = 'black 5px solid';
      }
    } else if (elements.length === 1 && elements[0] !== undefined) {
      if ($(elements).is('label')) {
        $(elements).next().focus();
        selectedInputField = $(elements).next();
      } else {
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
  } ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
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
    var result = event.results[0][0].transcript;
    console.info('-----ON RESULT------: ' + result);

    if (result) {
      checkInputType(result);
    }
  };

  recognition.addEventListener('end', recognition.start); ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia; // set up forked web audio context, for multiple browsers
  // window. is needed otherwise Safari explodes

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var source; //set up the different audio nodes we will use for the app

  var analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;
  var audioChunks = [];
  var rec;
  var isRecording = false;
  var distortion = audioCtx.createWaveShaper();
  var gainNode = audioCtx.createGain();
  var biquadFilter = audioCtx.createBiquadFilter();
  var convolver = audioCtx.createConvolver(); // set up canvas context for visualizer

  var canvas = document.querySelector('.visualizer');
  var canvasCtx = canvas.getContext("2d");
  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;
  var drawVisual;
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
      if (typeof Storage === 'undefined') {
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
  }); //main block for doing the audio recording

  function startAudioRecord() {
    console.log('Start Audio Record');

    if (navigator.getUserMedia) {
      console.log('getUserMedia supported.');
      navigator.getUserMedia( // constraints - only audio needed for this app
      {
        audio: true
      }, // Success callback
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

        rec.ondataavailable = function (e) {
          audioChunks.push(e.data);
        };

        rec.onstop = function () {
          isRecording = false;

          if (audioChunks.length > 0) {
            var audio = new Blob(audioChunks, {
              type: 'audio/wave'
            });
            recordedAudio.src = URL.createObjectURL(audio);
            recordedAudio.controls = true;
            audioDownload.href = recordedAudio.src;
            audioDownload.download = 'wave';
            audioDownload.innerHTML = 'download';
            audioChunks = [];
          }
        };
      }, // Error callback
      function (err) {
        console.log('The following gUM error occured: ' + err);
      });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }

    function visualize() {
      analyser.fftSize = 512;
      var bufferLengthAlt = analyser.frequencyBinCount;
      console.log(bufferLengthAlt);
      var dataArrayAlt = new Uint8Array(bufferLengthAlt);
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      var drawAlt = function drawAlt() {
        drawVisual = requestAnimationFrame(drawAlt);
        analyser.getByteFrequencyData(dataArrayAlt);
        canvasCtx.fillStyle = 'white';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        var barWidth = WIDTH / bufferLengthAlt * 2.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < bufferLengthAlt; i++) {
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
    var values = 0;
    var average;
    var length = array.length; // get all the frequency amplitudes

    for (var i = 0; i < length; i++) {
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

/*
* Bind needed Libraries in HTML
* */
function _default() {
  console.log('IN Dependencies !!!!!!!!!');
  var scriptJquery = document.createElement('script');
  var scriptAnnyang = document.createElement('script');
  var scriptSpeechKitt = document.createElement('script');
  scriptJquery.src = '//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
  scriptAnnyang.src = '//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js';
  scriptSpeechKitt.src = '//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/speechkitt.min.js';
  console.log('SCRIPT !!!!!!!!!' + scriptJquery.src.toString());
  document.getElementsByTagName('head')[0].appendChild(scriptJquery);
  document.getElementsByTagName('head')[0].appendChild(scriptAnnyang);
  document.getElementsByTagName('head')[0].appendChild(scriptSpeechKitt);
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map