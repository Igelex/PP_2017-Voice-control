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

var _const = __webpack_require__(2);

var _visualizer = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Pastuh on 19.10.2017.
 */
(0, _dependencies.default)();
var elements = [];
var selectedInputField;
var inputMode = _const.MODE_NO_MODE;

window.onload = function () {
  (0, _visualizer.default)();
  $('#start-search').click(function () {
    checkInputMode($('#search-input').val());
  });

  function checkInputMode(input) {
    var t0 = performance.now();
    var userCommand = input.toString().toLowerCase().trim();
    var result;

    if (_const.REG_EXP_STOP.test(userCommand)) {
      changeInputMode(_const.MODE_NO_MODE);
      return;
    }

    if (inputMode === _const.MODE_NO_MODE) {
      switch (true) {
        case _const.REG_EXP_CLICK.test(userCommand):
          changeInputMode(_const.MODE_NO_MODE);
          result = splitUserCommand(userCommand, _const.CLICK);

          if (result) {
            console.log('Search string for CLICKS: ' + result);
            searchForButtons(_const.CLICK_SELECTORS, result);
          }

          break;

        case _const.REG_EXP_SCROLL_DOWN.test(userCommand):
          scrollDown();
          break;

        case _const.REG_EXP_SCROLL_UP.test(userCommand):
          scrollUp();
          break;

        case _const.REG_EXP_SCROLL_TO_TOP.test(userCommand):
          scrollDown();
          break;

        case _const.REG_EXP_SCROLL_TO_BOTTOM.test(userCommand):
          scrollUp();
          break;

        case _const.REG_EXP_GO_TO.test(userCommand):
          result = splitUserCommand(userCommand, _const.GO_TO);

          if (result) {
            console.log('Search string for GO_TO: ' + result);
            searchForInputFields(_const.GO_TO_SELECTORS, result);
          }

          break;

        case _const.REG_EXP_SELECT.test(userCommand):
          break;

        case _const.REG_EXP_SEARCH.test(userCommand):
          break;

        case _const.REG_EXP_CHECK.test(userCommand):
          result = splitUserCommand(userCommand, _const.CHECK);

          if (result) {//searchElements(CHECK_SELECTORS, userCommand);
          }

          break;

        case _const.REG_EXP_OFF.test(userCommand):
          break;

        case _const.REG_EXP_STOP.test(userCommand):
          changeInputMode(_const.MODE_NO_MODE);
          break;

        default:
      }
    } else if (inputMode === _const.MODE_TYPE && selectedInputField) {
      console.log('---------Typing text......: ' + userCommand);
      var textContent = $(selectedInputField).val();

      if (textContent.trim().length === 0) {
        textContent += userCommand;
      } else {
        textContent += ' ' + userCommand;
      }

      $(selectedInputField).val(textContent);
    } else if (inputMode === _const.MODE_SELECT) {//Kommt
    }

    if (elements.length === 0) {
      console.error('-------------No element found------------------');
    }

    elements = [];
    var t1 = performance.now();
    console.log('Execution time: ' + (t1 - t0) + ' mil');
  }

  function searchForInputFields(selector, userInput) {
    selectedInputField = null;
    var selectedElements = $(selector);
    var elem;

    if (selectedElements.length > 0) {
      changeInputMode(_const.MODE_TYPE);

      for (var i = 0; i < selectedElements.length; i++) {
        elem = selectedElements[i];
        console.log('######Found input fields#####: ' + selectedElements[i].textContent);

        if (elem.textContent.toLowerCase().trim().startsWith(userInput) || hasValueAttribute(elem, userInput) || hasPlaceholderAttribute(elem, userInput)) {
          elements.push(elem);
        }
      }

      if (elements.length === 1) {
        if ($(elements).is('label')) {
          selectedInputField = $(elements).next();
          selectedInputField.focus();
        } else {
          selectedInputField = $(elements);
          selectedInputField.focus();
        }
      } else {
        multipleElementsSelected();
      }
    }
  }

  function searchForButtons(selector, userInput) {
    var selectedElements = $(selector);

    if (selectedElements.length > 0) {
      for (var i = 0; i < selectedElements.length; i++) {
        console.log('######Found Buttons#####: ' + selectedElements[i].textContent);

        if (selectedElements[i].textContent.toLowerCase().trim().startsWith(userInput) || hasValueAttribute(selectedElements[i], userInput)) {
          elements.push(selectedElements[i]);
        }
      }

      if (elements.length === 1) {
        elements[0].style.backgroundColor = 'black';
        elements[0].style.color = 'white';
        elements[0].click();
      } else {
        multipleElementsSelected();
      }
    }
  }

  function multipleElementsSelected() {
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.border = 'black 5px solid';
      console.log('++++Selected Elements+++++: ' + elements[i].textContent);
    }
  }

  function hasValueAttribute(element, userInput) {
    if (element.value !== undefined) {
      if (element.value.toString().toLowerCase().startsWith(userInput)) {
        return true;
      }
    }

    return false;
  }

  function hasPlaceholderAttribute(element, userInput) {
    if (element.placeholder !== undefined) {
      if (element.placeholder.toString().toLowerCase().startsWith(userInput)) {
        return true;
      }
    }

    return false;
  }

  function changeInputMode(newInputMode) {
    inputMode = newInputMode;

    if (inputMode !== _const.MODE_TYPE) {
      $(selectedInputField).blur();
      selectedInputField = null;
    }

    console.log('------MODE------: ' + inputMode);
  }

  function scrollDown() {
    $('html, body').animate({
      scrollTop: $(window).scrollTop() + window.innerHeight / 2
    });
  }

  function scrollUp() {
    $('html, body').animate({
      scrollTop: $(window).scrollTop() - window.innerHeight / 2
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
      checkInputMode(data);
    }).fail(function (jqXHR, errorMessage, error) {
      console.log('AJAX error: ' + error);
    });
  }

  function splitUserCommand(userCommand, command) {
    return userCommand.slice(userCommand.indexOf(command) + command.length).trim();
  }

  function isVisible(elem) {
    var docViewTop = $(window).scrollTop();
    return elemBottom = docViewTop;
  }
  /**
   *Setup Google Speech Recognition
   */


  try {
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
                checkInputMode(result);
            }
        });
    }*/

    recognition.onresult = function (event) {
      var result = event.results[0][0].transcript;
      console.info('-----ON RESULT------: ' + result);

      if (result) {
        checkInputMode(result);
      }
    };

    recognition.addEventListener('end', recognition.start);
    recognition.start();
  } catch (e) {
    console.log('Web Speech error: ' + e);
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODE_NO_MODE = exports.MODE_SELECT = exports.MODE_TYPE = exports.REG_EXP_SCROLL_UP = exports.REG_EXP_STOP = exports.REG_EXP_SCROLL_TO_BOTTOM = exports.REG_EXP_SCROLL_TO_TOP = exports.REG_EXP_SCROLL_DOWN = exports.REG_EXP_SELECT = exports.REG_EXP_CHECK = exports.REG_EXP_SEARCH = exports.REG_EXP_OFF = exports.REG_EXP_GO_TO = exports.REG_EXP_CLICK = exports.STOP = exports.CHECK = exports.SEARCH = exports.SCROLL_TO_TOP = exports.SCROLL_TO_BOTTOM = exports.SCROLL_UP = exports.SCROLL_DOWN = exports.SELECT = exports.OFF = exports.GO_TO = exports.CLICK = exports.GO_TO_SELECTORS = exports.SEARCH_SELECTORS = exports.CLICK_SELECTORS = exports.CHECK_SELECTORS = exports.SELECT_SELECTORS = void 0;

/**
 * Selectors
 */
var CLICK_SELECTORS = 'a, li, :button';
exports.CLICK_SELECTORS = CLICK_SELECTORS;
var GO_TO_SELECTORS = 'label, input[type="email"], input[type="text"], input[type="password"], input[type="number"],' + 'input[type="search"], input[type="tel"]';
exports.GO_TO_SELECTORS = GO_TO_SELECTORS;
var CHECK_SELECTORS = 'input[type="checkbox"], input[type="radio"]';
exports.CHECK_SELECTORS = CHECK_SELECTORS;
var SELECT_SELECTORS = 'select';
exports.SELECT_SELECTORS = SELECT_SELECTORS;
var SEARCH_SELECTORS = 'input[type="search"]';
/**
 * Keywords
 */

exports.SEARCH_SELECTORS = SEARCH_SELECTORS;
var CLICK = 'click';
exports.CLICK = CLICK;
var CHECK = 'check';
exports.CHECK = CHECK;
var GO_TO = 'go to';
exports.GO_TO = GO_TO;
var OFF = 'off';
exports.OFF = OFF;
var SELECT = 'select';
exports.SELECT = SELECT;
var SCROLL_UP = 'scroll up';
exports.SCROLL_UP = SCROLL_UP;
var SCROLL_DOWN = 'scroll down';
exports.SCROLL_DOWN = SCROLL_DOWN;
var SCROLL_TO_BOTTOM = 'scroll to bottom';
exports.SCROLL_TO_BOTTOM = SCROLL_TO_BOTTOM;
var SCROLL_TO_TOP = 'scroll to top';
exports.SCROLL_TO_TOP = SCROLL_TO_TOP;
var SEARCH = 'search';
exports.SEARCH = SEARCH;
var STOP = 'stop';
/**
 * RegExp
 */

exports.STOP = STOP;
var REG_EXP_CLICK = /(click)\s[[a-zA-Z0-9\.]/;
exports.REG_EXP_CLICK = REG_EXP_CLICK;
var REG_EXP_GO_TO = /(go to)\s[[a-zA-Z0-9\.]/;
exports.REG_EXP_GO_TO = REG_EXP_GO_TO;
var REG_EXP_OFF = /^(off)$/;
exports.REG_EXP_OFF = REG_EXP_OFF;
var REG_EXP_SEARCH = /^(search)$/;
exports.REG_EXP_SEARCH = REG_EXP_SEARCH;
var REG_EXP_CHECK = /(check)\s[[a-zA-Z0-9\.]/;
exports.REG_EXP_CHECK = REG_EXP_CHECK;
var REG_EXP_SELECT = /(select)\s[[a-zA-Z0-9\.]/;
exports.REG_EXP_SELECT = REG_EXP_SELECT;
var REG_EXP_SCROLL_UP = /(scroll up)(\s[[a-zA-Z0-9\.])?/;
exports.REG_EXP_SCROLL_UP = REG_EXP_SCROLL_UP;
var REG_EXP_SCROLL_DOWN = /(scroll down)(\s[[a-zA-Z0-9\.])?/;
exports.REG_EXP_SCROLL_DOWN = REG_EXP_SCROLL_DOWN;
var REG_EXP_SCROLL_TO_TOP = /(scroll)\s(to\s)?(top)(\s[[a-zA-Z0-9\.])?/;
exports.REG_EXP_SCROLL_TO_TOP = REG_EXP_SCROLL_TO_TOP;
var REG_EXP_SCROLL_TO_BOTTOM = /(scroll)\s(to\s)?(bottom)(\s[[a-zA-Z0-9\.])?/;
exports.REG_EXP_SCROLL_TO_BOTTOM = REG_EXP_SCROLL_TO_BOTTOM;
var REG_EXP_STOP = /^(stop)$/;
exports.REG_EXP_STOP = REG_EXP_STOP;
console.log(REG_EXP_SCROLL_UP.test('scroll up'));
/**
 * Input Mode
 * */

var MODE_TYPE = 'type';
exports.MODE_TYPE = MODE_TYPE;
var MODE_SELECT = 'select';
exports.MODE_SELECT = MODE_SELECT;
var MODE_NO_MODE = 'no_mode';
/**
 * Export consts
 */

exports.MODE_NO_MODE = MODE_NO_MODE;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = speechRecognition;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function speechRecognition() {
  $('#startRecord').click(function () {
    /*if (typeof (Storage) !== 'undefined') {
     console.log('audio value : ' + localStorage.getItem('audio'));
     if (localStorage.getItem('audio') == true) {
         runAudioContext();
         startAudioRecord();
         $('#startRecord').textContent = 'Stop';
         console.log('Audio settings stored');
    } else {
     console.log('Storage is undefined: ' + Storage);
    }*/
    if (this.textContent.toLowerCase().trim() === 'start') {
      if ((typeof Storage === "undefined" ? "undefined" : _typeof(Storage)) == undefined) {
        if (localStorage.getItem('audio') !== true) {
          localStorage.setItem('audio', true);
          console.log('Save audio settings');
        }
      } //recognition.start();


      runAudioContext();
      startAudioRecord();
      this.textContent = 'Stop';
    } else {
      stopAudioContext();
      this.textContent = 'Start';
    }
  });
  /**
   * Setup Web Audio API
   * */

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
  var drawVisual; //main block for doing the audio recording

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
        canvasCtx.fillStyle = '#f5f5f5';
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
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map