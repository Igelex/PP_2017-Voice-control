import {CLICK_SELECTORS, GO_TO_SELECTORS, CHECK_SELECTORS, SELECT_SELECTORS, SEARCH_SELECTORS, TYPE_FOCUSABLE, TYPE_SELECTABLE, TYPE_CLICKABLE} from "./const";

export function generateId(i) {
    return 'vocs_multiple_select_wrapper_' + i;
}

export function buildMultipleWrapper(i, wrapperWidth){
    const wrapperTemplate = `<div id="${generateId(i)}" data-number="${i + 1}" class="vocs_multiple_select_wrapper">     
                             </div>`;
    return $(wrapperTemplate).width((wrapperWidth <= 100) ? wrapperWidth + 40 : wrapperWidth);
}

export function splitUserCommand(userCommand, command) {
    return userCommand.slice((userCommand.indexOf(command) + command.length)).trim();
}

export function getTypeOfElement(element) {
    let clickable = CLICK_SELECTORS + ',' + CHECK_SELECTORS;
    let focusable = GO_TO_SELECTORS + ',' + SEARCH_SELECTORS;
    let selectable = SELECT_SELECTORS;

    let typeC = TYPE_CLICKABLE;
    let typeF = TYPE_FOCUSABLE;
    let typeS = TYPE_SELECTABLE;

    if ($(element).is(clickable)){
        return typeC;
    } else if ($(element).is(focusable)){
        return typeF;
    } else if ($(element).is(selectable)){
        return typeS;
    }
}