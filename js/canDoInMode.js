/* 
 * Chord Progression Game
 * モードによる処理の要否の判定
 * 
 * Author : Masaoki Miura 
 * update : 20180815, ver.0.50, Refactored
 */

var canDoInMode = function(methodName, mode) {
    mode = mode || mng.mode;
    
    var rtn = true;
    
    if (mode === MODE.CHALENGE_STD) {
//        switch(methodName) {
//            case '': rtn = false;break;
//        }
    } else if (mode === MODE.CHALENGE_IMMORTAL) {
        switch(methodName) {
            case 'endGame': rtn = false;break;
        }
    } else if (mode === MODE.TRAINING_LVSELECT) {
        switch(methodName) {
            case 'endGame': rtn = false;break;
            case 'levelUpdate': rtn = false;break;
        }
    } else if (mode === MODE.TRAINING_CDSELECTA) {
        switch(methodName) {
            case 'endGame': rtn = false;break;
            case 'levelUpdate': rtn = false;break;
        }
    } else if (mode === MODE.TRAINING_CDSELECTB) {
        switch(methodName) {
            case 'endGame': rtn = false;break;
            case 'cpCreate': rtn = false;break;
            case 'levelUpdate': rtn = false;break;
        }
    }
    return rtn;
};