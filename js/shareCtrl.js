

app.controller('share_ctrl', [
    '$scope', '$window', '$timeout', '$interval', function($scope, $window, $timeout, $interval) {

        $scope.addMajorSymbol = function(altFunc) {
        
            var addSymbolFunc = altFunc || $scope.addSymbol;
            switch(mng.symbolPointer.major) {
                case 0: addSymbolFunc('△');
                    mng.symbolPointer.major = 1;
                    break;
                case 1: addSymbolFunc('△7');
                    mng.symbolPointer.major = 2;
                    break;
                case 2: addSymbolFunc('7');
                    mng.symbolPointer.major = 3;
                    break;
                case 3: addSymbolFunc('6');
                    mng.symbolPointer.major = 0;
                    break;
            };
        };

        $scope.addMinorSymbol = function(altFunc) {
        
            var addSymbolFunc = altFunc || $scope.addSymbol;
            switch(mng.symbolPointer.minor) {
                case 0: addSymbolFunc('m');
                    mng.symbolPointer.minor = 1;
                    break;
                case 1: addSymbolFunc('m7');
                    mng.symbolPointer.minor = 2;
                    break;
                case 2: addSymbolFunc('m6');
                    mng.symbolPointer.minor = 3;
                    break;
                case 3: addSymbolFunc('m△7');
                    mng.symbolPointer.minor = 0;
                    break;
            };
        };

        $scope.addAugSymbol = function(altFunc) {
            
            var addSymbolFunc = altFunc || $scope.addSymbol;
            switch(mng.symbolPointer.aug) {
                case 0: addSymbolFunc('aug');
                    mng.symbolPointer.aug = 1;
                    break;
                case 1: addSymbolFunc('aug7');
                    mng.symbolPointer.aug = 2;
                    break;
                case 2: addSymbolFunc('△7(＃5)');
                    mng.symbolPointer.aug = 0;
                    break;
            };
        };

        $scope.addDimSymbol = function(altFunc) {
            
            var addSymbolFunc = altFunc || $scope.addSymbol;
            switch(mng.symbolPointer.dim) {
                case 0: addSymbolFunc('dim');
                    mng.symbolPointer.dim = 1;
                    break;
                case 1: addSymbolFunc('m7(♭5)');
                    mng.symbolPointer.dim = 2;
                    break;
                case 2: addSymbolFunc('dim7');
                    mng.symbolPointer.dim = 3;
                    break;
                case 3: addSymbolFunc('7(♭5)');
                    mng.symbolPointer.dim = 4;
                    break;
                case 4: addSymbolFunc('△7(♭5)');
                    mng.symbolPointer.dim = 0;
                    break;
            };
        };

        $scope.addSusSymbol = function(altFunc) {
            
            var addSymbolFunc = altFunc || $scope.addSymbol;
            switch(mng.symbolPointer.sus) {
                case 0: addSymbolFunc('sus4');
                    mng.symbolPointer.sus = 1;
                    break;
                case 1: addSymbolFunc('sus2');
                    mng.symbolPointer.sus = 2;
                    break;
                case 2: addSymbolFunc('7sus4');
                    mng.symbolPointer.sus = 0;
                    break;
            };
        };

        $scope.intervalStop = function(){
            $interval.cancel(intervalPromise);
            intervalPromise = null;
        };
    }
]);
