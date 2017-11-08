/**
 * Selectors
 */
const CLICK_SELECTORS = 'a, li, :button';
const GO_TO_SELECTORS = 'label, input[type="email"], input[type="text"], input[type="password"], input[type="number"],' +
    'input[type="search"], input[type="tel"]';
const CHECK_SELECTORS = 'input[type="checkbox"], input[type="radio"]';
const SELECT_SELECTORS = 'input[type="checkbox"], input[type="radio"]';
const SEARCH_SELECTORS = 'input[type="search"]';
/**
 * Keywords
 */
const CLICK = 'click';
const GO_TO = 'go to';
const OFF = 'off';
const SELECT = 'select';
const SCROLL_UP = 'scroll up';
const SCROLL_DOWN = 'scroll down';
const SCROLL_TO_BOTTOM = 'scroll to bottom';
const SCROLL_TO_TOP = 'scroll to top';
const SEARCH = 'search';
const STOP = 'stop';
/**
 * RegExp
 */
let REG_EXP_CLICK = /(click)\s[[a-zA-Z0-9\.]/;
let REG_EXP_GO_TO = /(go to)\s[[a-zA-Z0-9\.]/;
let REG_EXP_OFF = /^(off)$/;
let REG_EXP_SEARCH = /^(search)$/;
let REG_EXP_CHECK = /(check)\s[[a-zA-Z0-9\.]/;
let REG_EXP_SELECT = /(select)\s[[a-zA-Z0-9\.]/;
let REG_EXP_SCROLL_UP = /(scroll up)(\s[[a-zA-Z0-9\.])?/;
let REG_EXP_SCROLL_DOWN = /(scroll down)(\s[[a-zA-Z0-9\.])?/;
let REG_EXP_SCROLL_TO_TOP = /(scroll)\s(to\s)?(top)(\s[[a-zA-Z0-9\.])?/;
let REG_EXP_SCROLL_TO_BOTTOM = /(scroll)\s(to\s)?(bottom)(\s[[a-zA-Z0-9\.])?/;
let REG_EXP_STOP = /^(stop)$/;
console.log(REG_EXP_SCROLL_UP.test('scroll up'));
/**
 * Input Mode
 * */
const MODE_TYPE = 'type';
const MODE_SELECT = 'select';
const MODE_NO_MODE = '';
/**
 * Export consts
 */
export {SELECT_SELECTORS, CHECK_SELECTORS, CLICK_SELECTORS, SEARCH_SELECTORS, GO_TO_SELECTORS,
        CLICK, GO_TO, OFF, SELECT,SCROLL_DOWN, SCROLL_UP, SCROLL_TO_BOTTOM, SCROLL_TO_TOP, SEARCH, STOP,
        REG_EXP_CLICK, REG_EXP_GO_TO, REG_EXP_OFF, REG_EXP_SEARCH, REG_EXP_CHECK, REG_EXP_SELECT, REG_EXP_SCROLL_DOWN,
                                 REG_EXP_SCROLL_TO_TOP, REG_EXP_SCROLL_TO_BOTTOM,REG_EXP_STOP, REG_EXP_SCROLL_UP,
        MODE_TYPE, MODE_SELECT, MODE_NO_MODE};

