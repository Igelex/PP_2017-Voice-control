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
/***/ (function(module, exports) {

/**
 * Created by Pastuh on 19.10.2017.
 */
function bind() {
  var scriptJquery = document.createElement('script');
  var scriptAnnyang = document.createElement('script');
  var scriptSpeechKitt = document.createElement('script');
  scriptJquery.src = '//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
  scriptAnnyang.src = '//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js';
  scriptSpeechKitt.src = '//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/speechkitt.min.js';
  document.getElementsByTagName('head')[0].appendChild(scriptJquery); //document.getElementsByTagName('head')[0].appendChild(scriptAnnyang);

  document.getElementsByTagName('head')[0].appendChild(scriptSpeechKitt);
}

bind();
var sound;
var elements = [];
var INPUT_SELECTORS = 'a, li, :button';
var FORM_SELECTORS = 'label, input[type="email"], input[type="text"], input[type="password"], input[type="number"],input[type="search"], input[type="tel"]';
var regExpClick = /(click)\s[[a-zA-Z0-9\.]/;
var regExpGo = /(go to)\s[[a-zA-Z0-9\.]/;
var regExpCheck = /(check)\s[[a-zA-Z0-9\.]/;
console.log('Test Click: ' + regExpClick.test('please click Link kek'));
console.log('Test Go: ' + regExpGo.test('please go to Email address:'));
console.log('Test Check: ' + regExpCheck.test('please check male'));

window.onload = function () {
  $('#request').click(function () {
    sendRequest();
  });
  $('#start-search').click(function () {
    checkInputType($('#search-input').val());
  });
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(function (stream) {
      sound = stream;
      rec = new MediaRecorder(stream);

      rec.ondataavailable = function (e) {
        audioChunks.push(e.data);

        if (rec.state === "inactive") {
          var audio = new Blob(audioChunks, {
            type: 'audio/x-mpeg-3'
          });
          recordedAudio.src = URL.createObjectURL(audio);
          recordedAudio.controls = true; //audioDownload.href = recordedAudio.src;

          audioDownload.download = 'mp3';
          audioDownload.innerHTML = 'download';
        }
      };
    }).catch(function (e) {
      return console.log(e);
    });

    startRecord.onclick = function (e) {
      startRecord.disabled = true;
      stopRecord.disabled = false;
      audioChunks = [];
      rec.start();
      setupAudioNodes(sound);
    };

    stopRecord.onclick = function (e) {
      startRecord.disabled = false;
      stopRecord.disabled = true;
      rec.stop();
    };
  } else {
    console.log('getUserMedia not supported');
  }

  function checkInputType(input) {
    var userInput = input.toString().toLowerCase().trim();
    var t0 = performance.now();
    console.log(regExpClick.test(userInput));

    if (regExpClick.test(userInput)) {
      var result = userInput.slice(userInput.indexOf('click') + 5).trim();

      if (result != undefined) {
        console.log('Search string for CLICKS: ' + result);
        searchElements(INPUT_SELECTORS, result);
      }
    }

    if (regExpGo.test(userInput)) {
      var _result = userInput.slice(userInput.indexOf('go to') + 5).trim();

      if (_result != undefined) {
        console.log('Search string: ' + _result);
        searchElements(FORM_SELECTORS, _result);
      }
    }

    selectElements(elements);
    elements = [];
    var t1 = performance.now();
    console.log('Execution time: ' + (t1 - t0) + 'mil');
  }

  function searchElements(selector, userInput) {
    var selectedElements = $(selector);

    if (selectedElements.length > 0) {
      for (var i = 0; i < selectedElements.length; i++) {
        console.log('Elements textContent: ' + selectedElements[i].textContent.toLowerCase());

        if (selectedElements[i].textContent.toLowerCase().trim() === userInput || checkValue(selectedElements[i], userInput)) {
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
      } else {
        elements[0].style.backgroundColor = 'black';
        elements[0].style.color = 'white';
        elements[0].click();
      }
    } else {
      console.error('No element found');
      alert('No Elements found');
    }
  }

  function checkValue(element, userInput) {
    if (element.value !== undefined) {
      if (element.value.toString().toLowerCase() === userInput) {
        return true;
      }
    }

    return false;
  }

  function sendRequest() {
    $.ajax({
      host: 'localhost',
      port: '3000',
      dataType: 'text',
      path: '/',
      method: 'GET'
    }).done(function (data) {
      alert('Greteengs from Server: ' + data);
    }).fail(function (jqXHR, errorMessage, error) {});
  } ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*if (! window.AudioContext) {
      if (! window.webkitAudioContext) {
          alert('no audiocontext found');
      }
      window.AudioContext = window.webkitAudioContext;
  }
  var context = new AudioContext();
  var audioBuffer;
  var sourceNode;
  var splitter;
  var analyser, analyser2;
  var javascriptNode;
  // get the context from the canvas to draw on
  var ctx = $("#canvas").get()[0].getContext("2d");
  // create a gradient for the fill. Note the strange
  // offset, since the gradient is calculated based on
  // the canvas, not the specific element we draw
  var gradient = ctx.createLinearGradient(0,0,0,130);
  gradient.addColorStop(1,'#000000');
  gradient.addColorStop(0.75,'#ff0000');
  gradient.addColorStop(0.25,'#ffff00');
  gradient.addColorStop(0,'#ffffff');
  function setupAudioNodes(stream) {
      // setup a javascript node
      // setup a javascript node
      javascriptNode = context.createScriptProcessor(2048, 1, 1);
      // connect to destination, else it isn't called
      javascriptNode.connect(context.destination);
        // setup a analyzer
      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;
        // create a buffer source node
      sourceNode = context.createMediaStreamSource();
      sourceNode. = stream;
        // connect the source to the analyser
      sourceNode.connect(analyser);
        // we use the javascript node to draw at a specific interval.
      analyser.connect(javascriptNode);
        // and connect to destination, if you want audio
      sourceNode.connect(context.destination);
  }
  // when the javascript node is called
  // we use information from the analyzer node
  // to draw the volume
  javascriptNode.onaudioprocess = function() {
      // get the average for the first channel
      // get the average, bincount is fftsize / 2
      var array =  new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var average = getAverageVolume(array)
        // clear the current state
      ctx.clearRect(0, 0, 60, 130);
        // set the fill style
      ctx.fillStyle=gradient;
        // create the meters
      ctx.fillRect(0,130-average,25,130);
  }
  function getAverageVolume(array) {
      var values = 0;
      var average;
      var length = array.length;
      // get all the frequency amplitudes
      for (var i = 0; i < length; i++) {
          values += array[i];
      }
      average = values / length;
      return average;
  }*/

};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map