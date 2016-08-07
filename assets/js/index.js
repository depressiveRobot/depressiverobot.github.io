// reading time
(function ($) {
  "use strict";
  $(document).ready(function(){
    $(".post-content").fitVids();
    // Calculates Reading Time
    $('.post-content').readingTime({
      readingTimeTarget: '.post-reading-time',
      wordCountTarget: '.post-word-count',
    });
    // Creates Captions from Alt tags
    $(".post-content img").each(function() {
      // Let's put a caption if there is one
      if($(this).attr("alt"))
        $(this).wrap('<figure class="image"></figure>')
      .after('<figcaption>'+$(this).attr("alt")+'</figcaption>');
    });
  });
}(jQuery));

// transformation for article image
(function ($) {
  "use strict";
  $(document).ready(function(){
    var $window = $(window),
    $image = $('.post-image-image');
    $window.on('scroll', function() {
      var top = $window.scrollTop();
      if (top < 0 || top > 1500) { return; }
      $image
      .css('transform', 'translate3d(0px, '+top/3+'px, 0px)')
      .css('opacity', 1-Math.max(top/700, 0));
    });
    $window.trigger('scroll');
    $(function() {
      $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 500);
            return false;
          }
        }
      });
    });
  });
}(jQuery));

// transformation for frontpage image
(function ($) {
  "use strict";
  $(document).ready(function(){
    var $window = $(window),
    $image = $('.teaserimage-image');
    $window.on('scroll', function() {
      var top = $window.scrollTop();
      if (top < 0 || top > 1500) { return; }
      $image
      .css('transform', 'translate3d(0px, '+top/3+'px, 0px)')
      .css('opacity', 1-Math.max(top/700, 0));
    });
    $window.trigger('scroll');
  });
}(jQuery));

// resize article image
(function ($) {
  "use strict";
  function arrangeItems(height) {
    var $teaserImage = $('.teaserimage'),
    $content = $('.post-content'),
    $articleImage = $('.post-image-image'),
    $articleImageContainer = $('.article-image'),
    $postReading = $('.post-reading');

    $teaserImage.height(height * 0.6);
    $articleImage.height(height * 0.6);
    $articleImageContainer.height(height * 0.6);
    if ($articleImageContainer.length) {
      $content.css('padding-top', height * 0.6 + 'px');
    }
    $postReading.css('top', (height * 0.6 - 36) + 'px');
  };
  $(document).ready(function(){
    arrangeItems($(window).height());
    // initial orientation mode
    var $portraitMode = $(window).height() > $(window).width();
    // listen to resize events
    $(window).resize(function() {
      if (isMobile.any) {
        // on mobile only resize when orientation change
        var $currentMode = $(window).height() > $(window).width();
        if($portraitMode != $currentMode){
          // toggle mode
          $portraitMode = $currentMode;
          arrangeItems($(window).height());
        }
      } else {
        arrangeItems($(window).height());
      }
    });
  });
}(jQuery));

// open new tab for all external links
(function ($) {
  "use strict";
  $(document.links).filter(function() {
    return this.hostname != window.location.hostname;
  }).attr('target', '_blank');
}(jQuery));
