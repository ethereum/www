
$(function() {

  $(".scroll").click(function(event) {
    event.preventDefault();
    //calculate destination place
    var dest = 0;
    if ($(this.hash).offset().top > $(document).height() - $(window).height()) {
      dest = $(document).height() - $(window).height();
    } else {
      dest = $(this.hash).offset().top;
    }
    //go to destination
    console.log(dest);
    $('html,body').animate({
      scrollTop: dest
    }, 400, 'swing');
  });

  $(function() {
    $.scrollUp({
      scrollName: 'scrollUp', // Element ID
      scrollDistance: 300, // Distance from top/bottom before showing element (px)
      scrollFrom: 'top', // 'top' or 'bottom'
      scrollSpeed: 300, // Speed back to top (ms)
      easingType: 'linear', // Scroll to top easing (see http://easings.net/)
      animation: 'fade', // Fade, slide, none
      animationInSpeed: 200, // Animation in speed (ms)
      animationOutSpeed: 200, // Animation out speed (ms)
      scrollText: '<i class="fa fa-fw fa-caret-up fa-2x">', // Text for element, can contain HTML
      scrollTitle: false, // Set a custom <a> title if required. Defaults to scrollText
      scrollImg: false, // Set true to use image
      activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
      zIndex: 2147483647 // Z-Index for the overlay
    });
  });

  $(function() {
    $('#countdown').countdown({
      until: $.countdown.UTCDate(0, new Date(2014, 03 - 1, 01)),
      timezone: 0,
      padZeroes: true,
      layout: '<div class ="timer-wrap-all"><div class="timer-wrap"> <span class="timer-unit">{dnn}</span> <div class="timer-unit-desc">{dl}</div> </div> <div class="timer-wrap"> <span class="timer-unit-sep">:</span> </div> <div class="timer-wrap"> <span class="timer-unit">{hnn}</span> <div class="timer-unit-desc">{hl}</div> </div> <div class="timer-wrap"> <span class="timer-unit-sep">:</span> </div> <div class ="timer-wrap"> <span class="timer-unit">{mnn}</span> <div class="timer-unit-desc">{ml}</div> </div> <div class="timer-wrap"> <span class="timer-unit-sep">:</span> </div> <div class="timer-wrap"> <span class="timer-unit">{snn}</span> <div class="timer-unit-desc">{sl}</div> </div></div>',
    });
  });

  (function(){
    var activeFeatureIndex = 0;
    var updateFeature = function(direction) {
      //direction should be a positive or negative value
      //to indicate how many elements to walk, i.e. 2 for forwards 2, -1 for backwards

      var newActiveFeatureIndex = activeFeatureIndex + direction;

      var children = $('#content-circle').children();
      var maxIndex = children.length - 1;

      // display prev and next button
      var disablePrev = newActiveFeatureIndex <= 0;
      var disableNext = newActiveFeatureIndex >= maxIndex;

      $('#how button.paging.prev').prop('disabled', disablePrev);
      $('#how button.paging.next').prop('disabled', disableNext);

      // display feature
      children.eq(activeFeatureIndex).fadeOut('fast', function() {
        $(this).removeClass('active');
        children.eq(newActiveFeatureIndex).fadeIn('slow', function(){
          $(this).addClass('active');
          activeFeatureIndex = newActiveFeatureIndex;
        });
      });
    };

    $('#content-circle').children().removeClass('active');
    updateFeature(0);

    $('#how button.paging.prev').click(function() {
      updateFeature(-1);
    });
    $('#how button.paging.next').click(function() {
      updateFeature(1);
    });
  }());

  $('#news-slider').liquidSlider({
    autoSlide: false,
    dynamicTabs: true,
    dynamicTabsHtml: true,
    dynamicArrows: false,
    slideEaseDuration: 600,
    autoHeight: true,
    includeTitle: false
  });
  window.api = $.data($('#news-slider')[0], 'liquidSlider');
  $('#who-slider').liquidSlider({
    autoSlide: false,
    dynamicTabs: false,
    dynamicArrows: false,
    slideEaseDuration: 600,
  });
  $('#code-slider').liquidSlider({
    autoSlide: false,
    dynamicTabs: false,
    slideEaseDuration: 600,
    autoHeight: true,
    dynamicArrows: false,
    dynamicArrowsGraphical: false,
    // dynamicArrowLeftText: '<i class="fa fa-angle-left fa-3x" data-liquidslider-ref="#code-slider">',
    // dynamicArrowRightText: '<i class="fa fa-angle-right fa-3x" data-liquidslider-ref="#code-slider">',
    crossLinks: true
  });
  $('#press-slider').liquidSlider({
    autoSlide: false,
    pauseOnHover: true,
    dynamicTabs: false,
    slideEaseDuration: 600,
    autoHeight: true,
    dynamicArrows: false,
    dynamicArrowsGraphical: false,
    // dynamicArrowLeftText: '<i class="fa fa-angle-left fa-3x" data-liquidslider-ref="#code-slider">',
    // dynamicArrowRightText: '<i class="fa fa-angle-right fa-3x" data-liquidslider-ref="#code-slider">',
    crossLinks: true
  });
  $('#media-slider').liquidSlider({
    autoSlide: false,
    dynamicTabs: false,
    slideEaseDuration: 600,
    autoHeight: true,
    dynamicArrows: false,
    dynamicArrowsGraphical: false,
    // dynamicArrowLeftText: '<i class="fa fa-angle-left fa-3x" data-liquidslider-ref="#code-slider">',
    // dynamicArrowRightText: '<i class="fa fa-angle-right fa-3x" data-liquidslider-ref="#code-slider">',
    crossLinks: true
  });
  $('#philosophy-slider').liquidSlider({
    autoSlide: false,
    dynamicTabs: false,
    dynamicArrows: false,
    slideEaseDuration: 600,
    crossLinks: true
  });

  $(".nano").nanoScroller();

  var initPresaleCounters = function(){
    /* UPDATE these constants with real values */
    var ETHER_FOR_BTC = 2000,
        DECREASE_AMOUNT_PER_DAY = 30,
        MIN_ETH_FOR_BTC = 1337.07714935,
        FUNDRAISING_ADDRESS = "36PrZ1KHYMpqSyAQXSG8VwbUiq2EogxLo2",
        SATOSHIS_IN_BTC = 100000000,
        START_DATETIME = "2014-07-22 22:00:00",
        DECREASE_AFTER = 14,
        ENDS_AFTER = 42,
        $qrDepAddr = $("#qr-deposit-address"),
        $purchaseCancel = $("#purchase-cancel"),
        $backToStart = $("#back-to-start"),
        $entropyProgress = $("#entropy-progress"),
        $step41 = $("#step41"),
        $step42 = $("#step42"),
        $downloadLink = $("#downloadLink"),
        $downloadLinkFirst = $("#downloadLinkFirst"),
        // $downloadLinkTemp = $("#downloadLinkTemp"),
        purchaseInputs = {
          $email: $("#purchase-email"),
          $emailRepeat: $("#purchase-email-repeat"),
          $password: $("#password"),
          $passwordRepeat: $("#password-checks")
        },
        $startBtn = $("#start-ether-purchase"),
        $terms = $("#terms-modal"),
        $termsText = $("#terms-text-container"),
        $purchTerms = $("#purchase-modal"),
        $purchTermsText = $("#purchase-text-container"),
        $docs = $("#docs-modal"),
        $docsContainer = $("#docs-container"),
        btcToSend = 1,
        didNotifyRememberPassword = false,
        mainSlider,
        appStepsSlider,
        ethForBtcCalc = 2000,
        nextEthForBtc = ethForBtcCalc - DECREASE_AMOUNT_PER_DAY,
        updateDialsInterval,
        timerConfirmations,
        timeoutTerms,
        $wallet,
        $purchaseForm = $("[name=purchase_form]");

    $(".show-after-end").hide();

    $downloadLink.click(function(e){
      e.preventDefault();
    });

    // $downloadLinkTemp.click(function(e){
    //   e.preventDefault();
    // });

    $downloadLinkFirst.click(function(e){
      e.preventDefault();
    });

    var dhms = function(t){
      var cd = 24 * 60 * 60 * 1000,
          ch = 60 * 60 * 1000,
          cm = 60 * 1000,

          d = Math.floor(t / cd),
          h = Math.floor( (t - d * cd) / ch),
          m = Math.floor( (t - d * cd - h * ch) / cm),
          s = Math.round( (t - d * cd - h * ch - m * cm) / 1000);

      return {
        days: d,
        hours: h,
        minutes: m,
        seconds: s
      };
    };

    var reset = function(){
      purchaseInputs.$email.val("");
      purchaseInputs.$emailRepeat.val("");
      purchaseInputs.$password.val("");
      purchaseInputs.$passwordRepeat.val("");
      appStepsSlider.setNextPanel(0);
      mainSlider.setNextPanel(1);
      didNotifyRememberPassword = false;
      $purchaseCancel.show();
      $purchaseForm.find("input").each(function(){
        $(this).attr("disabled", false);
      });
      $step41.removeClass('hidden');
      $step42.removeClass('hidden').addClass('hidden');
      $entropyProgress.show();
      $(".step-breadcrumbs").attr("data-step", "1");
      clearInterval(timerConfirmations);
      return false;
    };

    $purchaseCancel.click(reset);
    $backToStart.click(reset);
    $('#restartTheProcess').click(reset);

    var resizeTerms = function(){
      $termsText.height($(window).height() - 185);
    };

    var closeTerms = function(){
      $terms.modal("hide");
      $(window).off("resize", resizeTerms);
      $terms.find("[name=confirm-terms]").prop("checked", false);
    };

    $startBtn.click(function(e){
      $terms.modal();
      resizeTerms();
      $(window).on("resize", resizeTerms);
      $termsText.animate({scrollTop: 0}, 1000);
      $terms.find("[name=confirm-terms]").attr("disabled", '');
      $terms.find("[for=confirm-terms]").removeClass("disabled").addClass("disabled");
      return false;
    });

    $("#terms-close").click(function(e){
      closeTerms();
      return false;
    });

    $terms.find(".print").click(function(){
      $termsText.css("overflow", "visible").printArea();
      $termsText.css("overflow", "auto");
      return false;
    });

    $termsText.scroll(function(){
      if($termsText.scrollTop() + $termsText.innerHeight() + 30 > $termsText.prop("scrollHeight")){
        $terms.find("[name=confirm-terms]").attr("disabled", false);
        $terms.find("[for=confirm-terms]").removeClass("disabled");
      }
    });

    $terms.find("[name=confirm-terms]").change(function(){
      if($(this).is(":checked")){
        closeTerms();
        timeoutTerms = setTimeout(showPurchTerms, 500);
      }
    });

    var showPurchTerms = function(){
      clearTimeout(timeoutTerms);
      $purchTerms.modal();
      resizePurchTerms();
      $(window).on("resize", resizePurchTerms);
      $purchTermsText.animate({scrollTop: 0}, 1000);
      $purchTerms.find("[name=confirm-terms]").attr("disabled", '');
      $purchTerms.find("[for=confirm-terms]").removeClass("disabled").addClass("disabled");
    };

    var closePurchTerms = function(){
      $purchTerms.modal("hide");
      $(window).off("resize", resizePurchTerms);
      $purchTerms.find("[name=confirm-purch]").prop("checked", false);
    };

    var resizePurchTerms = function(){
      $purchTermsText.height($(window).height() - 185);
    };

    $("#purch-close").click(function(e){
      closePurchTerms();
      return false;
    });

    $purchTerms.find(".print").click(function(){
      $purchTermsText.css("overflow", "visible").printArea();
      $purchTermsText.css("overflow", "auto");
      return false;
    });

    $purchTermsText.scroll(function(){
      if($purchTermsText.scrollTop() + $purchTermsText.innerHeight() + 30 > $purchTermsText.prop("scrollHeight")){
        $purchTerms.find("[name=confirm-purch]").attr("disabled", false);
        $purchTerms.find("[for=confirm-purch]").removeClass("disabled");
      }
    });

    $purchTerms.find("[name=confirm-purch]").change(function(){
      if($(this).is(":checked")){
        mainSlider.setNextPanel(2);
        closePurchTerms();
      }
    });

    purchaseInputs.$password.focus(function(){
      if(!didNotifyRememberPassword){
        $('#remember-password-modal').modal();
        didNotifyRememberPassword = true;
      }
    });

    var knobDefaults = {
      readOnly: true,
      thickness: 0.05,
      width: 40,
      fgColor: "#333",
      bgColor: "#ddd",
      font: "inherit"
    };
    var startsAt = moment( START_DATETIME ).utc(),
        decreasesAt = moment( START_DATETIME ).utc().add( 'days', DECREASE_AFTER ),
        endsAt = moment( START_DATETIME ).utc().add( 'days', ENDS_AFTER ),
        $saleDurationDials = $(".sale-duration-container"),
        $rateCountdownDials = $(".rate-countdown-container");

    var createKnob = function($el, settings){
      $el.knob(_.extend({}, knobDefaults, settings));
    };


    var setupTimerDials = function($container,maxdays){
      createKnob($container.find(".dial.days"), {max: maxdays });
      createKnob($container.find(".dial.hours"), {max: 24});
      createKnob($container.find(".dial.minutes"), {max: 60});
      createKnob($container.find(".dial.seconds"), {max: 60});
    };

    setupTimerDials($saleDurationDials, dhms( endsAt.diff(startsAt)).days );

    var deltaForTimeTillNextRate = dhms( 1000 * (decreasesAt.unix() - moment().utc().unix()) - moment().zone()*60*1000 ).days;

    setupTimerDials($rateCountdownDials, (deltaForTimeTillNextRate < -22 ? dhms( endsAt.diff(startsAt)).days : deltaForTimeTillNextRate));


    $(".countdown-dials input").css({
      height: "26px",
      "margin-top": "7px",
      "font-size": "18px"
    });

    var updateTimerDial = function($container, type, delta){
      $container.find(".dial." + type).val(delta[type]).change();
    };

    var updateTimerDials = function($container, delta){
      updateTimerDial($container, "days", delta);
      updateTimerDial($container, "hours", delta);
      updateTimerDial($container, "minutes", delta);
      updateTimerDial($container, "seconds", delta);
    };
    var updateAllDials = function(){
      if(endsAt.isAfter(moment().utc()))
      {
        updateTimerDials($saleDurationDials, dhms(1000*(endsAt.unix() - moment().utc().unix()) - moment().zone()*60*1000));

        var delta = dhms(moment().utc().diff(startsAt));
        delta.days = delta.days + 1;
        delta.hours = 24 - delta.hours - 1;
        delta.minutes = 60 - delta.minutes - 1;
        delta.seconds = 60 - delta.seconds;

        if(delta.days > -DECREASE_AFTER)
        {
          ethForBtcCalc = ETHER_FOR_BTC - DECREASE_AMOUNT_PER_DAY * Math.max(delta.days - DECREASE_AFTER, 0);
        }
        else
        {
          ethForBtcCalc = ETHER_FOR_BTC;
        }

        ethForBtcCalc = Math.max(ethForBtcCalc, MIN_ETH_FOR_BTC);

        nextEthForBtc = Math.max(ethForBtcCalc - DECREASE_AMOUNT_PER_DAY, MIN_ETH_FOR_BTC);

        $(".eth-to-btc").text( numeral(ethForBtcCalc).format("0,0") );
        $(".min-eth-to-btc").text( numeral(ethForBtcCalc/100).format("0,0.00") );
        $(".next-eth-to-btc").text( numeral(nextEthForBtc).format("0,0") );
        $(".max-eth-to-buy").text( numeral( MAX_ETH_TO_BUY ).format("0,0") );
        $(".max-btc-to-buy").text( numeral( MAX_ETH_TO_BUY/ethForBtcCalc ).format("0,0.00") );

        if(ethForBtcCalc === MIN_ETH_FOR_BTC)
        {
          updateTimerDials($rateCountdownDials, dhms(1000*(endsAt.unix() - moment().utc().unix()) - moment().zone()*60*1000));
          $('.nextPriceInfo').hide();
        }
        else
        {
          updateTimerDials($rateCountdownDials, delta.days <= DECREASE_AFTER ? dhms(1000*(decreasesAt.unix() - moment().utc().unix()) - moment().zone()*60*1000) : delta);
        }
      }
      else
      {
        $(".hide-after-end").hide();
        $(".show-after-end").show();
        $(".fade-after-end").css('opacity', 0.5);

        clearInterval(updateDialsInterval);
      }
    };

    _.extend(window, {
      ethForBtc: function(btc){
        return Math.round((typeof btc == "number" ? btc : 1) * ethForBtcCalc * 10000) / 10000;
      },
      btcForEth: function(eth){
        return Math.round((typeof eth == "number" ? eth : 1) / ethForBtcCalc * 10000) / 10000;
      }
    });

    var $step4 = $(".step4-content");

    $("#print-purchase-page").click(function(e){
      e.preventDefault();
      $step4.css("width", "100%");
      var $noPrint = $step4.find(".no-print").hide();
      $step4.printArea();
      $noPrint.show();
      $step4.css("width", "20%");
    });

    updateAllDials();

    updateDialsInterval = window.setInterval(function(){
      updateAllDials();
    },1000);


    $.ajax({
      type: "GET",
      url: BLOCKCHAIN_URL + "/q/getreceivedbyaddress/" + FUNDRAISING_ADDRESS + "?cors=true&api_code=" + BLOCKCHAIN_API,
      crossDomain: true,
      success: function( response )
      {
        var btc = Math.round(parseInt(response,10));
        btc = btc/SATOSHIS_IN_BTC*2000;
        $("#total-sold-container .total").text(numeral(btc).format("0,0"));
      },
      error: function( error )
      {
        console.log( "ERROR:", error );
      }
    });




    var $emailConfDial = $("#email-confirmations-dial");

    $emailConfDial.knob({
      readOnly: true,
      thickness: 0.05,
      width: 90,
      fgColor: "#333",
      bgColor: "#ddd",
      font: "inherit",
      max: 3,
      displayInput: false
    });

    $emailConfDial.val("0").change();
    $("#email-dial-shim").text("0/6");

    window.showPasswordValidation = function(){
      $entropyProgress.hide();
      $step41.removeClass('hidden');
      $step42.removeClass('hidden').addClass('hidden');
      appStepsSlider.setNextPanel(2);
      setTimeout(function(){
        $(window).trigger('resize');
      }, 500);
    };

    window.goBackToCredentials = function(){
      appStepsSlider.setNextPanel(0);
      setTimeout(function(){
        $(window).trigger('resize');
      }, 500);
    };

    window.onFormReady = function(){
      appStepsSlider.setNextPanel(1);
      setTimeout(function(){
        $(window).trigger('resize');
      }, 500);
    };

    window.onWalletReady = function(downloadLinkHref, wallet){
      $step41.removeClass('hidden').addClass('hidden');
      $step42.removeClass('hidden');
      $('.butProceedToPurchase').removeClass('disabled').addClass('disabled');
      $(".step-breadcrumbs").attr("data-step", "2");

      $downloadLink.attr("href", downloadLinkHref);
      $downloadLinkFirst.attr("href", downloadLinkHref);
      // $downloadLinkTemp.attr("href", downloadLinkHref);

      $downloadLink.click(saveWallet);
      $downloadLinkFirst.click(saveWallet);
      // $downloadLinkTemp.click(saveWallet);

      $wallet = wallet;

      setTimeout(function(){
        $(window).trigger('resize');
      }, 500);

      setTimeout(function(){
        $(window).trigger('resize');
        $('#presale-counters-slider').animate({height: '300px'});
      }, 1500);
    };

    function saveWallet(e)
    {
      $('.butProceedToPurchase').removeClass('disabled');
      if(typeof InstallTrigger !== 'undefined'){
        e.preventDefault();
        var blob = new Blob([JSON.stringify($wallet)], {type: "text/json"});
        saveAs(blob, 'ethereum-wallet-' + $wallet.ethaddr + '.json');
      }
    }

    window.onDownloadConfirmation = function(){
      if( ! $('.butProceedToPurchase').hasClass('disabled')){
        $purchaseCancel.hide();

        appStepsSlider.setNextPanel(3);
        $(".step-breadcrumbs").attr("data-step", "3");

        $(window).off('beforeunload');
        $(window).on('beforeunload', function(){
          return 'Do you really want to close and leave this page before receiving the full 6 BTC confirmations of your purchase transaction?';
        });

        setTimeout(function(){
          $(window).trigger('resize');
        }, 500);
      }
    };

    // hack to make qr code render (not sure why the original code doesn't work)
    window.showQrCode = function(address, amount){
      $qrDepAddr.empty();
      $qrDepAddr.qrcode({width: 175, height: 175, text: 'bitcoin:' + address + '?amount=' + amount});
    };

    window.onTransactionComplete = function(downloadLinkHref, transactionHash){
      $entropyProgress.hide();
      appStepsSlider.setNextPanel(4);

      clearInterval(timerConfirmations);
      timerConfirmations = startConfirmationsInterval(transactionHash);

      $downloadLink.attr("href", downloadLinkHref);
      setTimeout(function(){
        $(window).trigger('resize');
      }, 500);
    };



    function startConfirmationsInterval(transactionHash){
      return setInterval(function() {
        $.getJSON(BLOCKCHAIN_URL + "/rawtx/" + transactionHash + "?cors=true&api_code=" + BLOCKCHAIN_API + "&format=json", function(data){
          if( data.block_height === undefined ){
            $('.confirmations-dial-shim').text("0/6");
            return false;
          }

          $.get(BLOCKCHAIN_URL + "/q/getblockcount?api_code=" + BLOCKCHAIN_API, function(blockHeight)
          {
            confirmations = blockHeight - data.block_height + 1;

            if(confirmations == 6)
            {
              clearInterval(timerConfirmations);
            }
            $('.confirmations-dial-shim').text(confirmations + "/6");
          });
        });
      }, 20000);
    }

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      $('#start-ether-error').removeClass('hidden');

      if( /webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $('#start-ether-purchase').addClass('disabled');

        $startBtn.off('click');
        $startBtn.click(function(e){
          e.preventDefault();
        });
      }
    }

    var base58checkEncode = function(x,vbyte) {
      vbyte = vbyte || 0;

      var front = [vbyte].concat(Bitcoin.convert.hexToBytes(x));
      var checksum = Bitcoin.Crypto.SHA256(Bitcoin.Crypto.SHA256(front, {asBytes: true}), {asBytes: true})
                          .slice(0,4);
      return Bitcoin.base58.encode(front.concat(checksum));
    };

    var getBalanceByDate = function(value, date)
    {
      var delta = dhms((date - 1406066400)*1000);
      var price = ETHER_FOR_BTC;console.log(delta);console.log(value);

      if(delta.days < 0)
        return 0;

      if(delta.days >= DECREASE_AFTER){
        price = ETHER_FOR_BTC - (delta.days - DECREASE_AFTER + 1) * DECREASE_AMOUNT_PER_DAY;
      }

      price = Math.max(price, MIN_ETH_FOR_BTC);

      var total = value * price;
      console.log(total);
      return value * price;
    };

    $('.check-balance-button').click(function(e){
      e.preventDefault();
      var addr = $('#ethaddressforbalance').val();
      var btcaddr = base58checkEncode(addr, 0);

      $.ajax({
        type: "GET",
        url: BLOCKCHAIN_URL + "/unspent?active=" + btcaddr + "&cors=true&api_code=" + BLOCKCHAIN_API,
        crossDomain: true,
        success: function( json )
        {
          if(json.unspent_outputs[0].tx_index !== undefined)
          {
            $.getJSON(BLOCKCHAIN_URL + "/rawtx/" + json.unspent_outputs[0].tx_index + "?cors=true&api_code=" + BLOCKCHAIN_API + "&format=json", function(data){
              var btc = 0;

              if(data.out[0].addr === FUNDRAISING_ADDRESS)
              {
                btc = (data.out[0].value + 30000)/SATOSHIS_IN_BTC;
                eth = getBalanceByDate(btc, data.time);
                $('#ethaddressforbalance').val('');
                alert("Your ether balance is " + numeral(eth).format("0,0") + " ETH");
              }
              else
              {
                alert("There was a problem fetching your ether balance. Please ensure you have entered the correct ether address");
              }
            });
          }
        },
        error: function( e )
        {
          alert("There was a problem fetching your ether balance. Please ensure you have entered the correct ether address");
        }
      });
    });

    appStepsSlider = $("#app-steps-content").liquidSlider({
      autoSlide: false,
      dynamicTabs: false,
      dynamicArrows: false,
      hideSideArrows: false,
      continuous: false,
      firstPanelToLoad: 1,
      swipe: false,
      slideEaseDuration: 600
    }).data("liquidSlider");

    mainSlider = $('#presale-counters-slider').liquidSlider({
      autoSlide: false,
      dynamicTabs: false,
      dynamicArrows: false,
      hideSideArrows: true,
      slideEaseDuration: 600,
      swipe: false,
      firstPanelToLoad: 2
    }).data("liquidSlider");

    $('.btn-show-charts').on('click', function(){
      $("#fundsChart").empty();

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 250 - margin.top - margin.bottom;

      var parseDate = d3.time.format("%d/%m/%Y %H:%M:%S").parse;

      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.amount); });

      var svg = d3.select("#fundsChart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.json(ETHERSALE_URL + "/chart/" + FUNDRAISING_ADDRESS, function(error, json) {
          var data = json.slice();
          var total = 0;

          console.log(data);

          data.forEach(function(d) {
            d.date = parseDate(d.date);
            total += parseFloat(d.amount);
            d.amount = total;
          });

          console.log(data);

          x.domain(d3.extent(data, function(d) { console.log(d); return d.date; }));
          y.domain(d3.extent(data, function(d) { return d.amount; }));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Funds (BTC)");

          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);
      });
    });

    var resizeDocs = function(){
      $docsContainer.height($(window).height() - 155);
    };

    var closeDocs = function(){
      $docs.modal("hide");
      $(window).off("resize", resizeDocs);
    };

    $('.showDocs').click(function(e){
      e.preventDefault();
      $docs.modal();
      resizeDocs();

      $docsContainer.empty();

      $docsContainer.append('<iframe src="https://docs.google.com/viewer?url=' + encodeURIComponent(SELF_URL + $(this).attr('href')) + '&embedded=true" border="0" width="100%" height="100%"></iframe>');

      $docs.find('a.download').attr('href', $(this).attr('href').replace('-preview', ''));
      $docs.find('a.download').attr('download', $(this).attr('href').replace('-preview', ''));

      $(window).on("resize", resizeDocs);
      return false;
    });

    $docs.find(".close-modal").click(function(e){
      closeDocs();
      return false;
    });
  };

  initPresaleCounters();

  function getYoutubeID(url) {
      var id = url.match("[\\?&]v=([^&#]*)");

      id = id[1];
      return id;
  }

  $('.video-responsive').on('click', function(e)
  {
    e.preventDefault();

    var id = getYoutubeID( $(this).find('a').attr('href') );

    var video_url = "//www.youtube.com/embed/" + id + "?autoplay=1";
    $(this).html('<iframe src="' + video_url + '" frameborder="0" allowfullscreen></iframe>').css('background', 'none');
  });

  $('a.youtube').each(function()
  {
    var id = getYoutubeID( $(this).attr('href') );

    var thumb_url = "/images/videos/" + id + ".jpg";
    $('<img width="100%" src="' + thumb_url + '" />').appendTo( $(this) );
  });
});
