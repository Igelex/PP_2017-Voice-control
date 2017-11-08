/**
 * Created by Pastuh on 19.10.2017.
 */

import bindDependencies from './dependencies';
import {
    SELECT_SELECTORS, CHECK_SELECTORS, CLICK_SELECTORS, SEARCH_SELECTORS, GO_TO_SELECTORS,
    CLICK, GO_TO, OFF, SELECT, SCROLL_DOWN, SCROLL_UP, SCROLL_TO_BOTTOM, SCROLL_TO_TOP, SEARCH, STOP,
    REG_EXP_CLICK, REG_EXP_GO_TO, REG_EXP_OFF, REG_EXP_SEARCH, REG_EXP_CHECK, REG_EXP_SELECT, REG_EXP_SCROLL_DOWN,
    REG_EXP_SCROLL_TO_TOP, REG_EXP_SCROLL_TO_BOTTOM, REG_EXP_STOP, REG_EXP_SCROLL_UP,
    MODE_TYPE, MODE_SELECT, MODE_NO_MODE
} from './const';
import speechRecognition from './visualizer';

bindDependencies();

let elements = [];
let selectedInputField;
let inputMode = '';

window.onload = function () {

    speechRecognition();

    $('#start-search').click(function () {
        checkInputType($('#search-input').val());
    });

    function checkInputType(input) {

        let userInput = input.toString().toLowerCase().trim();
        let t0 = performance.now();
        let result;

        if (REG_EXP_STOP.test(userInput)) {
            changeInputMode(MODE_NO_MODE);
        }

        if (inputMode !== MODE_TYPE && inputMode !== MODE_SELECT) {
            switch (true) {
                case REG_EXP_CLICK.test(userInput):
                    changeInputMode(MODE_NO_MODE);
                    result = userInput.slice((userInput.indexOf(CLICK) + 5)).trim();
                    if (result.length > 0) {
                        console.log('Search string for CLICKS: ' + result);
                        searchElements(CLICK_SELECTORS, result);
                    }
                    break;
                case REG_EXP_SCROLL_DOWN.test(userInput):
                    scrollDown();
                    break;
                case REG_EXP_SCROLL_UP.test(userInput):
                    scrollUp();
                    break;
                case REG_EXP_SCROLL_TO_TOP.test(userInput):
                    scrollDown();
                    break;
                case REG_EXP_SCROLL_TO_BOTTOM.test(userInput):
                    scrollUp();
                    break;
                case REG_EXP_GO_TO.test(userInput):
                    result = userInput.slice((userInput.indexOf(GO_TO) + 5)).trim();
                    if (result) {
                        console.log('Search string: ' + result);
                        searchElements(GO_TO_SELECTORS, result)
                    }
                    break;
                case REG_EXP_SELECT.test(userInput):

                    break;
                case REG_EXP_SEARCH.test(userInput):

                    break;
                case REG_EXP_CHECK.test(userInput):

                    break;
                case REG_EXP_OFF.test(userInput):

                    break;
                case REG_EXP_STOP.test(userInput):
                    changeInputMode(MODE_NO_MODE);
                    break;
                default:
            }
        } else if (inputMode === MODE_TYPE && selectedInputField) {
            console.log('---------Typing text......: ' + userInput);
            let textContent = $(selectedInputField).val();
            if (textContent.trim().length === 0) {
                textContent += userInput;
            } else {
                textContent += ' ' + userInput;
            }
            $(selectedInputField).val(textContent);
        } else if (inputMode === MODE_SELECT) {
            //Kommt
        }
        selectElements(elements);
        elements = [];
        let t1 = performance.now();
        console.log('Execution time: ' + (t1 - t0) + ' mil');
    }

    function searchElements(selector, userInput) {
        selectedInputField = null;
        let selectedElements = $(selector);
        if (selectedElements.length > 0) {
            for (let i = 0; i < selectedElements.length; i++) {
                //console.log('######Found Elemets#####: ' + selectedElements[i].textContent);
                if (selectedElements[i].textContent.toLowerCase().trim() === userInput
                    || hasValueAttribut(selectedElements[i], userInput)) {
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

    function hasValueAttribut(element, userInput) {
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
        console.log('------MODE------ ' + inputMode);
    }

    function scrollDown() {
        $('html, body').animate({
            scrollTop: $(window).scrollTop() + (window.innerHeight / 2)
        });
    }

    function scrollUp() {
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

    /**
     *Setup Google Speech Recognition
     */
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
    recognition.start();
};


