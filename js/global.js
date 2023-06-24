/*
 * Chord Progression Game
 * グローバル変数
 *
 * Author : Masaoki Miura
 * update : 20180815, ver.0.50, created
 */

var app = angular.module("app", []);
var context = null;

var cpData = {};

var answer = [
    {value: '', symbol: '', tens: '', step: NONE, compValue: '', msg: ''},
    {value: '', symbol: '', tens: '', step: NONE, compValue: '', msg: ''},
    {value: '', symbol: '', tens: '', step: NONE, compValue: '', msg: ''},
    {value: '', symbol: '', tens: '', step: NONE, compValue: '', msg: ''}
];

var ansArea = ['crntArea', '', '', ''];

var toNext = false;

var mng = {
    qNo : 0,
    modeName : "",
    rightCount : 0,
    missCount : 0,
    level : '',
    levelUpCount : 5,
    crntArea: 0,
    formerArea: -1,
    unstartable: false,
    unrepeatable: true,
    msg: '',
    mode : '',
    currentPlayingSource: {},

    symbolPointer : {
        major : 0,
        minor : 0,
        aug : 0,
        dim : 0,
        sus : 0
    },

    option: {
        on1st: false,
        onBass1st: true,
        bassVol: 1,
        startLevel: 0,
        finalLevel: 0,
        speed: 1,
        noteType: '',
        isModeDisp: false,
    },
    selectedCdsB: [],
    canPass: false,
    missDetail: [],
    buttonValue: {
        start: 'start'
    },
};

var gvSourceConnectCnt = 0;
var intervalPromise = null;

var source = {
    chord: [null, null, null, null],
    bass: [null, null, null, null],
    drum: null,
    tens: [null, null, null, null]
};
var repeatSource = {
    chord: [null, null, null, null],
    bass: [null, null, null, null],
    drum: null,
    tens: [null, null, null, null]
};
var cp = [null, null, null, null];
var repeatCp = {
    cp:[null, null, null, null]
};

var gvDispLevels = [];
