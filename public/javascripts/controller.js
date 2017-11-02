/**
 * Created by Pastuh on 19.10.2017.
 */

import bindDependencies from './dependencies';
import frequencyAnalyser from './frequencyAnalyser';

bindDependencies();

let elements = [];
let rec;
let INPUT_SELECTORS = 'a, li, :button';
let FORM_SELECTORS = 'label, input[type="email"], input[type="text"], input[type="password"], input[type="number"],input[type="search"], input[type="tel"]';

let regExpClick = /(click)\s[[a-zA-Z0-9\.]/;
let regExpGo = /(go to)\s[[a-zA-Z0-9\.]/;
let regExpCheck = /(check)\s[[a-zA-Z0-9\.]/;
console.log('Test Click: ' + regExpClick.test('please click Link kek'));
console.log('Test Go: ' + regExpGo.test('please go to Email address:'));
console.log('Test Check: ' + regExpCheck.test('please check male'));

window.onload = function () {

    frequencyAnalyser();

    $('#request').click(function () {
        sendRequest();
    });

    $('#start-search').click(function () {
        checkInputType($('#search-input').val());
    });



    function checkInputType(input) {
        let userInput = input.toString().toLowerCase().trim();
        let t0 = performance.now();
        console.log(regExpClick.test(userInput));
        if (regExpClick.test(userInput)) {
            let result = userInput.slice((userInput.indexOf('click') + 5)).trim();
            if (result != undefined) {
                console.log('Search string for CLICKS: ' + result);
                searchElements(INPUT_SELECTORS, result);
            }
        }
        if (regExpGo.test(userInput)) {
            let result = userInput.slice((userInput.indexOf('go to') + 5)).trim();
            if (result != undefined) {
                console.log('Search string: ' + result);
                searchElements(FORM_SELECTORS, result)
            }
        }
        selectElements(elements);
        elements = [];
        let t1 = performance.now();
        console.log('Execution time: ' + (t1 - t0) + 'mil');
    }

    function searchElements(selector, userInput) {
        let selectedElements = $(selector);
        if (selectedElements.length > 0) {
            for (let i = 0; i < selectedElements.length; i++) {
                console.log('Elements textContent: ' + selectedElements[i].textContent.toLowerCase());
                if (selectedElements[i].textContent.toLowerCase().trim() === userInput
                    || checkValue(selectedElements[i], userInput)) {
                    elements.push(selectedElements[i]);
                }
            }
        }
    }

    function selectElements() {
        if (elements.length >= 2) {
            for (let j = 0; j < elements.length; j++) {
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
            url: '/test',
            type: 'POST'
        }).done(function (data) {
            alert('Greetings from Server: ' + data);
            console.log(data);
        }).fail(function (jqXHR, errorMessage, error) {
            console.log('AJAx error: ' + error);
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => {
                sound = stream;
                rec = new MediaRecorder(stream);
                rec.ondataavailable = e => {
                    audioChunks.push(e.data);
                    if (rec.state === "inactive") {
                        let audio = new Blob(audioChunks, {type: 'audio/x-mpeg-3'});
                        recordedAudio.src = URL.createObjectURL(audio);
                        recordedAudio.controls = true;
                        //audioDownload.href = recordedAudio.src;
                        audioDownload.download = 'mp3';
                        //audioDownload.innerHTML = 'download';
                    }
                }
            })
            .catch(e => console.log(e));

        startRecord.onclick = e => {
            startRecord.disabled = true;
            stopRecord.disabled = false;
            audioChunks = [];
            rec.start();
            setupAudioNodes(sound);
        };
        stopRecord.onclick = e => {
            startRecord.disabled = false;
            stopRecord.disabled = true;
            rec.stop();
        };
    } else {
        console.log('getUserMedia not supported');
    }*/
};

