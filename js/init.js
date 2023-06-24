/*
 * Chord Progression Game
 * 初期処理
 *
 * Author : Masaoki Miura
 * update : 20180815, ver.0.50, Refactored
 */

var getAudioContext = function() {

    try {
        window.AudioContext =
                window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    } catch(e) {
        alert('このブラウザはWeb Audio APIに対応していません');
    }
};

var levelInit = function() {

    var i = 0;
    var j = 0;
    var len = 0;

    var lcFinalLv = 0;
    var lcKeys = [];
    var lcKeyNum = 0;;

    gvDispLevels = [];

    lcKeys = Object.keys(cpData);

    for (i = 0, len = lcKeys.length; i < len; i++) {

        lcKeyNum = parseInt(lcKeys[i]);

        if (lcKeyNum > lcFinalLv) {
            lcFinalLv = lcKeyNum;
        }

        for (j = gvDispLevels.length - 1; j >= 0 ; j--) {
            if (lcKeyNum > gvDispLevels[j]) {
                gvDispLevels[j + 1] = lcKeyNum;
                break;
            } else {
                gvDispLevels[j + 1] = gvDispLevels[j];
            }
        }

        if (j === -1) {
            gvDispLevels[0] = lcKeyNum;
        }
    }

    mng.option.finalLevel = lcFinalLv;
};

var getCpData = function() {

    var jsonReq = null;

    jsonReq = new XMLHttpRequest();
    jsonReq.open('GET', './props/cpData.json', true);
    jsonReq.send('');

    jsonReq.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            cpData = JSON.parse(this.responseText);
            levelInit();
        }
    };
};


(function() {
    getAudioContext();
    getCpData();
}());

app.directive('allRoundBtnDitect', function(){
    return {
        priority: 10,
        terminal: false,
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                if (event.target.type === 'button') {
                    mng.msg = '';
                }
            });
        }
    };
});
