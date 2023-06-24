/*
 * Chord Progression Game
 * コード進行作成
 *
 * Author : Masaoki Miura
 * update : 20180815, ver.0.50, Refactored
 */

var cpCreate = function(level) {

    var i = 0;
    var wk = [];
    var cp = [];
    var targetLevelData = {};

    targetLevelData = cpData[(level + "")];

    cp = angular.copy(CP_FORMAT);

    if (targetLevelData.isRand === false) {

        var cpDataIndex = Math.floor(Math.random() * targetLevelData.cpData.length);
        wk = targetLevelData.cpData[cpDataIndex];

    } else {

        for (i = 0; i < CP_LEN; i++) {
            wk.push(getRandCd(targetLevelData.cpData[i]));
        }
    }

    var currentNoteType = '';
    if (mng.option.noteType === 'r') {
        currentNoteType = ALL_NOTECHARS[Math.floor(Math.random() * ALL_NOTECHARS.length)];
    }
    else {
        currentNoteType = mng.option.noteType;
    }

    for (i = 0; i < CP_LEN; i++) {

        cp[i].stdName = wk[i];
        cp[i] = sliceRootSymbolTens(cp[i]);
        cp[i].altNames = getAltNames(cp[i]);
        cp[i].noteType = currentNoteType;

        if (mng.option.on1st) {
            cp[i].inversionNo = 1;
        } else if(cp[i].stdName.indexOf('△7') > 0) {
            cp[i].inversionNo = 1;
        } else {
            cp[i].inversionNo = getOn(cp[i].stdName);
        }

        cp[i] = decideFilenameAndDetune(cp[i], currentNoteType, 'c');

        if (cp[i].tens.name) {
            tensOctNo = 3;
            cp[i] = decideTensProps(cp[i], currentNoteType, tensOctNo + "");
        }
    }

    return cp;
};

var getOn = function(cd) {

    var on;

    if (cd.indexOf('7') === -1) {
        on = Math.floor(Math.random() * 3) + 1;
        return on;
   } else {
        on = Math.floor(Math.random() * 4) + 1;
        return on;
   }
};

var getRandCd = function() {

    var i = 0;
    var j = 0;
    var len = 0;
    var leng = 0;
    var args = [];
    var cd = "";

    for (i = 0, len = arguments.length; i < len; i++) {
        if (arguments[i] instanceof Array) {
            for (j = 0, leng = arguments[i].length; j < leng; j++) {
                args.push(arguments[i][j]);
            }
        } else {
            args.push(arguments[i]);
        }
    }

    cd = args[Math.floor(Math.random() * args.length)];
    return cd;

};

var cpCreate2 = function() {

    var wk = [];
    var cp = angular.copy(CP_FORMAT);

    for (var i = 0; i < CP_LEN; i++) {
        wk.push(getRandCd(mng.selectedCdsB));
    }

    var currentNoteType = "";
    if (mng.option.noteType === 'r') {
        currentNoteType = ALL_NOTECHARS[Math.floor(Math.random() * ALL_NOTECHARS.length)];
    }
    else {
        currentNoteType = mng.option.noteType;
    }

    for (var i = 0; i < CP_LEN; i++) {

        cp[i].stdName = wk[i];
        cp[i] = sliceRootSymbolTens(cp[i]);
        cp[i].altNames = getAltNames(cp[i]);
        cp[i].noteType = currentNoteType;

        if (mng.option.on1st) {
            cp[i].inversionNo = 1;
        } else if(cp[i].stdName.indexOf('△7') > 0) {
            cp[i].inversionNo = 1;
        } else {
            cp[i].inversionNo = getOn(cp[i].stdName);
        }

        cp[i] = decideFilenameAndDetune(cp[i], currentNoteType, 'c');
        if (cp[i].tens.name) {
            tensOctNo = 3;
            cp[i] = decideTensProps(cp[i], currentNoteType, tensOctNo + "");
        }
    }
    return cp;
};

var sliceRootSymbolTens = function(prmCdObj) {

    var stdName = prmCdObj.stdName;
    var signatureFlag = false;
    var tensFlag = false;

    for (var i = 0, len = SIGNATURE_LIST.length; i < len; i++) {
        if (stdName.indexOf(SIGNATURE_LIST[i]) === 1) {
            signatureFlag = true;
            break;
        }
    }

    for (var i = 0, len = TENS_LIST.length; i < len; i++) {
        if (stdName.indexOf(TENS_LIST[i]) > 0) {
            tensFlag = true;
            break;
        }
    }

    if (signatureFlag) {
        prmCdObj.root = stdName.substring(0, 2);
        prmCdObj.symbol = stdName.substring(2);
    } else {
        prmCdObj.root = stdName.substring(0, 1);
        prmCdObj.symbol = stdName.substring(1);
    }

    if (tensFlag) {
        var startIndex = prmCdObj.symbol.lastIndexOf('(') + 1;
        var endIndex = prmCdObj.symbol.lastIndexOf(')');
        prmCdObj.tens.name = prmCdObj.symbol.substring(startIndex, endIndex);
        prmCdObj.symbol = prmCdObj.symbol.substring(0, startIndex - 1);
    }

    return prmCdObj;
};

var decideFilenameAndDetune = function(prmCdObj, cdToneSymbol, bassToneSymbol) {

    var lcRoot = "";
    var lcBassRoot = "";
    var lcBassDisAry = null;
    var lcRootDetune = 0;
    var lcBassRootDetune = 0;

    lcRoot = prmCdObj.root;

    if (mng.option.onBass1st) {
        lcBassRoot = lcRoot;
    } else {
        lcBassDisAry = CHORD_DISTANCE_TABLE[prmCdObj.symbol];
        lcBassRoot = transRoot(lcRoot,
            lcBassDisAry[Math.floor(Math.random() * lcBassDisAry.length)]);
    }

    if (lcRoot.indexOf("＃") > 0) {
        lcRoot = lcRoot.substring(0, 1);
        lcRootDetune = 100;
    } else if (lcRoot.indexOf("♭") > 0) {
        lcRoot = lcRoot.substring(0, 1);
        lcRootDetune = -100;
    }

    if (lcBassRoot.indexOf("＃") > 0) {
        lcBassRoot = lcBassRoot.substring(0, 1);
        lcBassRootDetune = 100;
    } else if (lcBassRoot.indexOf("♭") > 0) {
        lcBassRoot = lcBassRoot.substring(0, 1);
        lcBassRootDetune = -100;
    }

    prmCdObj.filename = lcRoot + prmCdObj.symbol
            + '_' + cdToneSymbol + '_'
            + prmCdObj.inversionNo + '.wav';
    prmCdObj.detune = lcRootDetune;

    prmCdObj.bass.filename = 'bass_' + bassToneSymbol + '_' + lcBassRoot + '.wav';
    prmCdObj.bass.detune = lcBassRootDetune;

    return prmCdObj;
};

var decideTensProps = function(prmCdObj, tensToneSymbol, tensOctNo) {

    var lcTensDistance = 0;
    var lcTensNote = "";
    var lcTensDetune = 0;

    lcTensDistance = TENS_DISTANCE_TABLE[prmCdObj.tens.name]
                        + ROOT_DISTANCE_TABLE[prmCdObj.root];

    lcTensDistance = lcTensDistance % 12;
    lcTensNote = DISTANCE_ROOT_TABLE[lcTensDistance + ""];

    if (lcTensNote.indexOf("＃") > 0) {
        lcTensNote = lcTensNote.substring(0, 1);
        lcTensDetune = 100;
    } else if (lcTensNote.indexOf("♭") > 0) {
        lcTensNote = lcTensNote.substring(0, 1);
        lcTensDetune = -100;
    }

    prmCdObj.tens.filename = 'note_' + tensToneSymbol + '_' + lcTensNote + tensOctNo + '.wav';
    prmCdObj.tens.detune = lcTensDetune;

    return prmCdObj;
}

var getAltNames = function(prmCdObj) {

    var rtn = [];
    var lcSymbol = "";
    var lcAltName = "";

    lcSymbol = prmCdObj.symbol;

    switch (lcSymbol) {

        case '6' :

            lcAltName = createAltName(9, "m7", prmCdObj);
            if (lcAltName) rtn.push(lcAltName);
            break;

        case 'm7' :

            lcAltName = createAltName(3, "6", prmCdObj);
            if (lcAltName) rtn.push(lcAltName);
            break;

        case 'aug' :

            lcAltName = createAltName(4, "aug", prmCdObj);
            if (lcAltName) rtn.push(lcAltName);
            lcAltName = createAltName(8, "aug", prmCdObj);
            if (lcAltName) rtn.push(lcAltName);
            break;

        case 'dim7'  :

            lcAltName = createAltName(3, "dim7", prmCdObj);
            if (lcAltName) rtn.push(lcAltName);
            lcAltName = createAltName(6, "dim7", prmCdObj);
            if (lcAltName) rtn.push(lcAltName);
            lcAltName = createAltName(9, "dim7", prmCdObj);
            if (lcAltName) rtn.push(lcAltName);
            break;

        case 'sus4'  :

            lcAltName = createAltName(5, "sus2", prmCdObj);
            if (lcAltName) rtn.push(lcAltName);
            break;

        case 'sus2'  :

            lcAltName = createAltName(7, "sus4", prmCdObj);
            if (lcAltName) rtn.push(lcAltName);
            break;
    }

    return rtn;
}

var createAltName = function(prmDistance, prmSymbol, prmCdObj)  {

    var rtnAltName = "";
    var resultTens = "";

    var lcTens = "";
    var lcRoot = "";

    lcTens = prmCdObj.tens.name;
    lcRoot = prmCdObj.root;

    if (lcTens) {
        resultTens = transTens(lcTens, prmDistance);
        if (!resultTens) {
            return;
        }
        resultTens = '(' + resultTens + ')';
    }
    rtnAltName = transRoot(lcRoot, prmDistance) + prmSymbol + resultTens;

    return rtnAltName;
}

var transTens = function(prmTens, prmDistance) {

    var resultDistance = 0;
    var resultTens = "";

    resultDistance = TENS_DISTANCE_TABLE[prmTens];

    resultDistance = resultDistance + prmDistance;
    resultDistance = resultDistance % 12;
    resultTens = DISTANCE_TENS_TABLE[resultDistance + ""];

    return resultTens;

}

var transRoot = function(prmRoot, prmDistance) {

    var resultDistance = 0;
    var resultRoot = "";

    resultDistance = ROOT_DISTANCE_TABLE[prmRoot];

    resultDistance = resultDistance + prmDistance;
    resultDistance = resultDistance % 12;
    resultRoot = DISTANCE_ROOT_TABLE[resultDistance + ""];

    return resultRoot;

}
