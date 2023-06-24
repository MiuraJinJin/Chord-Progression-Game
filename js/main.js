/*
 * Chord Progression Game
 * インタラクティブな処理 画面とのIF部分
 *
 * Author : Masaoki Miura
 * update : 20180815, ver.0.50, Refactored
 */

app.controller('answer_field', [
	'$scope', '$window', '$timeout', '$interval', '$controller', function($scope, $window, $timeout, $interval, $controller) {

		$controller('share_ctrl', {$scope, $scope});

		$scope.windowStyle = {'display': 'none'};
		$scope.gameOverStyle = {'display': 'none'};
		$scope.divLayer = {'visibility': 'hidden'};

		$scope.mng = mng;
		$scope.answer = answer;
		$scope.ansArea = ansArea;

		$scope.nextStart = function() {

			if (toNext) {

				toNext = false;
				mng.unrepeatable = true;

				// clear answer's props
				for (var i = 0, len = answer.length; i < len; i++) {
					answer[i].value = '';
					answer[i].symbol = '';
					answer[i].tens= '';
					answer[i].step = NONE;
					answer[i].compValue = '';
					answer[i].msg = '　';
				}

				// decide answer position
				toNextCrntArea();
			}

			sourceStart(source, mng.option.speed);

			mng.unstartable = true;

			// when the last chord end
			$timeout(function(){

				mng.unrepeatable = false;

				if (toNext) {
				   mng.unstartable = false;
				}
				// the middle large button's label is changed
				if (mng.buttonValue.start === 'start') {
					mng.buttonValue.start = 'next';
				}
			}, CP_LEN * 1000 * 1 / mng.option.speed);

			repeatCp.cp = cp.concat();
			setRepeatSource();
		};

		$scope.repeat = function() {

			sourceStart(repeatSource, mng.option.speed);

			mng.unrepeatable = true;
			mng.unstartable = true;

			// when the last chord end
			repeatSource.chord[CP_LEN - 1].onended = function() {

				mng.unrepeatable = false;

				if (toNext) {
				   mng.unstartable = false;
				}

				// reflect binding value
				$timeout(function(){}, 0);
			};

			setRepeatSource();
		};

		$scope.display = function(value) {

			var i = 0;
			var j = 0;

			for (i = 0; i < CP_LEN; i++) {

				// serching answer position that has no value,
				// put input value on it
				if (!(answer[i].value)) {

					answer[i].value = value;
					answer[i].step = ROOT;

					for (j = 0; j < i; j++) {
						if (answer[j].step === ROOT) {
							$scope.addSymbol('△');
						}
					}
					for (j = 0; j < i; j++) {
						if (answer[j].step === SYMB) {
							answer[j].step = COMP;
						}
					}
					break;
				}
			}

			toNextCrntArea();

			if (i === CP_LEN) {
				mng.msg = '選択が無効です＞音名ボタン';
			}
		};
		$scope.addSymbol = function(symbol) {

			var i = 0;

			for (i = 0; i < CP_LEN; i++) {

				if (answer[i].step === ROOT || answer[i].step === SYMB) {
					answer[i].symbol = symbol;
					answer[i].step = SYMB;
					break;
				}
			}
			if (i === CP_LEN) {
				mng.msg = '選択が無効です＞シンボルボタン';
			}
		};

		$scope.addTension = function(tension) {

			var i = 0;

			if (tension) {
				tension = '(' + tension + ')';
			}

			for (i = 0; i < CP_LEN; i++) {

				if (answer[i].step === ROOT) {

					answer[i].value += ('△');
					answer[i].step = COMP;
					answer[i].tens = tension;
					toNextCrntArea();
					break;

				} else if (answer[i].step === SYMB) {

					answer[i].step = COMP;
					answer[i].tens = tension;
					toNextCrntArea();
					break;

				}
			}

			if (i === CP_LEN) {

				if (mng.formerArea >= 0) {
					if (answer[mng.formerArea].step === COMP) {
						answer[mng.formerArea].tens = tension;
						toNextCrntArea();
					} else {
						mng.msg = '選択が無効です＞addボタン';
					}
				} else {
					mng.msg = '選択が無効です＞addボタン';
				}
			}
		};

		$scope.check = function() {

			var i = 0;
			var yourAnsAry = [];
			var correctAnsAry = [];
			var lcNGAnsAry = [];
			var lcAnsIndex = 0;
			var lcAllCorrectFlg = null;

			if (toNext) {
				$scope.mng.msg = '無効な操作です';
				return;
			}

			for (i = 0; i < CP_LEN; i++) {
				if (answer[i].step === ROOT) {
					$scope.addSymbol('△');
				}
			}
			for (i = 0; i < CP_LEN; i++) {
				answer[i].compValue = answer[i].value + answer[i].symbol + answer[i].tens;
			}

			for (i = 0; i < CP_LEN; i++) {

				if (cp[i].stdName === answer[i].compValue || cp[i].altNames.indexOf(answer[i].compValue) !== -1) {
					answer[i].step = CRCT;
					answer[i].msg = '正解';
				} else {
					answer[i].step = NONE;
					answer[i].value = '';
					answer[i].tens = '';
					answer[i].symbol = '';
				}
			}

			for (i = 0; i < CP_LEN; i++) {

				yourAnsAry.push(answer[i].compValue);
				correctAnsAry.push(cp[i].stdName);
				lcNGAnsAry.push([]);
			}

			if (!(mng.missDetail[mng.qNo])) {
				lcAnsIndex = 0;
				mng.missDetail[mng.qNo] = angular.copy(MISS_DETAIL_ELM_DEFAULT);
				mng.missDetail[mng.qNo].correctAns = correctAnsAry;
				mng.missDetail[mng.qNo].playBackData = angular.copy(cp);
			} else {
				lcAnsIndex = mng.missDetail[mng.qNo].yourAns.length;
			}

			mng.missDetail[mng.qNo].yourAns.push(yourAnsAry);
			mng.missDetail[mng.qNo].NGAns.push(lcNGAnsAry);

			lcAllCorrectFlg = true;

			for (i = 0; i < CP_LEN; i++) {
				if (mng.missDetail[mng.qNo].yourAns[lcAnsIndex][i] === mng.missDetail[mng.qNo].correctAns[i]) {
					mng.missDetail[mng.qNo].NGAns[lcAnsIndex][i] = false;
				} else {
					mng.missDetail[mng.qNo].NGAns[lcAnsIndex][i] = true;
					lcAllCorrectFlg = false;
				}
			}

			if (lcAllCorrectFlg) {
				mng.missDetail[mng.qNo].status.push(MISS_DETAIL_STATUS_CORRECT);
			} else {
				mng.missDetail[mng.qNo].status.push(MISS_DETAIL_STATUS_NG);
			}

			if (answer[0].step === CRCT && answer[1].step === CRCT
					&& answer[2].step === CRCT && answer[3].step === CRCT) {

				mng.rightCount++;
				toNext = true;
				if (mng.unrepeatable === false) {
					mng.unstartable = false;
				}

				toNextCrntArea();

				mng.formerArea = -1;

				mng.msg = 'すべて正解です　次の問題に進みます "next" ボタンを押してください';

				next();

				if (mng.level > mng.option.finalLevel) {
					$scope.endGameForComp();
				}
				mng.canPass = false;

			} else {

				if (canDoInMode('endGame')) {

					if (++mng.missCount >= LIMIT_MISS_COUNT) {
						$scope.endGame();
						return;
					}

				} else {
					mng.missCount++;
				}

				toNextCrntArea();

				mng.formerArea = -1;

				mng.canPass = true;
			}
		};

		$scope.stop = function() {
			sourceStop(mng.currentPlayingSource);
		};

		$scope.clear = function(i) {

			var cnt = 0;

			if (answer[i].step !== CRCT) {
				answer[i].value = '';
				answer[i].symbol= '';
				answer[i].tens= '';
				answer[i].step = NONE;
			} else {
				mng.msg = '正解した解答エリアはクリアできません';
			}

			for (cnt = 0; cnt < CP_LEN; cnt++) {
				if (answer[cnt].step === ROOT) {
					$scope.addSymbol('△');
					answer[cnt].step = COMP;
				}
			}

			toNextCrntArea();
		};

		$scope.pass = function() {

			for (var i = 0, len = answer.length; i < len; i++) {

				if (answer[i].step !== CRCT) {
					answer[i].value = cp[i].stdName;
					answer[i].symbol = '';
					answer[i].tens = '';
					answer[i].step = CRCT;
					answer[i].msg = '正答';
				}
			}

			toNextCrntArea();

			nextForPass();
			toNext = true;

			if (mng.unrepeatable === false) {
				mng.unstartable = false;
			}
			mng.msg = 'この問題をパスします "next"ボタンを押してください';
			mng.canPass = false;
		};

		$scope.playBack = function(prmCp) {


			var protectInfLoopCnt = 0;
			repeatCp.cp = prmCp;

			setRepeatSource();

			intervalPromise = $interval(function(){

				protectInfLoopCnt++;

				if (gvSourceConnectCnt >= ALL_SOURCES_NUM || protectInfLoopCnt >= 50) {
					sourceStart(repeatSource, mng.option.speed);
					$scope.intervalStop();
				}

			}, 100);

			mng.unrepeatable = true;

			// when the last chord end
			repeatSource.chord[CP_LEN - 1].onended = function() {

				mng.unrepeatable = false;

				// reflect binding value
				$timeout(function(){}, 0);
			};
		};

		$scope.endGame = function(){
			$scope.windowStyle = {'display': 'inline'};
			$scope.gameOverStyle = {'display': 'inline'};
			$scope.gameOverForCompStyle = {'display': 'none'};
			$scope.divLayer = {'visibility': 'visible'};
		};

		$scope.endGameForComp = function() {
			$scope.windowStyle = {'display': 'inline'};
			$scope.gameOverStyle = {'display': 'none'};
			$scope.gameOverForCompStyle = {'display': 'inline'};
			$scope.divLayer = {'visibility': 'visible'};
		};

		$scope.restart = function() {
			$window.location.reload();
		};
	}
]);

// 一番若い数字のNONEにcrntAreaを飛ばす
// 全部埋まってる場合はcrntAreaを4に
var toNextCrntArea = function() {

	var i = 0;

	for (i = 0; i < CP_LEN; i++) {
		if (answer[i].step === NONE || answer[i].step === ROOT || answer[i].step === SYMB) {
			break;
		}
	}
	if (mng.crntArea !== i && mng.crntArea < CP_LEN) {
		mng.formerArea = mng.crntArea;
	}

	mng.crntArea = i;

	for (i = 0; i < CP_LEN; i++) {
		if (i === mng.crntArea) {
			ansArea[i] = 'crntArea';
		} else {
			ansArea[i] = '';
		}
	}

	for (key in mng.symbolPointer) {
		mng.symbolPointer[key] = 0;
	}
};

var levelUpdate = function() {
	var lcRCnt = ((mng.option.startLevel - 1) * mng.levelUpCount) + mng.rightCount;

	mng.level = Math.floor(lcRCnt / mng.levelUpCount + 1);
};

var next = function() {

	if (canDoInMode('levelUpdate')) {
		levelUpdate();
	}
	if (mng.level > mng.option.finalLevel) {
		return;
	}

	mng.qNo++;

	if (canDoInMode('cpCreate')) {
		cp = cpCreate(mng.level);
	} else {
		cp = cpCreate2();
	}

	createAllBufferSources(source);
	prepare(cp, source);
};

var nextForPass = function() {

	mng.qNo++;

	if (canDoInMode('cpCreate')) {
		cp = cpCreate(mng.level);
	} else {
		cp = cpCreate2();
	}

	createAllBufferSources(source);
	prepare(cp, source);
};

var setRepeatSource = function() {

	createAllBufferSources(repeatSource);
	prepare(repeatCp.cp, repeatSource);

};

function init() {

	mng.qNo = 0;

	if (canDoInMode('cpCreate')) {
		cp = cpCreate(mng.level);
	} else {
		cp = cpCreate2();
	}

	createAllBufferSources(source);
	prepare(cp, source);
}

var createAllBufferSources = function(prmSource) {

	prmSource.chord = [null, null, null, null];
	prmSource.bass = [null, null, null, null];
	prmSource.drum = null;
	prmSource.tens = [null, null, null, null];

	for (var i = 0; i < CP_LEN; i++) {
		prmSource.chord[i] = context.createBufferSource();
	}

	for (var i = 0; i < CP_LEN; i++) {
		prmSource.bass[i] = context.createBufferSource();
	}

	prmSource.drum = context.createBufferSource();

	for (var i = 0; i < CP_LEN; i++) {
		prmSource.tens[i] = context.createBufferSource();
	}
};

var sourceStart = function(prmSource, prmSpeed) {

	var i = 0;

	prmSource.drum.start(context.currentTime);

	for (i = 0; i < CP_LEN; i++) {
		prmSource.chord[i].start(context.currentTime + (i / prmSpeed));
		prmSource.bass[i].start(context.currentTime + (i / prmSpeed));
		if (prmSource.tens[i].buffer) {
			prmSource.tens[i].start(context.currentTime + (i / prmSpeed));
			prmSource.tens[i].stop(context.currentTime + ((i + 1) / prmSpeed));
		}
		prmSource.chord[i].stop(context.currentTime + ((i + 1) / prmSpeed));
		prmSource.bass[i].stop(context.currentTime + ((i + 1) / prmSpeed));
	}

	mng.currentPlayingSource = {};
	for (var key in prmSource) {
		mng.currentPlayingSource[key] = prmSource[key];
	}
};

var sourceStop = function(prmSource) {

	prmSource.drum.stop();
	for (var i = 0; i < CP_LEN; i++) {
		prmSource.chord[i].stop();
		prmSource.bass[i].stop();
		if (prmSource.tens[i].buffer) {
			prmSource.tens[i].stop();
		}
	}
};

var prepare = function(cp, source) {

	var i = 0;

	var chordReq = [null, null, null, null];
	var bassReq = [null, null, null, null];
	var drumReq = null;
	var tensReq = [null, null, null, null];

	var bassVol = context.createGain();
	var tensVol = context.createGain();

	gvSourceConnectCnt = 0;

	bassVol.gain.value = mng.option.bassVol;
	tensVol.gain.value = 0.4;

	for (i = 0; i < CP_LEN; i++) {

		chordReq[i] = new XMLHttpRequest();
		chordReq[i].responseType = 'arraybuffer';
		chordReq[i].open('GET', './sound/chord/'+ cp[i].noteType + '/' + cp[i].filename, true);
		chordReq[i].send('');

		bassReq[i] = new XMLHttpRequest();
		bassReq[i].responseType = 'arraybuffer';
		bassReq[i].open('GET', './sound/bass/' + cp[i].bass.filename, true);
		bassReq[i].send('');

	}

	drumReq = new XMLHttpRequest();
	drumReq.responseType = 'arraybuffer';
	drumReq.open('GET', './sound/drum/drum_1.wav', true);
	drumReq.send('');

	chordReq[0].onreadystatechange = function() {
		if (chordReq[0].readyState === 4) {
			if (chordReq[0].status === 0 || chordReq[0].status === 200) {
				context.decodeAudioData(chordReq[0].response, function(buffer) {
					source.chord[0].buffer = buffer;
					source.chord[0].connect(context.destination);
					source.chord[0].detune.value = cp[0].detune;
					gvSourceConnectCnt++;
				});
			}
		}
	};

	chordReq[1].onreadystatechange = function() {
		if (chordReq[1].readyState === 4) {
			if (chordReq[1].status === 0 || chordReq[1].status === 200) {
				context.decodeAudioData(chordReq[1].response, function(buffer) {
					source.chord[1].buffer = buffer;
					source.chord[1].connect(context.destination);
					source.chord[1].detune.value = cp[1].detune;
					gvSourceConnectCnt++;
				});
			}
		}
	};

	chordReq[2].onreadystatechange = function() {
		if (chordReq[2].readyState === 4) {
			if (chordReq[2].status === 0 || chordReq[2].status === 200) {
				context.decodeAudioData(chordReq[2].response, function(buffer) {
					source.chord[2].buffer = buffer;
					source.chord[2].connect(context.destination);
					source.chord[2].detune.value = cp[2].detune;
					gvSourceConnectCnt++;
				});
			}
		}
	};

	chordReq[3].onreadystatechange = function() {
		if (chordReq[3].readyState === 4) {
			if (chordReq[3].status === 0 || chordReq[3].status === 200) {
				context.decodeAudioData(chordReq[3].response, function(buffer) {
					source.chord[3].buffer = buffer;
					source.chord[3].connect(context.destination);
					source.chord[3].detune.value = cp[3].detune;
					gvSourceConnectCnt++;
				});
			}
		}
	};

	bassReq[0].onreadystatechange = function() {
		if (bassReq[0].readyState === 4) {
			if (bassReq[0].status === 0 || bassReq[0].status === 200) {
				context.decodeAudioData(bassReq[0].response, function(buffer) {
					source.bass[0].buffer = buffer;
					source.bass[0].connect(bassVol);
					bassVol.connect(context.destination);
					source.bass[0].detune.value = cp[0].bass.detune;
					gvSourceConnectCnt++;
				});
			}
		}
	};

	bassReq[1].onreadystatechange = function() {
		if (bassReq[1].readyState === 4) {
			if (bassReq[1].status === 0 || bassReq[1].status === 200) {
				context.decodeAudioData(bassReq[1].response, function(buffer) {
					source.bass[1].buffer = buffer;
					source.bass[1].connect(bassVol);
					bassVol.connect(context.destination);
					source.bass[1].detune.value = cp[1].bass.detune;
					gvSourceConnectCnt++;
				});
			}
		}
	};

	bassReq[2].onreadystatechange = function() {
		if (bassReq[2].readyState === 4) {
			if (bassReq[2].status === 0 || bassReq[2].status === 200) {
				context.decodeAudioData(bassReq[2].response, function(buffer) {
					source.bass[2].buffer = buffer;
					source.bass[2].connect(bassVol);
					bassVol.connect(context.destination);
					source.bass[2].detune.value = cp[2].bass.detune;
					gvSourceConnectCnt++;
				});
			}
		}
	};

	bassReq[3].onreadystatechange = function() {
		if (bassReq[3].readyState === 4) {
			if (bassReq[3].status === 0 || bassReq[3].status === 200) {
				context.decodeAudioData(bassReq[3].response, function(buffer) {
					source.bass[3].buffer = buffer;
					source.bass[3].connect(bassVol);
					bassVol.connect(context.destination);
					source.bass[3].detune.value = cp[3].bass.detune;
					gvSourceConnectCnt++;
				});
			}
		}
	};

	drumReq.onreadystatechange = function() {
		if (drumReq.readyState === 4) {
			if (drumReq.status === 0 || drumReq.status === 200) {
				context.decodeAudioData(drumReq.response, function(buffer) {
					source.drum.buffer = buffer;
					source.drum.connect(context.destination);
					source.drum.playbackRate.value = mng.option.speed;
					gvSourceConnectCnt++;
				});
			}
		}
	};

	if (cp[0].tens.name) {

		tensReq[0] = new XMLHttpRequest();
		tensReq[0].responseType = 'arraybuffer';
		tensReq[0].open('GET', './sound/note/' + cp[0].tens.filename, true);
		tensReq[0].send('');

		tensReq[0].onreadystatechange = function() {
			if (tensReq[0].readyState === 4) {
				if (tensReq[0].status === 0 || tensReq[0].status === 200) {
					context.decodeAudioData(tensReq[0].response, function(buffer) {
						source.tens[0].buffer = buffer;
						source.tens[0].connect(tensVol);
						tensVol.connect(context.destination);
						source.tens[0].detune.value = cp[0].tens.detune;
						gvSourceConnectCnt++;
					});
				}
			}
		};
	} else {
		gvSourceConnectCnt++;
	}

	if (cp[1].tens.name) {

		tensReq[1] = new XMLHttpRequest();
		tensReq[1].responseType = 'arraybuffer';
		tensReq[1].open('GET', './sound/note/' + cp[1].tens.filename, true);
		tensReq[1].send('');

		tensReq[1].onreadystatechange = function() {
			if (tensReq[1].readyState === 4) {
				if (tensReq[1].status === 0 || tensReq[1].status === 200) {
					context.decodeAudioData(tensReq[1].response, function(buffer) {
						source.tens[1].buffer = buffer;
						source.tens[1].connect(tensVol);
						tensVol.connect(context.destination);
						source.tens[1].detune.value = cp[1].tens.detune;
						gvSourceConnectCnt++;
					});
				}
			}
		};
	} else {
		gvSourceConnectCnt++;
	}

	if (cp[2].tens.name) {

		tensReq[2] = new XMLHttpRequest();
		tensReq[2].responseType = 'arraybuffer';
		tensReq[2].open('GET', './sound/note/' + cp[2].tens.filename, true);
		tensReq[2].send('');

		tensReq[2].onreadystatechange = function() {
			if (tensReq[2].readyState === 4) {
				if (tensReq[2].status === 0 || tensReq[2].status === 200) {
					context.decodeAudioData(tensReq[2].response, function(buffer) {
						source.tens[2].buffer = buffer;
						source.tens[2].connect(tensVol);
						tensVol.connect(context.destination);
						source.tens[2].detune.value = cp[2].tens.detune;
						gvSourceConnectCnt++;
					});
				}
			}
		};
	} else {
		gvSourceConnectCnt++;
	}

	if (cp[3].tens.name) {

		tensReq[3] = new XMLHttpRequest();
		tensReq[3].responseType = 'arraybuffer';
		tensReq[3].open('GET', './sound/note/' + cp[3].tens.filename, true);
		tensReq[3].send('');

		tensReq[3].onreadystatechange = function() {
			if (tensReq[3].readyState === 4) {
				if (tensReq[3].status === 0 || tensReq[3].status === 200) {
					context.decodeAudioData(tensReq[3].response, function(buffer) {
						source.tens[3].buffer = buffer;
						source.tens[3].connect(tensVol);
						tensVol.connect(context.destination);
						source.tens[3].detune.value = cp[3].tens.detune;
						gvSourceConnectCnt++;
					});
				}
			}
		};
	} else {
		gvSourceConnectCnt++;
	}
};
