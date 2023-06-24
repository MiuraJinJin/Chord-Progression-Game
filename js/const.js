/*
 * Chord Progression Game
 * 定数
 *
 * Author : Masaoki Miura
 * update : 20180815, ver.0.50, created
 */

var LIMIT_MISS_COUNT = 5;
var DEFAULT_FINAL_LEVEL = 10;

var NONE = 0;
var ROOT = 1;
var SYMB = 2;
var COMP = 3;
var CRCT = 4;

var CP_LEN = 4;

var MODE = {
    CHALENGE_STD: 'CL_STD',
    CHALENGE_IMMORTAL: 'CL_IMMORTAL',
    TRAINING_LVSELECT: 'TR_LV_SELECT',
    TRAINING_CDSELECTA: 'TR_CD_SELECT_A', //TRAINING_CPS_INCLUDING_SELECTED_CDS
    TRAINING_CDSELECTB: 'TR_CD_SELECT_B', //TRAINING_CPS_CONSIST_OF_SELECTED_CDS
    EDIT : {
        ADD_CP: 'EDIT_ADD_CP',
        UPDATE: 'EDIT_UPDATE'
    }
};

var SIGNATURE_LIST = ['＃', '♭'];
var TENS_LIST = ['♭9', '9', '＃9', '11', '＃11', '♭13', '13'];

var TENS_DISTANCE_TABLE = {
    '♭9'  : 1,
    '9'   : 2,
    '＃9' : 3,
    '11'  : 5,
    '＃11': 6,
    '♭13' : 8,
    '13'  : 9
}

var DISTANCE_TENS_TABLE = {
    '1' : '♭9',
    '2' : '9',
    '3' : '＃9',
    '5' : '11',
    '6' : '＃11',
    '8' : '♭13',
    '9' : '13'
};

var ROOT_DISTANCE_TABLE = {

    'C'  : 0,
    'C＃': 1,
    'D'  : 2,
    'E♭' : 3,
    'E'  : 4,
    'F'  : 5,
    'F＃': 6,
    'G'  : 7,
    'G＃': 8,
    'A'  : 9,
    'B♭' : 10,
    'B'  : 11
};

var DISTANCE_ROOT_TABLE = {

    '0'  : 'C',
    '1'  : 'C＃',
    '2'  : 'D',
    '3'  : 'E♭',
    '4'  : 'E',
    '5'  : 'F',
    '6'  : 'F＃',
    '7'  : 'G',
    '8'  : 'G＃',
    '9'  : 'A',
    '10' : 'B♭',
    '11' : 'B'
};

var CP_FORMAT = [
        {stdName: '', altNames: [], filename: '', root: '', symbol: '', inversionNo: 0, detune: 0, bass: {filename: '', detune: 0 }, tens: {name: '', filename: '', detune: 0}},
        {stdName: '', altNames: [], filename: '', root: '', symbol: '', inversionNo: 0, detune: 0, bass: {filename: '', detune: 0 }, tens: {name: '', filename: '', detune: 0}},
        {stdName: '', altNames: [], filename: '', root: '', symbol: '', inversionNo: 0, detune: 0, bass: {filename: '', detune: 0 }, tens: {name: '', filename: '', detune: 0}},
        {stdName: '', altNames: [], filename: '', root: '', symbol: '', inversionNo: 0, detune: 0, bass: {filename: '', detune: 0 }, tens: {name: '', filename: '', detune: 0}}
];

var TENS_DETUNE_TABLE = {
        '♭9': 100,
        '9': 200,
        '＃9': 300,
        '11': 500,
        '＃11': 600,
        '♭13': 800,
        '13': 900
};

var ALL_SOURCES_NUM = 13;

var INPUT_CP_FORMAT = [
    {value: '', symbol: '', tens: '', step: NONE, compValue: ''},
    {value: '', symbol: '', tens: '', step: NONE, compValue: ''},
    {value: '', symbol: '', tens: '', step: NONE, compValue: ''},
    {value: '', symbol: '', tens: '', step: NONE, compValue: ''}
];

var CP_DATA_LEVEL_FORMAT = {
    levelComment : "",
    isRand : false,
    cpData : []
};

var MISS_DETAIL_ELM_DEFAULT = {
    correctAns: [],
    playBackData: {},

    yourAns: [] ,
    NGAns: [],
    status: []
};

var MISS_DETAIL_STATUS_CORRECT = "CORRECT";
var MISS_DETAIL_STATUS_NG = "NG";
var MISS_DETAIL_STATUS_PASS = "PASS";

var CHORD_DISTANCE_TABLE = {
    '△': [0,4,7],
    '△7': [0,4,7,11],
    '7': [0,4,7,10],
    '6': [0,4,7,9],
    'm': [0,3,7],
    'm7': [0,3,7,10],
    'm6': [0,3,7,9],
    'm△7': [0,3,7,11],
    'aug': [0,4,8],
    'aug7': [0,4,8,10],
    '△7(＃5)': [0,4,8,11],
    'dim': [0,3,6],
    'm7(♭5)': [0,3,6,10],
    'dim7': [0,3,6,9],
    '7(♭5)': [0,4,6,10],
    '△7(♭5)': [0,4,6,11],
    'sus4': [1,5,7],
    'sus2': [1,2,7],
    '7sus4': [1,5,7,10]
};

var ALL_NOTECHARS= [ 'c', 'd', ];
