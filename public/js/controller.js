/**
 * Created by Pastuh on 19.10.2017.
 */

import {
    SELECT_SELECTORS, CHECK_SELECTORS, CLICK_SELECTORS, SEARCH_SELECTORS, GO_TO_SELECTORS,
    CLICK, GO_TO, OFF, SELECT, CHECK, SCROLL_DOWN, SCROLL_UP, SCROLL_TO_BOTTOM, SCROLL_TO_TOP, SEARCH, STOP,
    REG_EXP_CLICK, REG_EXP_GO_TO, REG_EXP_OFF, REG_EXP_SEARCH, REG_EXP_CHECK, REG_EXP_SELECT, REG_EXP_SCROLL_DOWN,
    REG_EXP_SCROLL_TO_TOP, REG_EXP_SCROLL_TO_BOTTOM, REG_EXP_STOP, REG_EXP_SCROLL_UP,
    MODE_TYPE, MODE_SELECT, MODE_NO_MODE, STATE_LISTENING, STATE_ERROR, STATE_YOU_SAY, STATE_NO_MATCH
} from './const';

import 'jquery-ui-dist/jquery-ui.min'
//import '../stylesheets/style_controller.css'
//import 'chosen-js'


import speechRecognition from './visualizer';

let elements = [];
let selectedInputField;
let selectedSelect;
let inputMode = MODE_NO_MODE;

window.onload = function () {

    speechRecognition();

    let systemState = $('#vocs_text_status').text('Say something...');
    let textOnRecognition = $('#vocs_text_onrecognition');

    $('#search').click(function () {
        performUserAction($('#search-input').val());
    });

    /*$('#hide').click(function () {
        selectedSelect.hide().blur();
    });*/

    $('html, body').click(function () {
        changeInputMode(MODE_NO_MODE);
    });

    function performUserAction(input) {

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
                    scrollToTop();
                    break;
                case REG_EXP_SCROLL_TO_BOTTOM.test(userCommand):
                    scrollToBottom();
                    break;
                case REG_EXP_GO_TO.test(userCommand):

                    result = splitUserCommand(userCommand, GO_TO);

                    if (result) {
                        console.log('Search string for GO_TO: ' + result);
                        searchForInputFields(GO_TO_SELECTORS, result)
                    }
                    break;
                case REG_EXP_SELECT.test(userCommand):

                    result = splitUserCommand(userCommand, SELECT);

                    if (result) {
                        searchForSelect(SELECT_SELECTORS, result);
                    }
                    break;
                case REG_EXP_SEARCH.test(userCommand):

                    break;
                case REG_EXP_CHECK.test(userCommand):

                    changeInputMode(MODE_NO_MODE);

                    result = splitUserCommand(userCommand, CHECK);

                    if (result) {
                        console.log('Search string for CHECK: ' + result);
                        searchForCheckboxesAndRadios(CHECK_SELECTORS, result);
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

        } else if (inputMode === MODE_SELECT && selectedSelect) {

            console.log('//////INPUT////////: ' + input.toLowerCase().trim());

            $(selectedSelect).find('option').each(function () {

                console.log('//////FOUND option////////: ' + $(this).text().toLowerCase().trim());

                if ($(this).text().toLowerCase().trim().startsWith(input.toLowerCase().trim())) {

                    $(this).prop('selected', true);
                    $(selectedSelect).selectmenu("refresh");
                    changeInputMode(MODE_NO_MODE);
                }
            });

        }

        if (elements.length === 0) {
            console.error('-------------No element found------------------');
        }
        elements = [];

        let t1 = performance.now();
        console.log('Execution time: ' + (t1 - t0) + ' mil');
    }

    /**
     * INPUTS
     * */
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
            } else if (elements.length > 1){
                multipleElementsSelected();
            }
        }
    }

    /**
     * Buttons
     * */
    function searchForButtons(selector, userInput) {

        let elem;

        let selectedElements = $(selector);

        if (selectedElements.length > 0) {
            for (let i = 0; i < selectedElements.length; i++) {

                elem = selectedElements[i];

                //console.log('######Found Buttons#####: ' + elem.textContent);

                if (isVisible(elem) && (elem.textContent.toLowerCase().trim().startsWith(userInput)
                        || hasValueAttribute(elem, userInput))) {
                    if ($(elem).is('li') && $(elem).has('a')) {
                        console.log('TAB FOUND: ');
                    } else {
                        elements.push(elem);
                    }

                }
            }

            if (elements.length === 1) {
                elements[0].style.backgroundColor = '#e5e5e5';
                //$(elements[0]).trigger('click');
                elements[0].click();
            } else if (elements.length > 1) {
                multipleElementsSelected();
            }
        }
    }

    /**
     * CHECKS
     * */
    function searchForCheckboxesAndRadios(selector, userInput) {

        let elem;

        let selectedElements = $(selector);

        if (selectedElements.length > 0) {
            for (let i = 0; i < selectedElements.length; i++) {

                elem = selectedElements[i];

                console.log('######Found Checks#####: ' + elem.textContent.toLowerCase());

                if (isVisible(elem) && elem.textContent.toLowerCase().trim().startsWith(userInput)) {
                    console.log('TRUE add element: ' + elem.textContent);
                    elements.push(elem);
                }
            }

            if (elements.length === 1) {
                $(elements).prev().click();

            } else if (elements.length > 1) {
                multipleElementsSelected();
            }
        }
    }

    /**
     * SELECT
     * */
    function searchForSelect(selector, userInput) {

        let elem;

        let selectedElements = $(selector);

        if (selectedElements.length > 0) {
            for (let i = 0; i < selectedElements.length; i++) {

                elem = selectedElements[i];

                //console.log('######Found Selects#####: ' + elem.textContent.toLowerCase());

                if (/*isVisible(elem) && */(elem.textContent.toLowerCase().trim().startsWith(userInput) || hasOption(elem, userInput))) {
                    console.log('Select found: ' + elem.textContent);
                    elements.push(elem);
                }
            }

            if (elements.length === 1) {

                if ($(elements).is('label')) {
                    selectedSelect = $(elements).next();
                } else {
                    selectedSelect = $(elements);
                }
                try {
                    selectedSelect.selectmenu('open');
                } catch (e) {
                    selectedSelect.selectmenu().selectmenu('open');
                }
                changeInputMode(MODE_SELECT);

            } else if (elements.length > 1) {
                multipleElementsSelected();
            }
        }
    }

    function multipleElementsSelected() {

        console.log('^^^^^^Amount of Elements^^^^^^: ' + elements.length);

        for (let i = 0; i < elements.length; i++) {
            $(elements).addClass('vocs_multiple_selected');
            console.log('++++Multiple Selected Elements+++++: ' + elements[i].textContent);
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

    function hasOption(element, userInput) {
        if ($(element).is('select')) {
            console.log('********Selects content: ' + element.textContent.toString().toLowerCase());
            if (element.textContent.toString().toLowerCase().indexOf(userInput) > 0) {
                return true;
            }
        }
        return false;
    }

    function changeInputMode(newInputMode) {
        inputMode = newInputMode;
        if (inputMode === MODE_NO_MODE) {
            $(selectedInputField).blur();
            $(selectedSelect).selectmenu('close');
            selectedInputField = null;
            selectedSelect = null;
        }
        console.log('------Current MODE------: ' + inputMode);
    }

    function scrollDown() {
        $('html, body').animate({
            scrollTop: $(window).scrollTop() + (window.innerHeight * 0.7)
        });
    }

    function scrollUp() {
        $('html, body').animate({
            scrollTop: $(window).scrollTop() - (window.innerHeight * 0.7)
        });
    }

    function scrollToTop() {
        $("html, body").animate({scrollTop: 0}, "slow");
    }

    function scrollToBottom() {
        $("html, body").animate({scrollTop: $(document).height()}, 1000);
    }

    function splitUserCommand(userCommand, command) {
        return userCommand.slice((userCommand.indexOf(command) + command.length)).trim();
    }

    function isVisible(elem) {
        let top_of_element = $(elem).offset().top;
        let bottom_of_element = $(elem).offset().top + $(elem).outerHeight();
        let bottom_of_screen = $(window).scrollTop() + $(window).height();
        let top_of_screen = $(window).scrollTop();
        return (bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element);
    }

    /**
     *Setup Google Speech Recognition
     */
    try {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.start();

        recognition.onresult = function (event) {

            let recognitionResult = event.results[0][0].transcript;

                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');

                provideSystemStatus(STATE_LISTENING, transcript);

            if (recognitionResult) {

                if (event.results[0].isFinal) {
                    provideSystemStatus(STATE_YOU_SAY, recognitionResult);
                    performUserAction(recognitionResult);
                }
            }

        };
        recognition.addEventListener('end', recognition.start);
        recognition.onerror = function (e) {
            console.error('Error on recognition: ' + e);
        }
    }
    catch (e) {
        console.error('Web Speech error: ' + e);
    }

    /*$('#startRecord').click(function () {
        if ($('#control-img').attr('src') === './images/play_icon.svg') {
            recignition.start();
        } else {
            $('#control-img').attr('src', './images/play_icon.svg');
            recignition.stop();
        }

    });*/

    function provideSystemStatus(state, onRecognition) {
        if (textOnRecognition.length === 10){
            $(textOnRecognition).text(onRecognition);;
        }
        $(systemState).text(state);
        $(textOnRecognition).text(onRecognition);
    }


};


