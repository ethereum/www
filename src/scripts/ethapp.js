ETHERSALE_URL = "https://sale.ethereum.org";
BLOCKCHAIN_URL = "https://blockchain.info";
BLOCKCHAIN_API = "5b846ae8-eb56-4c14-aae9-bd13056b6df7";
MAX_ETH_TO_BUY = 1000000;

var ethereum = angular.module('ethereum', ['ngTouch']);

ethereum.config([
  '$compileProvider',
  function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|bitcoin):/);
  }
]);

var lastPassCheckVal,
    lastPassCheckResult;

var isPassInDictionary = function(pass){
  if (lastPassCheckVal === pass) return lastPassCheckResult;
  lastPassCheckVal = pass;

  lastPassCheckResult = (_.indexOf(PASSWORD_DICT, pass, true) !== -1);
  return lastPassCheckResult;
};

var $downloadLink = $("#downloadLink");

ethereum.controller('PurchaseCtrl', ['Purchase', 'DownloadDataURI', '$scope', function(Purchase, DownloadDataURI, $scope) {
  $scope.requiredEntropyLength = 500;
  window.wscope = $scope;
  $scope.didPushTx = false;
  $scope.debug = '(Debug output)';

  $scope.btcToSend = 0;
  $scope.ethToBuy = 0;
  $scope.minAmountOK = false;
  $scope.maxAmountOK = false;

  $scope.email = "";
  $scope.emailValid = false;
  $scope.email_repeat = "";
  $scope.password = "";
  $scope.passwordOK = false;
  $scope.password_repeat =  "";

  $scope.wallet = null;
  $scope.canCollectEntropy = false;
  $scope.collectingEntropy = false;
  $scope.entropy = "";

  $scope.minEthToBuy = window.ethForBtc(1) / 100;
  $scope.maxEthToBuy = MAX_ETH_TO_BUY;
  $scope.maxBtcToEth = window.btcForEth(MAX_ETH_TO_BUY);
  var timerUnspent;

  $scope.updateEthToBuy = function()
  {
    $scope.ethToBuy = window.ethForBtc(parseFloat($scope.btcToSend,10) || 0);
  };

  $scope.updateBtcToSend = function()
  {
    $scope.btcToSend = window.btcForEth(parseFloat($scope.ethToBuy,10) || 0);
  };

  $scope.$watch("email", function(val){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.emailValid = re.test(val);
    return $scope.emailValid;
  });

  $scope.mkQRCode = function(address, amount) {
    (window.showQrCode || function(){})(address, amount);
  };

  $scope.$watch("entropy", function(val){
    var max = $scope.requiredEntropyLength;
    if(val.length <= max) $scope.entropyPercent = (Math.round(100 * val.length / max));
  });

  var authDetailsOK = function(){
    return $scope.minAmountOK && $scope.maxAmountOK && $scope.emailValid && $scope.email_repeat && ($scope.email === $scope.email_repeat) && $scope.passwordOK && ($scope.password === $scope.password_repeat);
  };

  $scope.$watch("[btcToSend,ethToBuy,minAmountOK,maxAmountOK,email,emailValid,email_repeat,password,passwordOK,password_repeat]", function(){
    $scope.canCollectEntropy = (authDetailsOK() && !$scope.wallet);
  },true);

  $scope.nextStep = function(){
    if(authDetailsOK() && !$scope.wallet && $scope.canCollectEntropy)
    {
      window.onFormReady();
      $scope.collectingEntropy = true;
    }
  };

  $scope.verifyPassword = function(){
    if($scope.password === $scope.password_validation){
      doc = JSON.stringify($scope.wallet);

      var downloadLinkEle = angular.element('#downloadLink');
          downloadLinkEle.attr('href', 'data:application/octet-stream;base64,' + Base64.encode(doc));

      (window.onWalletReady || function(){})('data:application/octet-stream;base64,' + Base64.encode(doc), $scope.wallet);
    } else {
      $scope.password_validation_error = "Wrong password";
    }
  };

  $scope.proceedToPayment = function(){
    window.onDownloadConfirmation();
    var data = {
      'email': $scope.email,
      'emailjson': $scope.wallet
    };

    Purchase.sendFirstEmail(data, function(e, r) {
      if (e) {
        $scope.error = e;
        return e;
      }
    });
  };

  $scope.goBackToCredentials = function(){
    $scope.entropy = "";
    $scope.wallet = null;
    $scope.canCollectEntropy = true;
    window.goBackToCredentials();
  };

  window.onmousemove = window.ontouchmove = function(e) {
    // only work when the first steps are done
    if ( ! $scope.canCollectEntropy){
      $scope.entropy = "";
      return;
    }

    // only work if a btcAddress doesn't already exist
    if (!$scope.wallet && $scope.collectingEntropy) {
      e.preventDefault();
      var roundSeed = '' + e.x + e.y + new Date().getTime() + Math.random();

      Bitcoin.Crypto.SHA256(roundSeed, {
        asBytes: true
      }).slice(0, 3).map(function(c) {
        $scope.entropy += 'abcdefghijklmnopqrstuvwxyz234567' [c % 32];

        if (!$scope.$$phase) $scope.$apply();
      });

      if ($scope.entropy.length > $scope.requiredEntropyLength && !$scope.wallet) {
        if (window.crypto) {
            var wcr = window.crypto.getRandomValues(new Uint32Array(100));
            for (var i = 0; i < 100; i++) {
                $scope.entropy += 'abcdefghijklmnopqrstuvwxyz234567' [wcr[i] % 32];
            }
        }
        $scope.collectingEntropy = false;
        $scope.canCollectEntropy = false;
        $scope.wallet = 1;
        // $scope.entropy = 'qwe'; // TODO remove debug;
        // console.log('generating wallet'); // Add loading thingy
        $scope.pwkey = pbkdf2($scope.password);
        // console.log(1);
        $scope.wallet = genwallet($scope.entropy, $scope.pwkey, $scope.email);
        // console.log(2);
        $scope.backup = mkbackup($scope.wallet, $scope.pwkey);
        // console.log(3);
        $scope.mkQRCode($scope.wallet.btcaddr, $scope.btcToSend);

        $scope.debug = 'entropy: ' + $scope.entropy + "\nbtcaddr: " + $scope.wallet.btcaddr;
        if (!$scope.$$phase) $scope.$apply();

        (window.showPasswordValidation || function(){})();
      }
    }
  };

  $scope.$watch("password", function(newV, oldV){
    if(!newV){
      $scope.passChecks = {};
    }else if(oldV !== newV){
      $scope.passChecks = {
        longStr: newV.length > 9,
        bothCase: /[a-z]+/.test(newV) && /[A-Z]+/.test(newV),
        numbers: /[0-9]+/.test(newV),
        symbols: /[!-/:-?{-~!"^_`\[\]@]/g.test(newV), //"
        unique: !isPassInDictionary(newV)
      };

      $scope.passwordOK = _.all($scope.passChecks, _.identity);
    }
  });

  $scope.reset = function(){
    $scope.btcToSend = 0;
    $scope.ethToBuy = 0;
    $scope.minAmountOK = false;
    $scope.maxAmountOK = false;

    $scope.email = "";
    $scope.emailValid = false;
    $scope.email_repeat = "";
    $scope.password = "";
    $scope.passwordOK = false;
    $scope.password_repeat =  "";

    $scope.wallet = null;
    $scope.canCollectEntropy = false;
    $scope.collectingEntropy = false;
    $scope.entropy = "";

    $scope.minEthToBuy = window.ethForBtc(1) / 100;
    $scope.maxEthToBuy = MAX_ETH_TO_BUY;
    $scope.maxBtcToEth = window.btcForEth(MAX_ETH_TO_BUY);

    timerUnspent = startUnspentInterval();
  };

  timerUnspent = startUnspentInterval();

  function startUnspentInterval(){
    return setInterval(function() {

      if (!$scope.wallet || !$scope.wallet.btcaddr) return;
      //$scope.status = 'Connecting...' //need to force drawing of this first time only
      Purchase.getUnspent($scope.wallet.btcaddr, function(e, unspent) {
        if (!$scope.wallet || !$scope.wallet.btcaddr) return;

        if (e || (!e && !unspent)) {
          $scope.status = e || 'Error connecting, please try later.';
          return $scope.status;
        }
        var tx = finalize($scope.wallet, unspent, $scope.pwkey, $scope.btcToSend);
        TX = tx;
        if (!tx) {
          $scope.status = 'Waiting for deposit...';
        } else {
          var data = {
            'tx': tx.serializeHex(),
            'email': $scope.email,
            'emailjson': $scope.wallet
          };
          $scope.didPushTx = true;

          Purchase.sendTx(data, function(e, r) {
            if (e) {
              $scope.error = e;
              return e;
            }
            $scope.pushtxsuccess = true;
            $scope.transactionHash = Bitcoin.convert.bytesToHex(tx.getHash());
            doc = JSON.stringify($scope.wallet);
            $scope.debug = doc;
            clearInterval(timerUnspent);
            $scope.status = 'Transaction complete!\n\nDownload your wallet now then check your email for a backup.';

            (window.onTransactionComplete || function(){})(
              'data:application/octet-stream;base64,' + Base64.encode(doc), Bitcoin.convert.bytesToHex(tx.getHash())
            );
          });
        }
      });
    }, 10000);
  }


  $scope.downloadWallet = function() {
    DownloadDataURI({
      filename: $downloadLink.attr('download'),
      data: $downloadLink.attr('href')
    });
  };
}]);

// allows for form validation based on one element matching another
ethereum.directive('match', ['$parse', function($parse) {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(function() {
        return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || $parse(attrs.match)(scope) === ctrl.$modelValue;
      }, function(currentValue) {
        ctrl.$setValidity('match', currentValue);
      });
    }
  };
}]);

// password meter
ethereum.directive('checkStrength', function() {
  return {
    replace: false,
    restrict: 'EACM',
    scope: {
      model: '=checkStrength'
    },
    link: function(scope, element, attrs) {

      var strength = {
        colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
        // TODO this strenght algorithm needs improvement
        measureStrength: function(p) {
          var _force = 0;
          var _regex = /[$-/:-?{-~!"^_`\[\]]/g; //" (commented quote to fix highlighting in Sublime Text)

          var _lowerLetters = /[a-z]+/.test(p);
          var _upperLetters = /[A-Z]+/.test(p);
          var _numbers = /[0-9]+/.test(p);
          var _symbols = _regex.test(p);

          var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
          var _passedMatches = _flags.map(function(el) {
            return el === true;
          });
          _matches = 0;
          for (var i = 0; i < _passedMatches.length; i++) {
            if (_passedMatches[i])
              _matches += 1;
          }
          _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
          _force += _matches * 10;

          // penality (short password)
          _force = (p.length <= 12) ? Math.min(_force, 10) : _force;

          // penality (poor variety of characters)
          _force = (_matches == 1) ? Math.min(_force, 10) : _force;
          _force = (_matches == 2) ? Math.min(_force, 20) : _force;
          _force = (_matches == 3) ? Math.min(_force, 40) : _force;

          // penalty for idiotism (vulnerable to basic dictionary attack)
          _force = isPassInDictionary(p) ? Math.min(_force, 10) : _force;

          return _force;

        },
        getColor: function(s) {

          var idx = 0;
          if (s <= 10) {
            idx = 0;
          } else if (s <= 20) {
            idx = 1;
          } else if (s <= 30) {
            idx = 2;
          } else if (s <= 40) {
            idx = 3;
          } else {
            idx = 4;
          }

          return {
            idx: idx + 1,
            col: this.colors[idx]
          };

        }
      };

      scope.$watch('model', function(newValue, oldValue) {
        if (!newValue || newValue === '') {
          element.css({
            "display": "none"
          });
        } else {
          var c = strength.getColor(strength.measureStrength(newValue));
          element.css({
            "display": "inline"
          });
          var kids = element.children('li');

          for (var i = 0; i < kids.length; i++) {
            if (i < c.idx)
              kids[i].style.backgroundColor = c.col;
            else
              kids[i].style.backgroundColor = '#777';
          }
        }
      });

    },
    template: '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>'
  };
});

ethereum.directive('numeric', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        text = text || '';
        var val = text.replace(/[^0-9.]/g, '');

        while(val.split(".").length > 2) val = val.replace(".", "");

        if(val !== text) {
          ngModelCtrl.$setViewValue(val);
          ngModelCtrl.$render();
        }
        return val;  // or return Number(transformedInput)
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
});

function isEmpty(value) {
  return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

ethereum.directive('ngMin', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attr, ctrl) {
      scope.$watch(function(){
        var min = scope.$eval(attr.ngMin) || 0;
        return (!isEmpty(ctrl.$viewValue) && parseFloat(ctrl.$viewValue) >= parseFloat(min));
      }, function(currentValue) {
          ctrl.$setValidity('ngMin', currentValue);
          scope.minAmountOK = currentValue;
      });
    }
  };
});

ethereum.directive('ngMax', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attr, ctrl) {
      scope.$watch(function()
      {
        var max = scope.$eval(attr.ngMax) || 0;
        return (!isEmpty(ctrl.$viewValue) && parseFloat(ctrl.$viewValue) <= parseFloat(max));
      }, function(currentValue) {
          ctrl.$setValidity('ngMax', currentValue);
          scope.maxAmountOK = currentValue;
      });
    }
  };
});

ethereum.factory('DownloadDataURI', ['$http', function($http) {

  return function(options) {
    if (!options) {
      return;
    }
    if (!$.isPlainObject(options)) {
      options = {
        data: options
      };
    }
    if (!navigator.userAgent.match(/webkit/i)) {
      return;
    }

    if (!options.filename) {
      options.filename = "download." + options.data.split(",")[0].split(";")[0].substring(5).split("/")[1];
    }

    if (!options.url) {
      (options.url = "/download");
    }

    $form = $('<form method="post" action="' + ETHERSALE_URL + options.url +
              '" style="display:none"' +
              ' class="ng-non-bindable">' +
              '<input type="hidden" name="filename" value="' +
              options.filename + '"/><input type="hidden" name="data" value="' +
              options.data + '"/></form>');
    $form.appendTo($('body')).submit().remove();
  };
}]);


ethereum.factory('Purchase', ['$http', function($http) {
  return {
    getUnspent: function(address, cb) {
      $.ajax({
        type: "GET",
        url: BLOCKCHAIN_URL + "/unspent?cors=true&api_code=" + BLOCKCHAIN_API + "&active=" + address,
        crossDomain: true,
        dataType: "json",
        success: function( response )
        {
          var res = [];
          var conv = Bitcoin.convert;

          console.log(response);

          var unspent = response.unspent_outputs;

          for(var x = 0; x < unspent.length; x++)
          {
            hex = conv.bytesToHex(conv.hexToBytes(unspent[x].tx_hash).reverse());
            res.push({
              "output" : hex + ":" + unspent[x].tx_output_n,
              "value" : unspent[x].value
            });
          }

          cb(null, res);
        },
        error: function( e )
        {
          if(e.status == 500){
            cb(null, []);
          }
          else
          {
            cb(e.status);
          }
        }
      });
    },
    sendTx: function(data, cb) {
      $.ajax({
        type: "POST",
        url: BLOCKCHAIN_URL + "/pushtx?cors=true&api_code=" + BLOCKCHAIN_API,
        data: {'tx' : data.tx},
        crossDomain: true,
        success: function( response )
        {
          $.ajax({
            type: "POST",
            url: ETHERSALE_URL + '/sendmail',
            data: JSON.stringify(data),
            crossDomain: true,
            headers: {
              'Content-Type' : 'application/json'
            },
            success: function(r) {
              console.log(r);
            },
            error: function(e) {
              console.log(e);
            }
          });

          cb(null, response);
        },
        error: function( e )
        {
          cb(e.status);
        }
      });
    },
    sendFirstEmail: function(data) {
      $.ajax({
        type: "POST",
        url: ETHERSALE_URL + '/sendfirstmail',
        data: JSON.stringify(data),
        crossDomain: true,
        headers: {
          'Content-Type' : 'application/json'
        },
        success: function(r) {
          console.log(r);
        },
        error: function(e) {
          console.log(e);
        }
      });
    }
  };
}]);
