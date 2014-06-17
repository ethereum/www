
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
    var ETHER_FOR_BTC=2000,
        FUNDRAISING_ADDRESS="1FfmbHfnpaZjKFvyi1okTjJJusN455paPH",
        SATOSHIS_IN_BTC=100000000,
        START_DATETIME= "2014-05-2 00:00:00",
        DECREASE_DATETIME= "2014-05-17 00:00:00",
        END_DATETIME= "2014-07-01 23:59:59",
        $qrDepAddr = $("#qr-deposit-address"),
        $purchaseCancel = $("#purchase-cancel"),
        $backToStart = $("#back-to-start"),
        $entropyProgress = $("#entropy-progress"),
        $downloadLink = $("#downloadLink"),
        purchaseInputs = {
          $email: $("#purchase-email"),
          $emailRepeat: $("#purchase-email-repeat"),
          $password: $("#password"),
          $passwordRepeat: $("#password-checks")
        },
        $startBtn = $("#start-ether-purchase"),
        $terms = $("#terms-modal"),
        $termsText = $("#terms-text-container"),
        btcToSend = 1,
        mainSlider,
        appStepsSlider,
        ethForBtc = 2000,
        nextEthForBtc = ethForBtc - 15,
        timerConfirmations,
        $purchaseForm = $("[name=purchase_form]");

    $downloadLink.click(function(e){
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
      $purchaseCancel.show();
      $purchaseForm.find("input").each(function(){
        $(this).attr("disabled", false);
      });
      $entropyProgress.show();
      $(".step-breadcrumbs").attr("data-step", "1");
      return false;
    };

    $purchaseCancel.click(reset);
    $backToStart.click(reset);

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

    $terms.find(".close-modal").click(function(e){
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
        mainSlider.setNextPanel(2);
        closeTerms();
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
    var startsAt = moment(START_DATETIME).zone(0),
        decreasesAt = moment(DECREASE_DATETIME).zone(0),
        endsAt = moment(END_DATETIME).zone(0),
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

    setupTimerDials($saleDurationDials, dhms(endsAt.diff(startsAt)).days);

    var deltaForTimeTillNextRate = dhms(1000*(decreasesAt.unix() - moment().zone(0).unix())).days;

    setupTimerDials($rateCountdownDials, deltaForTimeTillNextRate);


    $(".countdown-dials input").css({
      height: "26px",
      "margin-top": "7px",
      "font-size": "18px"
    });

    var updateTimerDial = function($container, type, delta){
      $container.find(".dial." + type).val(delta[type]).change();
    };

    var updateTimerDials = function($container, delta){
      // console.log(delta);
      updateTimerDial($container, "days", delta);
      updateTimerDial($container, "hours", delta);
      updateTimerDial($container, "minutes", delta);
      updateTimerDial($container, "seconds", delta);
    };
    var updateAllDials = function(){
      if(endsAt.isAfter(moment().zone(0)))
      {
        updateTimerDials($saleDurationDials, dhms(1000*(endsAt.unix() - moment().zone(0).unix())));

        var delta = dhms(moment().zone(0).diff(decreasesAt));
        delta.hours = 24 - delta.hours - 1;
        delta.minutes = 60 - delta.minutes - 1;
        delta.seconds = 60 - delta.seconds;

        // console.log(delta);

        if(delta.days > -15)
        {
          ethForBtc = ETHER_FOR_BTC - 15 * Math.max(delta.days - 15, 0);
        }
        else
        {
          ethForBtc = ETHER_FOR_BTC;
        }

        nextEthForBtc = ethForBtc - 15;

        $(".eth-to-btc").text( numeral(ethForBtc).format("0,0") );
        $(".next-eth-to-btc").text( numeral(nextEthForBtc).format("0,0") );

        updateTimerDials($rateCountdownDials, delta.days <= 15 ? dhms(1000*(decreasesAt.unix() - moment().zone(0).unix())) : delta);
      }
      else
      {
        $(".hide-after-end").hide();
      }
    };

    _.extend(window, {
      ethForBtc: function(btc){
        return Math.round((typeof btc == "number" ? btc : 1) * ethForBtc * 10000) / 10000;
      },
      btcForEth: function(eth){
        return Math.round((typeof eth == "number" ? eth : 1) / ethForBtc * 10000) / 10000;
      },
      disablePaste: function(id){
        console.log('#' + id + ' aici')
        console.log($('#' + id));
        // console.log($('#' + id).activeElement.val())
        //$('#' + id).context.activeElement.val('');
        $('#' + id).val('');
        $('#' + id).val('');
      }
    });

    var $step3 = $(".step3-content");

    $("#print-purchase-page").click(function(e){
      e.preventDefault();
      $step3.css("width", "100%");
      var $noPrint = $step3.find(".no-print").hide();
      $step3.printArea();
      $noPrint.show();
      $step3.css("width", "20%");
    });

    updateAllDials();

    window.setInterval(function(){
      updateAllDials();
    },1000);


    $.get("https://blockchain.info/q/getreceivedbyaddress/" + FUNDRAISING_ADDRESS ,function(received){
      var btc = Math.round(parseInt(received,10)/SATOSHIS_IN_BTC);
      $("#total-sold-container .total").text(numeral(btc).format("0,0"));
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



    window.onWalletReady = function(){
      $entropyProgress.hide();
      appStepsSlider.setNextPanel(1);
      $(".step-breadcrumbs").attr("data-step", "2");
    };



    // hack to make qr code render (not sure why the original code doesn't work)
    window.showQrCode = function(address, amount){
      $qrDepAddr.empty();
      $qrDepAddr.qrcode({width: 175, height: 175, text: 'bitcoin:' + address + '?amount=' + amount + '&label=Ether%20presale ' + amount + ' BTC'});
    };

    window.onTransactionComplete = function(downloadLinkHref, transactionHash){
      $entropyProgress.hide();
      appStepsSlider.setNextPanel(2);
      $(".step-breadcrumbs").attr("data-step", "3");

      $purchaseCancel.hide();

      console.log(ETHERSALE_URL);

      timerConfirmations = startConfirmationsInterval(transactionHash);

      $downloadLink.attr("href", downloadLinkHref);
    };



    function startConfirmationsInterval(transactionHash){
      return setInterval(function() {
        $.getJSON(ETHERSALE_URL + "/confirmations/" + transactionHash ,function(data){
          if(data == 6)
          {
            clearInterval(timerConfirmations);
          }
          $('.confirmations-dial-shim').text(data + "/6");
        }, 10000);
      });
    }

    appStepsSlider = $("#app-steps-content").liquidSlider({
      autoSlide: false,
      dynamicTabs: false,
      dynamicArrows: false,
      hideSideArrows: false,
      slideEaseDuration: 600
    }).data("liquidSlider");

    mainSlider = $('#presale-counters-slider').liquidSlider({
      autoSlide: false,
      dynamicTabs: false,
      dynamicArrows: false,
      hideSideArrows: true,
      slideEaseDuration: 600,
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
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); });

      var svg = d3.select("#fundsChart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.text(ETHERSALE_URL + "/chart/" + FUNDRAISING_ADDRESS, function(text) {
          var data = d3.csv.parseRows(text).map(function(row) {
            row[1] = parseFloat(row[1]);
            console.log(row);
            return row;
          });

          var total = 0;

          console.log(data);

          data.forEach(function(d) {
            d[0] = parseDate(d[0]);
            total += d[1]
            d[1] = total;
          });

          console.log(data);

          x.domain(d3.extent(data, function(d) { console.log(d); return d[0]; }));
          y.domain(d3.extent(data, function(d) { return d[1]; }));

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
  };

  initPresaleCounters();

  function getYoutubeID(url) {
      var id = url.match("[\\?&]v=([^&#]*)");

      id = id[1];
      return id;
  };

  $('.video-responsive').on('click', function()
  {
    var id = getYoutubeID( $(this).find('a').attr('href') );

    var video_url = "//www.youtube.com/embed/" + id + "?autoplay=1";
    $(this).html('<iframe src="' + video_url + '" frameborder="0" allowfullscreen></iframe>').css('background', 'none');
  });

  $('a.youtube').each(function()
  {
    var id = getYoutubeID( $(this).attr('href') );

    var thumb_url = "/images/videos/" + id + ".jpg";
    $('<img width="100%" src="' + thumb_url + '" />').appendTo( $(this.parentNode) );
  });
});
