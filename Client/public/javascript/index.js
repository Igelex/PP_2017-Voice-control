/**
 * Created by Pastuh on 19.10.2017.
 */

let elements = [];
let INPUT_SELECTORS = 'a, li, :button';
let FORM_SELECTORS = 'label, input[type="email"], input[type="text"], input[type="password"], input[type="number"],input[type="search"], input[type="tel"]';

let regExpClick = /(click)\s[[a-zA-Z0-9\.]/;
let regExpGo = /(go to)\s[[a-zA-Z0-9\.]/;
let regExpCheck = /(check)\s[[a-zA-Z0-9\.]/;
console.log('Test Click: ' + regExpClick.test('please click Link kek'));
console.log('Test Go: ' + regExpGo.test('please go to Email address:'));
console.log('Test Check: ' + regExpCheck.test('please check male'));

navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
        rec = new MediaRecorder(stream);
        rec.ondataavailable = e => {
            audioChunks.push(e.data);
            if (rec.state === "inactive") {
                let blob = new Blob(audioChunks, {type: 'audio/x-mpeg-3'});
                recordedAudio.src = URL.createObjectURL(blob);
                recordedAudio.controls = true;
                recordedAudio.autoplay = true;
                audioDownload.href = recordedAudio.src;
                audioDownload.download = 'mp3';
                audioDownload.innerHTML = 'download';
            }
        }
    })
    .catch(e => console.log(e));

startRecord.onclick = e => {
    startRecord.disabled = true;
    stopRecord.disabled = false;
    audioChunks = [];
    rec.start();
};
stopRecord.onclick = e => {
    startRecord.disabled = false;
    stopRecord.disabled = true;
    rec.stop();
};

/*console.log('IN ....search');
let searchString = document.getElementById('search-input').value.toString();
console.log(searchString);
document.getElementById('start_search').addEventListener('click', checkInputType(searchString));*/

$('#start-search').click(function () {
    checkInputType($('#search-input').val());
});


$('#click1').click(function () {
    alert('Hello hello');
});

//document.getElementById('click1').addEventListener('click',alert('hui'));

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