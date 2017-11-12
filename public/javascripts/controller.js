/**
 * Created by Pastuh on 19.10.2017.
 */

import bindDependencies from './dependencies';
import {
    SELECT_SELECTORS, CHECK_SELECTORS, CLICK_SELECTORS, SEARCH_SELECTORS, GO_TO_SELECTORS,
    CLICK, GO_TO, OFF, SELECT, CHECK, SCROLL_DOWN, SCROLL_UP, SCROLL_TO_BOTTOM, SCROLL_TO_TOP, SEARCH, STOP,
    REG_EXP_CLICK, REG_EXP_GO_TO, REG_EXP_OFF, REG_EXP_SEARCH, REG_EXP_CHECK, REG_EXP_SELECT, REG_EXP_SCROLL_DOWN,
    REG_EXP_SCROLL_TO_TOP, REG_EXP_SCROLL_TO_BOTTOM, REG_EXP_STOP, REG_EXP_SCROLL_UP,
    MODE_TYPE, MODE_SELECT, MODE_NO_MODE
} from './const';
import speechRecognition from './visualizer';

bindDependencies();

let elements = [];
let selectedInputField;
let inputMode = MODE_NO_MODE;

window.onload = function () {

    speechRecognition();

    $('#start-search').click(function () {
        checkInputMode($('#search-input').val());
    });

    $('html, body').click(function () {
        changeInputMode(MODE_NO_MODE);
    });

    function checkInputMode(input) {

        let t0 = performance.now();

        let userCommand = input.toString().toLowerCase().trim();

        let result;

        if (REG_EXP_STOP.test(userCommand)) {
            changeInputMode(MODE_NO_MODE);
            return;
        }

        if (inputMode === MODE_NO_MODE) {
            switch (true) {
                case REG_EXP_CLICK.test(userCommand):

                    changeInputMode(MODE_NO_MODE);

                    result = splitUserCommand(userCommand, CLICK);

                    if (result) {
                        console.log('Search string for CLICKS: ' + result);
                        searchForButtons(CLICK_SELECTORS, result);
                    }

                    break;
                case REG_EXP_SCROLL_DOWN.test(userCommand):
                    scrollDown();
                    break;
                case REG_EXP_SCROLL_UP.test(userCommand):
                    scrollUp();
                    break;
                case REG_EXP_SCROLL_TO_TOP.test(userCommand):
                    scrollDown();
                    break;
                case REG_EXP_SCROLL_TO_BOTTOM.test(userCommand):
                    scrollUp();
                    break;
                case REG_EXP_GO_TO.test(userCommand):

                    result = splitUserCommand(userCommand, GO_TO);

                    if (result) {
                        console.log('Search string for GO_TO: ' + result);
                        searchForInputFields(GO_TO_SELECTORS, result)
                    }
                    break;
                case REG_EXP_SELECT.test(userCommand):

                    break;
                case REG_EXP_SEARCH.test(userCommand):

                    break;
                case REG_EXP_CHECK.test(userCommand):

                    changeInputMode(MODE_NO_MODE);

                    result = splitUserCommand(userCommand, CHECK);

                    if (result) {
                        console.log('Search string for CHECK: ' + result);
                        searchForCheckboxesAndRadios(CHECK_SELECTORS, userCommand);
                    }
                    break;
                case REG_EXP_OFF.test(userCommand):

                    break;
                default:
            }
        } else if (inputMode === MODE_TYPE && selectedInputField) {
            console.log('---------Typing text......: ' + userCommand);
            let textContent = $(selectedInputField).val();
            if (textContent.trim().length === 0) {
                textContent += userCommand;
            } else {
                textContent += ' ' + userCommand;
            }
            $(selectedInputField).val(textContent);
        } else if (inputMode === MODE_SELECT) {
            //Kommt
        }

        if (elements.length === 0) {
            console.error('-------------No element found------------------');
        }
        elements = [];

        let t1 = performance.now();
        console.log('Execution time: ' + (t1 - t0) + ' mil');
    }

    function searchForInputFields(selector, userInput) {
        selectedInputField = null;

        let selectedElements = $(selector);

        let elem;

        if (selectedElements.length > 0) {

            for (let i = 0; i < selectedElements.length; i++) {

                elem = selectedElements[i];

                //console.log('######Found input fields#####: ' + selectedElements[i].textContent);

                if (isVisible(elem) && (elem.textContent.toLowerCase().trim().startsWith(userInput) || hasValueAttribute(elem, userInput)
                        || hasPlaceholderAttribute(elem, userInput))) {
                    elements.push(elem);
                }
            }

            if (elements.length === 1) {

                if ($(elements).is('label')) {
                    selectedInputField = $(elements).next();
                    selectedInputField.focus();
                    changeInputMode(MODE_TYPE);

                } else {
                    selectedInputField = $(elements);
                    selectedInputField.focus();
                    changeInputMode(MODE_TYPE);
                }
            } else {
                multipleElementsSelected();
            }
        }
    }

    function searchForButtons(selector, userInput) {

        let elem;

        let selectedElements = $(selector);

        if (selectedElements.length > 0) {
            for (let i = 0; i < selectedElements.length; i++) {

                elem = selectedElements[i];

                //console.log('######Found Buttons#####: ' + elem.textContent);

                if (isVisible(elem) && (elem.textContent.toLowerCase().trim().startsWith(userInput)
                    || hasValueAttribute(selectedElements[i], userInput))) {
                    elements.push(elem);
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

    function searchForCheckboxesAndRadios(selector, userInput) {

        let selectedElements = $(selector);

        if (selectedElements.length > 0) {
            for (let i = 0; i < selectedElements.length; i++) {

                console.log('######Found Checks#####: ' + selectedElements[i].textContent.toLowerCase());

                if (selectedElements[i].textContent.toLowerCase().trim().startsWith(userInput)) {
                    elements.push(selectedElements[i]);
                }
            }

            if (elements.length === 1) {
                $(elements).first().click();
                /*elements[0].style.backgroundColor = 'black';
                elements[0].style.color = 'white';
                elements[0].click();*/
            } else {
                multipleElementsSelected();
            }
        }
    }

    function multipleElementsSelected() {
        for (let i = 0; i < elements.length; i++) {
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
        if (inputMode !== MODE_TYPE) {
            $(selectedInputField).blur();
            selectedInputField = null;
        }
        console.log('------Current MODE------: ' + inputMode);
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

    function splitUserCommand(userCommand, command) {
        return userCommand.slice((userCommand.indexOf(command) + command.length)).trim();
    }

    function isVisible(elem) {
        let top_of_element = $(elem).offset().top;
        let bottom_of_element = $(elem).offset().top + $(elem).outerHeight();
        let bottom_of_screen = $(window).scrollTop() + $(window).height();
        let top_of_screen = $(window).scrollTop();
        if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)) {
            console.log('ELEMENT VISIBLE');
        } else {
            console.log('ELEMENT NOT VISIBLE');
        }
        return (bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element);
    }

    /**
     *Setup Google Speech Recognition
     */
    try {
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
                    checkInputMode(result);
                }
            });
        }*/
        recognition.onresult = function (event) {
            let result = event.results[0][0].transcript;
            console.info('-----ON RESULT------: ' + result);
            if (result) {
                checkInputMode(result);
            }
        };
        recognition.addEventListener('end', recognition.start);
        recognition.start();
    }
    catch (e) {
        console.log('Web Speech error: ' + e);
    }


};


