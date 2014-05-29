
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

  $('#countdown').countdown({
    until: $.countdown.UTCDate(0, new Date(2014, 03 - 1, 01)),
    timezone: 0,
    padZeroes: true,
    layout: '<div class ="timer-wrap-all"><div class="timer-wrap"> <span class="timer-unit">{dnn}</span> <div class="timer-unit-desc">{dl}</div> </div> <div class="timer-wrap"> <span class="timer-unit-sep">:</span> </div> <div class="timer-wrap"> <span class="timer-unit">{hnn}</span> <div class="timer-unit-desc">{hl}</div> </div> <div class="timer-wrap"> <span class="timer-unit-sep">:</span> </div> <div class ="timer-wrap"> <span class="timer-unit">{mnn}</span> <div class="timer-unit-desc">{ml}</div> </div> <div class="timer-wrap"> <span class="timer-unit-sep">:</span> </div> <div class="timer-wrap"> <span class="timer-unit">{snn}</span> <div class="timer-unit-desc">{sl}</div> </div></div>',
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


  $(".video-responsive").fitVids();
  $('#news-slider').liquidSlider({
    autoSlide: false,
    dynamicTabs: true,
    dynamicTabsHtml: true,
    dynamicArrows: false,
    slideEaseDuration: 600,
    autoHeight: true,
    includeTitle: false
  });
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
  $('#philosophy-slider').liquidSlider({
    autoSlide: false,
    dynamicTabs: false,
    dynamicArrows: false,
    slideEaseDuration: 600,
    crossLinks: true
  });

  var $qrDepAddr = $("#qr-deposit-address"),
      $purchaseCancel = $("#purchase-cancel"),
      $entropyProgress = $("#entropy-progress"),
      $downloadLink = $("#downloadLink");


  $downloadLink.click(function(e){
    e.preventDefault();
  });

  var initPresaleCounters = function(){
    /* UPDATE these constants with real values */
    var ETHER_FOR_BTC=2000,
        FUNDRAISING_ADDRESS="1FfmbHfnpaZjKFvyi1okTjJJusN455paPH",
        SATOSHIS_IN_BTC=100000000,
        START_DATETIME= "2014-12-31 23:59:59",
        END_DATETIME= "2015-01-01 00:00:00",
        appStepsSlider;


    var knobDefaults = {
      readOnly: true,
      thickness: 0.05,
      width: 40,
      fgColor: "#333",
      bgColor: "#ddd",
      font: "inherit"
    };
    var startsAt = moment(START_DATETIME).zone(0),
        endsAt = moment(END_DATETIME).zone(0),
        $saleDurationDials = $(".sale-duration-container"),
        $rateCountdownDials = $(".rate-countdown-container");

    var createKnob = function($el, settings){
      $el.knob(_.extend({}, knobDefaults, settings));
    };
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



    var setupTimerDials = function($container,maxdays){
      createKnob($container.find(".dial.days"), {max: maxdays });
      createKnob($container.find(".dial.hours"), {max: 24});
      createKnob($container.find(".dial.minutes"), {max: 60});
      createKnob($container.find(".dial.seconds"), {max: 60});
    };

    setupTimerDials($saleDurationDials, dhms(endsAt.diff(startsAt)).days);
    setupTimerDials($rateCountdownDials, 0);


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
      if(endsAt.isAfter(moment().zone(0))){
        updateTimerDials($saleDurationDials, dhms(1000*(endsAt.unix() - moment().zone(0).unix())));

        var delta = dhms(moment().zone(0).diff(startsAt));
        delta.hours = 24 - delta.hours - 1;
        delta.minutes = 60 - delta.minutes - 1;
        delta.seconds = 60 - delta.seconds;

        $(".eth-to-btc").text(numeral(Math.round(2000 * (100-delta.days) / 100)).format("0,0"));
        $(".next-eth-to-btc").text(numeral(Math.round(2000 * (99-delta.days) / 100)).format("0,0"));
        delta.days = 0;
        updateTimerDials($rateCountdownDials, delta);
      }else{
        $(".hide-after-end").hide();
      }
    };

    updateAllDials();


    window.setInterval(function(){
      updateAllDials();
    },1000);


    $.get("https://blockchain.info/q/getreceivedbyaddress/" + FUNDRAISING_ADDRESS ,function(received){
      var btc = Math.round(parseInt(received,10)/SATOSHIS_IN_BTC);
      $("#total-sold-container .total").text(numeral(btc).format("0,0"));
    });



    var $confDial = $("#confirmations-dial"),
        confDialInterval,
        confDialVal = 0;

    $confDial.knob({
      readOnly: true,
      thickness: 0.05,
      width: 90,
      fgColor: "#333",
      bgColor: "#ddd",
      font: "inherit",
      displayInput: false
    });



    var spinConfDial = function(){
      if(!confDialInterval) confDialInterval = window.setInterval(function(){
        $confDial.val(confDialVal = (confDialVal + 2) % 102).change();
      },50);
    };

    var stopConfDial = function(){
      window.clearInterval(confDialInterval);
      confDialInterval = 0;
    };


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

    $emailConfDial.val("2").change();
    $("#email-dial-shim").text("2/3");



    window.onWalletReady = function(){
      $entropyProgress.hide();
      appStepsSlider.setNextPanel(1);
      $(".step-breadcrumbs").attr("data-step", "2");
      spinConfDial();
    };



    // hack to make qr code render (not sure why the original code doesn't work)
    window.showQrCode = function(address){
      $qrDepAddr.qrcode({width: 175, height: 175, text: 'bitcoin:' + address});
    };

    window.onTransactionComplete = function(downloadLinkHref){
      $entropyProgress.hide();
      appStepsSlider.setNextPanel(2);
      $(".step-breadcrumbs").attr("data-step", "3");

      $purchaseCancel.hide();

      $downloadLink.attr("href", downloadLinkHref);

      stopConfDial();
    };

    //when nesting sliders, inner ones should be initialised first.
    //fuck knows why...
    appStepsSlider = $("#app-steps-content").liquidSlider({
      autoSlide: false,
      dynamicTabs: false,
      dynamicArrows: false,
      hideSideArrows: false,
      slideEaseDuration: 600
    }).data("liquidSlider");

    $('#presale-counters-slider').liquidSlider({
      autoSlide: false,
      dynamicTabs: false,
      dynamicArrows: false,
      hideSideArrows: true,
      slideEaseDuration: 600,
      firstPanelToLoad: 2 //DEBUG: 3; RELEASE: 2
    });
    //a hack to disable the idiotic css settings liquid-slider defaults to:
    // $("#presale-counters-slider-wrapper, #app-steps-content").css({
    //   "max-width": "100%"
    // });

    //onWalletReady();//DEBUG
    //onTransactionComplete();//DEBUG
  };

  initPresaleCounters();
});
