/*
 * Chord Progression Game
 * 疑似ウィンドウの遷移
 *
 * Author : Masaoki Miura
 * update : 20180815, ver.0.50, Refactored
 */

// ng-styleのwindowのdisplayがnoneになれば初期表示画面は消える　とりあえず
app.controller('window', [
	'$scope', '$window', '$interval', '$controller', function($scope, $window, $interval, $controller) {

		$controller('share_ctrl', {$scope, $scope});

		var i = 0;
		var len = 0;
		var temp = 0;
		var protectInfLoopCnt = 0;

		$scope.mng = mng;

		$scope.wkBpm = 120;
		$scope.wkVol = 100;
		$scope.playLevels = [];
		$scope.noteTypes = [
			{disp:'random',value:'r'},
			{disp:'clean',value:'c'},
			{disp:'distortion',value:'d'},
		];
		$scope.allLevels = [];

		var selBDisp = {};
		selBDisp.root = "";
		selBDisp.symbol = "";
		selBDisp.tension = "";
		$scope.selBDisp = selBDisp;
		$scope.finalLevel = 0;
		$scope.startLevel = 0;

		intervalPromise = $interval(function(){

			protectInfLoopCnt++;

			if (mng.option.finalLevel > 0 || protectInfLoopCnt >= 40) {
				for (i = 1, temp = mng.option.finalLevel; i <= temp; i++) {
					$scope.playLevels.push(i);
				}
				for (i = 0, len = gvDispLevels.length; i < len; i++) {
					$scope.allLevels.push(gvDispLevels[i]);
				}
				$scope.startLevel = 1;
				$scope.finalLevel = mng.option.finalLevel;
				$scope.intervalStop();
			}

		}, 50);

		// htmlの記述から持ってきたいんだけど、やり方わからんからこっちにこんなプロパティあるよって記述
		$scope.style = {
			bgnStyle: null,
			clgSlctStyle: null,
			trSlctStyle: null,
			lvSlctStyle: null,
			cdSlctStyleA: null,
			cdSlctStyleB: null,
			optionStyle: null
		};

		for (var key in $scope.style) {
			if (key === 'bgnStyle') {
				$scope.style[key] = {'display': 'inline'};
			} else {
				$scope.style[key] = {'display': 'none'};
			}
		}

		$scope.toClgSlct = function() {
			$scope.style.bgnStyle = {'display': 'none'};
			$scope.style.clgSlctStyle = {'display': 'inline'};
		};

		$scope.toTrSlct = function() {
			$scope.style.bgnStyle = {'display': 'none'};
			$scope.style.trSlctStyle = {'display': 'inline'};
		};

		$scope.playAsStd = function() {
			$scope.style.clgSlctStyle = {'display': 'none'};
			$scope.windowStyle = {'display': 'none'};
			mng.mode = MODE.CHALENGE_STD;
			mng.level = +($scope.startLevel);
			mng.option.startLevel = +($scope.startLevel);
			mng.option.finalLevel = +($scope.finalLevel);
			mng.option.noteType = $scope.selectedNoteType;
			init();
			$scope.divLayer = {'visibility': 'hidden'};
		};

		$scope.playAsImtl = function() {
			$scope.style.clgSlctStyle = {'display': 'none'};
			$scope.windowStyle = {'display': 'none'};
			mng.mode = MODE.CHALENGE_IMMORTAL;
			mng.level = +($scope.startLevel);
			mng.option.startLevel = +($scope.startLevel);
			mng.option.finalLevel = +($scope.finalLevel);
			mng.option.noteType = $scope.selectedNoteType;
			init();
			$scope.divLayer = {'visibility': 'hidden'};
		};

		$scope.toLvSlct = function() {
			$scope.style.trSlctStyle = {'display': 'none'};
			$scope.style.lvSlctStyle = {'display': 'inline'};
		};

		$scope.toCdSlctA = function() {
			$scope.style.trSlctStyle = {'display': 'none'};
			$scope.style.cdSlctStyleA = {'display': 'inline'};
		};

		$scope.toCdSlctB = function() {
			$scope.style.trSlctStyle = {'display': 'none'};
			$scope.style.cdSlctStyleB = {'display': 'inline'};
		};

		$scope.playAsSlctdLv = function() {
			$scope.style.lvSlctStyle = {'display': 'none'};
			$scope.windowStyle = {'display': 'none'};
			mng.mode = MODE.TRAINING_LVSELECT;
			mng.level = +($scope.selectedLv);
			mng.option.noteType = $scope.selectedNoteType;
			init();
			$scope.divLayer = {'visibility': 'hidden'};
		};

		$scope.playAsCdSlctA = function() {
			$scope.style.cdSlctStyleA = {'display': 'none'};
			$scope.windowStyle = {'display': 'none'};
			mng.mode = MODE.TRAINING_CDSELECTA;
			mng.level = 'none';
			mng.option.noteType = $scope.selectedNoteType;
			init();
			$scope.divLayer = {'visibility': 'hidden'};

		};

		$scope.playAsCdSlctB = function() {

			if (mng.selectedCdsB.length === 0) {
				$window.alert('コードを最低１つは指定してください');
				return;
			}

			$scope.style.cdSlctStyleB = {'display': 'none'};
			$scope.windowStyle = {'display': 'none'};
			mng.mode = MODE.TRAINING_CDSELECTB;
			mng.level = 'none';
			mng.option.noteType = $scope.selectedNoteType;
			init();
			$scope.divLayer = {'visibility': 'hidden'};
		};

		$scope.goBack = function() {
			$scope.style.clgSlctStyle = {'display': 'none'};
			$scope.style.trSlctStyle = {'display': 'none'};
			$scope.style.optionStyle = {'display': 'none'};
			$scope.style.bgnStyle = {'display': 'inline'};
		};
		$scope.goBackToTr = function() {
			$scope.style.lvSlctStyle = {'display': 'none'};
			$scope.style.cdSlctStyleA = {'display': 'none'};
			$scope.style.cdSlctStyleB = {'display': 'none'};
			$scope.style.trSlctStyle = {'display': 'inline'};
		};

		$scope.toOption = function() {
			$scope.style.bgnStyle = {'display': 'none'};
			$scope.style.optionStyle = {'display': 'inline'};
		};

		$scope.selBAddRoot = function(value) {
			$scope.selBDisp.root = value;
		};
		$scope.selBAddSymbol = function(value) {
			$scope.selBDisp.symbol = value;
		};
		$scope.selBAddTension = function(value) {
			if (value) value = '(' + value + ')';
			$scope.selBDisp.tension = value;
		};
		$scope.selBAddCd = function() {
			if ($scope.selBDisp.root) {
				if (!$scope.selBDisp.symbol) $scope.selBDisp.symbol = "△";
				mng.selectedCdsB.push($scope.selBDisp.root + $scope.selBDisp.symbol + $scope.selBDisp.tension);
				$scope.selBDisp.root = $scope.selBDisp.symbol = $scope.selBDisp.tension = "";
				for (key in mng.symbolPointer) mng.symbolPointer[key] = 0;
			}
		};
		$scope.selBAC = function() {
			mng.selectedCdsB.length = 0;
			for (key in mng.symbolPointer) mng.symbolPointer[key] = 0;
		};
	}
]);
