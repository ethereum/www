ETHERSALE_URL = "https://devsale.ethereum.org";
SELF_URL = "https://www.ethereum.org/";
BLOCKCHAIN_URL = "https://blockchain.info";
BLOCKCHAIN_API = "5b846ae8-eb56-4c14-aae9-bd13056b6df7";
MAX_ETH_TO_BUY = 1000000;

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
  $('#code-slider').liquidSlider({
    autoSlide: false,
    dynamicTabs: false,
    slideEaseDuration: 600,
    autoHeight: true,
    dynamicArrows: false,
    dynamicArrowsGraphical: false,
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
    crossLinks: true
  });
  $('#media-slider').liquidSlider({
    autoSlide: false,
    dynamicTabs: false,
    slideEaseDuration: 600,
    autoHeight: true,
    dynamicArrows: false,
    dynamicArrowsGraphical: false,
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

  var initProstsaleCounters = function(){
    var ETHER_FOR_BTC = 2000,
        DECREASE_AMOUNT_PER_DAY = 30,
        MIN_ETH_FOR_BTC = 1337.07714935,
        FUNDRAISING_ADDRESS = "36PrZ1KHYMpqSyAQXSG8VwbUiq2EogxLo2",
        SATOSHIS_IN_BTC = 100000000,
        START_DATETIME = "2014-07-22 22:00:00",
        DECREASE_AFTER = 14,
        ENDS_AFTER = 42,
        $docs = $("#docs-modal"),
        $docsContainer = $("#docs-container"),
        $wallet,
        $recover = {},
        $saleDurationDials = $(".sale-duration-container"),
        $rateCountdownDials = $(".rate-countdown-container");

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
        endsAt = moment( START_DATETIME ).utc().add( 'days', ENDS_AFTER );

    var createKnob = function($el, settings){
      $el.knob(_.extend({}, knobDefaults, settings));
    };

    var setupTimerDials = function($container,maxdays){
      createKnob($container.find(".dial.days"), {max: maxdays });
      createKnob($container.find(".dial.hours"), {max: 24});
      createKnob($container.find(".dial.minutes"), {max: 60});
      createKnob($container.find(".dial.seconds"), {max: 60});
    };

    setupTimerDials($saleDurationDials, 0 );
    setupTimerDials($rateCountdownDials, 0 );

    $(".countdown-dials input").css({
      height: "26px",
      "margin-top": "7px",
      "font-size": "18px"
    });

    $(".hide-after-end").hide();
    $(".show-after-end").show();
    $(".fade-after-end").css('opacity', 0.5);

    var refreshEthSold = function(){
      $.ajax({
        type: "GET",
        url: ETHERSALE_URL + "/getethersold",
        crossDomain: true,
        success: function( response )
        {
          $("#total-sold-container .total").text(numeral(response).format("0,0"));
        },
        error: function( error )
        {
          console.log( "ERROR:", error );
        }
      });
    };

    refreshEthSold();

    //
    // - Redeem lost funds
    //

    $('.open-redeem-modal').on('click', function(e)
    {
      e.preventDefault();

      resetRedeemFields();

      $("#redeem-lost-funds-modal").modal();
    });

    var resetRedeemFields = function()
    {
      $wallet = null;
      $recover = {};

      $('.wallet-uploader').val('');
      $('.wallet-password').val('');
      $('.wallet-exodus').val('');
      $('.wallet-check').prop( "checked", false );

      $('.step1').removeClass('hidden');

      if( ! $('i.fa.fa-lg.fa-circle-o-notch.fa-spin').hasClass('hidden') )
        $('i.fa.fa-lg.fa-circle-o-notch.fa-spin').addClass('hidden');

      if( ! $('.upload-results').hasClass('hidden') )
        $('.upload-results').addClass('hidden');

      if( ! $('.step2').hasClass('hidden') )
        $('.step2').addClass('hidden');

      if( ! $('.wallet-transaction').hasClass('hidden') )
        $('.wallet-transaction').addClass('hidden');

      if( ! $('.wallet-alert').hasClass('hidden') )
        $('.wallet-alert').addClass('hidden');

      if( ! $('.wallet-transfer').hasClass('disabled') )
        $('.wallet-transfer').addClass('disabled');
    };

    var recoverStep1Finished = function(unspent)
    {
      $('i.fa.fa-lg.fa-circle-o-notch.fa-spin').addClass('hidden');

      $('.ethaddr').html($wallet.ethaddr);
      $('.btcaddr').html('<a href="https://blockchain.info/address/' + $wallet.btcaddr + '" target="_blank">' + $wallet.btcaddr + '</a>');
      $('.unspent').html(numeral(unspent/SATOSHIS_IN_BTC).format("0,0.00000000") + " BTC");

      if(unspent > 10000)
      {
        $('.unspent').addClass('text-success');
        $('.upload-results').removeClass('hidden');
        $('.step2').removeClass('hidden');
        $('.step1').addClass('hidden');
      }
      else
      {
        $('.unspent').addClass('text-danger');
        $('.upload-results').removeClass('hidden');
        showWalletErrorMessage('<b>Insufficient funds.</b><br>The intermediate BTC address has to have at least 10000 satoshi in order to transfer the funds');
      }
    };

    $('.wallet-uploader').change(function(evt)
    {
      var f = evt.target.files[0];

      var reader = new FileReader();
      reader.onload = (function(theFile) {
          return function(e)
          {
              $('i.fa.fa-lg.fa-circle-o-notch.fa-spin').removeClass('hidden');

              try
              {
                $wallet = $.parseJSON(e.target.result);
              }
              catch (err)
              {
                resetRedeemFields();
                showWalletErrorMessage('<b>Wallet file not valid.</b><br>Please upload a valid wallet backup.');
                return;
              }

              if($wallet.btcaddr === undefined || $wallet.encseed === undefined || $wallet.ethaddr === undefined)
              {
                resetRedeemFields();
                showWalletErrorMessage('<b>Wallet file not valid.</b><br>Please upload a valid wallet backup.');
                return;
              }
              console.log($wallet);

              $.ajax({
                type: "GET",
                url: BLOCKCHAIN_URL + "/unspent?active=" + $wallet.btcaddr + "&cors=true&api_code=" + BLOCKCHAIN_API,
                crossDomain: true,
                success: function( response )
                {
                  var res = [];
                  var conv = Bitcoin.convert;
                  var total = 0;
                  var unspent = response.unspent_outputs;

                  for(var x = 0; x < unspent.length; x++)
                  {
                    hex = conv.bytesToHex(conv.hexToBytes(unspent[x].tx_hash).reverse());
                    res.push({
                      "output" : hex + ":" + unspent[x].tx_output_n,
                      "value" : unspent[x].value
                    });

                    total = total + unspent[x].value;
                  }

                  $recover.unspent = res;

                  recoverStep1Finished(total);
                },
                error: function( e )
                {
                  if(e.responseText === 'No free outputs to spend')
                  {
                    recoverStep1Finished(0);
                  }
                  else
                  {
                    resetRedeemFields();
                  }
                }
              });
          };
      })(f);

      reader.readAsText(f);
    });

    var showWalletErrorMessage = function(message)
    {
      $('.wallet-alert').removeClass('hidden');
      $('.error-message').html(message);
    };

    var enableWalletTransferButton = function()
    {
      if($('.wallet-password').val().length >= 12 && $('.wallet-exodus').val().length >= 24 && $('.wallet-check').prop('checked')){
        $('.wallet-transfer').removeClass('disabled');
      } else {
        if( ! $('.wallet-transfer').hasClass('disabled') )
          $('.wallet-transfer').addClass('disabled');
      }
      if( ! $('.wallet-alert').hasClass('hidden') )
        $('.wallet-alert').addClass('hidden');
    };

    $('.wallet-password').on('change', enableWalletTransferButton);
    $('.wallet-password').on('keyup', enableWalletTransferButton);
    $('.wallet-exodus').on('change', enableWalletTransferButton);
    $('.wallet-exodus').on('keyup', enableWalletTransferButton);
    $('.wallet-check').on('change', enableWalletTransferButton);

    $('.wallet-transfer').on('click', function(e){
      e.preventDefault();
      if($(this).hasClass('disabled'))
        return false;

      result = recoverFunds($wallet, $recover.unspent, pbkdf2($('.wallet-password').val()), $('.wallet-exodus').val());

      if(!result.success)
      {
        showWalletErrorMessage(result.error);

        return;
      }

      //push the tx
      $recover.tx = result.tx;
      $recover.hash = Bitcoin.convert.bytesToHex($recover.tx.getHash());

      $.ajax({
        type: "POST",
        url: BLOCKCHAIN_URL + "/pushtx?cors=true&api_code=" + BLOCKCHAIN_API,
        data: {'tx' : $recover.tx.serializeHex()},
        crossDomain: true,
        success: function( response )
        {
          console.log(response);

          $('.step2').addClass('hidden');
          $('.wallet-transaction').removeClass('hidden');
          $('.txhash').html('<a href="'+ BLOCKCHAIN_URL +'/tx/' + $recover.hash + '" target="_blank">' + $recover.hash + '</a>');

          if( ! $('.wallet-transfer').hasClass('disabled') )
            $('.wallet-transfer').addClass('disabled');
        },
        error: function( e )
        {
          console.log(e);
        }
      });
    });




    //
    // - Balance checker
    //

    var base58checkEncode = function(x,vbyte) {
      vbyte = vbyte || 0;

      var front = [vbyte].concat(Bitcoin.convert.hexToBytes(x));
      var checksum = Bitcoin.Crypto.SHA256(Bitcoin.Crypto.SHA256(front, {asBytes: true}), {asBytes: true})
                          .slice(0,4);
      return Bitcoin.base58.encode(front.concat(checksum));
    };

    var getBalanceByDate = function(value, date)
    {
      var delta = dhms((date - 1406066400) * 1000);
      var price = ETHER_FOR_BTC;

      if(delta.days < 0)
        return 0;

      if(delta.days >= DECREASE_AFTER){
        price = ETHER_FOR_BTC - (delta.days - DECREASE_AFTER + 1) * DECREASE_AMOUNT_PER_DAY;
      }

      price = Math.max(price, MIN_ETH_FOR_BTC);

      var total = value * price;

      return total;
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
          var totalTx = json.unspent_outputs.length;
          var totalBtc = 0;
          var totalEth = 0;
          var finishedLoading = 0;

          for (var i = 0; i < json.unspent_outputs.length; i++) {
            if(json.unspent_outputs[i].tx_index !== undefined)
            {
              /*jshint -W083 */
              $.getJSON(BLOCKCHAIN_URL + "/rawtx/" + json.unspent_outputs[i].tx_index + "?cors=true&api_code=" + BLOCKCHAIN_API + "&format=json", function(data){
                if(data.out[0].addr === FUNDRAISING_ADDRESS)
                {
                  finishedLoading++;

                  var btc = (data.out[0].value + 30000)/SATOSHIS_IN_BTC;
                  var eth = getBalanceByDate(btc, data.time);

                  totalBtc += btc;
                  totalEth += eth;

                  if(finishedLoading === totalTx)
                  {
                    $('#ethaddressforbalance').val('');
                    alert("Your ether balance is " + numeral(totalEth).format("0,0.00") + " ETH");
                  }
                }
                else
                {
                  alert("There was a problem fetching your ether balance. Please ensure you have entered the correct ether address");
                }
              });
            }
          }
        },
        error: function( e )
        {
          alert("There was a problem fetching your ether balance. Please ensure you have entered the correct ether address");
        }
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

  initProstsaleCounters();

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
