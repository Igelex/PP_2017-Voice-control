/**
 * Created by Pastuh on 19.10.2017.
 */
import {
    SELECT_SELECTORS, CHECK_SELECTORS, CLICK_SELECTORS, SEARCH_SELECTORS, GO_TO_SELECTORS,
    CLICK, GO_TO, OFF, SELECT, CHECK, SCROLL_DOWN, SCROLL_UP, SCROLL_TO_BOTTOM, SCROLL_TO_TOP, SEARCH, STOP,
    REG_EXP_CLICK, REG_EXP_GO_TO, REG_EXP_OFF, REG_EXP_SEARCH, REG_EXP_CHECK, REG_EXP_SELECT, REG_EXP_SCROLL_DOWN,
    REG_EXP_SCROLL_TO_TOP, REG_EXP_SCROLL_TO_BOTTOM, REG_EXP_STOP, REG_EXP_SCROLL_UP,
    MODE_TYPE, MODE_SELECT, MODE_NO_MODE, STATE_LISTENING, STATE_ERROR, STATE_YOU_SAY, STATE_NO_MATCH, STATE_ACTIVE,
    STATE_INACTIVE, STATE_MULTIPLE_MATCH, MODE_MULTIPLE, TYPE_FOCUSABLE
} from './const';
import {
    searchForButtons,
    searchForInputFields,
    searchForCheckboxesAndRadios,
    searchForSelect,
    getLabel
} from './search_for_elements';
import {
    scrollUp,
    scrollDown,
    scrollToBottom,
    scrollToTop,
    executeClick,
    executeSetText,
    executeFocus,
    executeCheck, executeAction
} from './actions';
import {buildMultipleWrapper, splitUserCommand, getTypeOfElement} from "./helper";

import 'jquery-ui-dist/jquery-ui.min'
import wordsToNumbers from 'words-to-numbers';
//import '../stylesheets/vocs_styles.css'
//import 'chosen-js'


import speechRecognition from './visualizer';

let currentElements = [];
let currentMultipleElements = [];
let currentInputfield;
let currentSelect;
let currentMode = MODE_NO_MODE;
let systemRecognitionState = false;

window.onload = function () {

    speechRecognition();

    let systemState = $('#vocs_text_status');
    let OnRecognition = $('#vocs_text_onrecognition');

    $('#search').click(function () {
        performUserAction($('#search-input').val());
    });

    /*$('#hide').click(function () {
        currentSelect.hide().blur();
    });*/

    /*$('html, body').click(function () {
        changeInputMode(MODE_NO_MODE);
    });*/

    function performUserAction(input) {

        let t0 = performance.now();

        let userCommand = input.toString().toLowerCase().trim();

        let result;

        if (currentMode === MODE_MULTIPLE) {
            try {

                /**
                 * TODO: fix words to number
                 */
                userCommand = wordsToNumbers(userCommand, {fuzzy: true});
                console.log('NUmbER after convert: ' + userCommand);
                let elem = currentMultipleElements[parseInt(userCommand) - 1];

                executeAction(elem);
                changeInputMode(MODE_NO_MODE);

                if(getTypeOfElement(elem) === TYPE_FOCUSABLE){
                    currentInputfield = elem;
                    changeInputMode(MODE_TYPE);
                }

                for (let i = 0; i < currentMultipleElements.length; i++) {
                    $(currentMultipleElements[i]).unwrap('.vocs_multiple_select_wrapper');
                }
                currentMultipleElements = [];

                $( '.vocs_multiple_select_label' ).each(function() {
                    $( this ).unwrap('.vocs_multiple_select_wrapper').removeClass('vocs_multiple_select_label');
                });

                provideSystemStatus('You choose:', userCommand);

            } catch (e) {
                console.error('Error im MULTIPLE mode: ' + e);
            }
            return;
        }

        if (REG_EXP_STOP.test(userCommand)) {
            changeInputMode(MODE_NO_MODE);
            return;
        }

        if (currentMode === MODE_NO_MODE) {
            switch (true) {
                case REG_EXP_CLICK.test(userCommand):

                    result = splitUserCommand(userCommand, CLICK);

                    if (result) {
                        console.log('Search string for CLICKS: ' + result);
                        currentElements.push(...searchForButtons(CLICK_SELECTORS, result));
                        if (currentElements.length === 1) {
                            executeClick(currentElements[0]);
                        }
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
                        currentElements.push(...searchForInputFields(GO_TO_SELECTORS, result));
                        if (currentElements.length === 1) {
                            executeFocus(currentElements[0]);
                            currentInputfield = $(currentElements[0]);
                            changeInputMode(MODE_TYPE);
                        }

                    }
                    break;
                case REG_EXP_SELECT.test(userCommand):

                    result = splitUserCommand(userCommand, SELECT);

                    if (result) {
                        currentElements.push(...searchForSelect(SELECT_SELECTORS, result));
                    }
                    break;
                case REG_EXP_SEARCH.test(userCommand):

                    break;
                case REG_EXP_CHECK.test(userCommand):

                    changeInputMode(MODE_NO_MODE);

                    result = splitUserCommand(userCommand, CHECK);

                    if (result) {
                        currentElements.push(...searchForCheckboxesAndRadios(CHECK_SELECTORS, result));
                        if (currentElements.length === 1) {
                            executeCheck(currentElements[0]);
                        }
                    }
                    break;
                case REG_EXP_OFF.test(userCommand):

                    break;
                default:
            }
        } else if (currentMode === MODE_TYPE && currentInputfield) {
            executeSetText(currentInputfield, userCommand);

        } else if (currentMode === MODE_SELECT && currentSelect) {

            console.log('//////INPUT////////: ' + input.toLowerCase().trim());

            $(currentSelect).find('option').each(function () {

                console.log('//////FOUND option////////: ' + $(this).text().toLowerCase().trim());

                if ($(this).text().toLowerCase().trim().startsWith(input.toLowerCase().trim())) {

                    $(this).prop('selected', true);
                    $(currentSelect).selectmenu("refresh");
                    changeInputMode(MODE_NO_MODE);
                }
            });

        }

        if (currentElements.length === 0) {
            provideSystemStatus(STATE_NO_MATCH, 'Please try again');
            console.error('-------------No element found------------------');
        }
        console.log(currentElements);
        console.log(currentElements.length);

        if (currentElements.length > 1) {
            multipleElementsSelected();
            provideSystemStatus(STATE_MULTIPLE_MATCH, 'Please choose a NUMBER');
        }

        currentElements = [];
        let t1 = performance.now();
        console.log('Execution time: ' + (t1 - t0) + ' mil');
    }

    /**
     * INPUTS
     * */
    /*function searchForInputFields(selector, userInput) {
        currentInputfield = null;

        let selectedElements = $(selector);

        let elem;

        if (selectedElements.length > 0) {

            for (let i = 0; i < selectedElements.length; i++) {

                elem = selectedElements[i];

                //console.log('######Found input fields#####: ' + selectedElements[i].textContent);

                if (isVisible(elem) && (elem.textContent.toLowerCase().trim().startsWith(userInput) || hasValueAttribute(elem, userInput)
                        || hasPlaceholderAttribute(elem, userInput))) {
                    currentElements.push(elem);
                }
            }

            if (currentElements.length === 1) {

                if ($(currentElements).is('label')) {
                    currentInputfield = $(currentElements).next();
                    currentInputfield.focus();
                    changeInputMode(MODE_TYPE);

                } else {
                    currentInputfield = $(currentElements);
                    currentInputfield.focus();
                    changeInputMode(MODE_TYPE);
                }
            } else if (currentElements.length > 1){
                multipleElementsSelected();
            }
        }
    }*/

    /**
     * Buttons
     * */
    /*function searchForButtons(selector, userInput) {

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
                        currentElements.push(elem);
                    }

                }
            }

            if (currentElements.length === 1) {
                currentElements[0].style.backgroundColor = '#e5e5e5';
                //$(currentElements[0]).trigger('click');
                currentElements[0].click();
            } else if (currentElements.length > 1) {
                multipleElementsSelected();
            }
        }
    }*/

    /**
     * CHECKS
     * */
    /*function searchForCheckboxesAndRadios(selector, userInput) {

        let elem;

        let selectedElements = $(selector);

        if (selectedElements.length > 0) {
            for (let i = 0; i < selectedElements.length; i++) {

                elem = selectedElements[i];

                console.log('######Found Checks#####: ' + elem.textContent.toLowerCase());

                if (isVisible(elem) && elem.textContent.toLowerCase().trim().startsWith(userInput)) {
                    console.log('TRUE add element: ' + elem.textContent);
                    currentElements.push(elem);
                }
            }

            if (currentElements.length === 1) {
                $(currentElements).prev().click();

            } else if (currentElements.length > 1) {
                multipleElementsSelected();
            }
        }
    }*/

    /**
     * SELECT
     * */

    /*function searchForSelect(selector, userInput) {

        let elem;

        let selectedElements = $(selector);

        if (selectedElements.length > 0) {
            for (let i = 0; i < selectedElements.length; i++) {

                elem = selectedElements[i];

                //console.log('######Found Selects#####: ' + elem.textContent.toLowerCase());

                if (/!*isVisible(elem) && *!/(elem.textContent.toLowerCase().trim().startsWith(userInput) || hasOption(elem, userInput))) {
                    console.log('Select found: ' + elem.textContent);
                    currentElements.push(elem);
                }
            }

            if (currentElements.length === 1) {

                if ($(currentElements).is('label')) {
                    currentSelect = $(currentElements).next();
                } else {
                    currentSelect = $(currentElements);
                }
                try {
                    currentSelect.selectmenu('open');
                } catch (e) {
                    currentSelect.selectmenu().selectmenu('open');
                }
                changeInputMode(MODE_SELECT);

            } else if (currentElements.length > 1) {
                multipleElementsSelected();
            }
        }
    }*/

    function multipleElementsSelected() {

        console.log('^^^^^^Amount of Elements^^^^^^: ' + currentElements.length);

        for (let i = 0; i < currentElements.length; i++) {

            if ($(currentElements[i]).is('input') && getLabel($(currentElements[i]).attr('id'))) {

                let label = getLabel($(currentElements[i]).attr('id'));
                let wrapperWidth = $(label).outerWidth(true);
                /*let position = $(label).offset();
                $('<div class="vocs_multiple_select_wrapper">').css({top: position.top, left: position.left}).appendTo('body');*/

                $(label).wrap(buildMultipleWrapper(i, wrapperWidth));
                $(label).addClass('vocs_multiple_select_label');

                //$('#' + generateId(i)).width(wrapperWidth);

            } else {
                let wrapperWidth = $(currentElements[i]).outerWidth(true);
                $(currentElements[i]).wrap(buildMultipleWrapper(i, wrapperWidth));
            }
            changeInputMode(MODE_MULTIPLE);
            currentMultipleElements.push(currentElements[i]);
        }
    }

    function changeInputMode(newInputMode) {
        currentMode = newInputMode;
        if (currentMode === MODE_NO_MODE) {
            $(currentInputfield).blur();
            $(currentSelect).selectmenu('close');
            currentInputfield = null;
            currentSelect = null;
        }
        console.log('------Current MODE------: ' + currentMode);
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
        //recognition.start();

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
                    clearUI();
                }
            }

        };
        recognition.addEventListener('end', recognition.start);
        recognition.onerror = function (e) {
            console.error('Error on recognition: ' + e);
        };

        $('#startRecord').click(function () {
            if (!systemRecognitionState) {
                provideSystemStatus('Say something', '');
                recognition.start();
                systemRecognitionState = STATE_ACTIVE;
                console.log('+++++STOP Recognition++++++');
            }
            /*else {
                           recognition.start();
                           systemRecognitionState = STATE_ACTIVE;
                           console.log('+++++START Recognition++++++');
                       }*/

        });
    }
    catch (e) {
        console.error('Web Speech error: ' + e);
    }

    function provideSystemStatus(state, textOnRecognition) {
        if (textOnRecognition.length > 35) {
            let limitedRecognitionText = textOnRecognition.slice(textOnRecognition.length - 35, textOnRecognition.length);
            $(OnRecognition).text(limitedRecognitionText);
        } else {
            $(OnRecognition).text(textOnRecognition);
        }
        $(systemState).text(state);
    }

    function clearUI() {
        setTimeout(function () {
            $(OnRecognition).text('');
            $(systemState).text('Say something');
            console.log('Reset UI');
        }, 5000);

    }
};


