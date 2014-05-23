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
  $('#press-slider').liquidSlider({
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
    crossLinks: true,
  });


});
