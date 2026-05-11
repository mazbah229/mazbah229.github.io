(function ($) {
  'use strict';

  /*
  |--------------------------------------------------------------------------
  | Template Name: Portm
  | Author: Laralink
  | Version: 1.0.0
  |--------------------------------------------------------------------------
  |--------------------------------------------------------------------------
  | TABLE OF CONTENTS:
  |--------------------------------------------------------------------------
  |
  | 1. Preloader
  | 2. Mobile Menu
  | 3. Sticky Header
  | 4. Dynamic Background
  | 5. Isotop Initialize
  | 6. Modal Video
  | 7. Tabs
  | 8. Counter Animation
  | 9. Progress Bar
  | 10. Cursor Animation
  |
  */

  /*--------------------------------------------------------------
    Scripts initialization
  --------------------------------------------------------------*/
  $.exists = function (selector) {
    return $(selector).length > 0;
  };
  var preloaderStartedAt = Date.now();

  $(window).on('load', function () {
    $(window).trigger('scroll');
    preloader();
    scheduleNonCriticalInit();
  });

  $(function () {
    $(window).trigger('resize');
    mainNav();
    stickyHeader();
    dynamicBackground('.cs_hero[data-src]');
    modalVideo();
    tabs();
    counterInit();
    progressBar();
    window.setTimeout(preloader, 1000);
  });

  $(window).on('scroll', function () {
    counterInit();
  });

  /*--------------------------------------------------------------
    1. Preloader
  --------------------------------------------------------------*/
  function preloader() {
    var $preloader = $('.cs_preloader');
    if (!$preloader.length) {
      return;
    }

    var elapsed = Date.now() - preloaderStartedAt;
    var remaining = Math.max(0, 1000 - elapsed);

    window.setTimeout(function () {
      $preloader.addClass('cs_preloader_hide');
      window.setTimeout(function () {
        $preloader.remove();
      }, 220);
    }, remaining);
  }

  function scheduleNonCriticalInit() {
    var run = function () {
      lazyBackgroundInit();
      isotopInit();
      initWow();
      counterInit();
      initCursor();
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 800 });
    } else {
      window.setTimeout(run, 120);
    }
  }

  /*--------------------------------------------------------------
    2. Mobile Menu
  --------------------------------------------------------------*/
  function mainNav() {
    $('.cs_nav').append('<span class="cs_menu_toggle"><span></span></span>');
    $('.menu-item-has-children').append(
      '<span class="cs_menu_dropdown_toggle"></span>',
    );
    $('.cs_menu_toggle').on('click', function () {
      $(this)
        .toggleClass('cs_toggle_active')
        .siblings('.cs_nav_list')
        .slideToggle();
    });
    $('.cs_menu_dropdown_toggle').on('click', function () {
      $(this).toggleClass('active').siblings('ul').slideToggle();
      $(this).parent().toggleClass('active');
    });
  }

  /*--------------------------------------------------------------
    3. Sticky Header
  --------------------------------------------------------------*/
  function stickyHeader() {
    var $window = $(window);
    var lastScrollTop = 0;
    var $header = $('.cs_sticky_header');
    var headerHeight = $header.outerHeight() + 30;

    $window.scroll(function () {
      var windowTop = $window.scrollTop();

      if (windowTop >= headerHeight) {
        $header.addClass('cs_gescout_sticky');
      } else {
        $header.removeClass('cs_gescout_sticky');
        $header.removeClass('cs_gescout_show');
      }

      if ($header.hasClass('cs_gescout_sticky')) {
        if (windowTop < lastScrollTop) {
          $header.addClass('cs_gescout_show');
        } else {
          $header.removeClass('cs_gescout_show');
        }
      }

      lastScrollTop = windowTop;
    });
  }

  /*--------------------------------------------------------------
    4. Dynamic Background
  --------------------------------------------------------------*/
  function dynamicBackground(selector) {
    $(selector || '[data-src]').each(function () {
      if ($(this).attr('data-bgLoaded')) {
        return;
      }

      var src = $(this).attr('data-src');
      $(this).css({
        'background-image': 'url(' + src + ')',
      });
      $(this).attr('data-bgLoaded', 'true');
    });
  }

  function lazyBackgroundInit() {
    var selector = '[data-src]:not(.cs_hero)';

    if (!('IntersectionObserver' in window)) {
      dynamicBackground(selector);
      return;
    }

    var bgObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          dynamicBackground(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '200px 0px',
      },
    );

    $(selector).each(function () {
      bgObserver.observe(this);
    });
  }

  /*--------------------------------------------------------------
    5. Isotop Initialize
  --------------------------------------------------------------*/
  function isotopInit() {
    if ($.exists('.cs_isotop')) {
      $('.cs_isotop').isotope({
        itemSelector: '.cs_isotop_item',
        transitionDuration: '0.60s',
        percentPosition: true,
        masonry: {
          columnWidth: '.cs_grid_sizer',
        },
      });
      /* Active Class of Portfolio*/
      $('.cs_isotop_filter ul li').on('click', function (event) {
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
        event.preventDefault();
      });
      /*=== Portfolio filtering ===*/
      $('.cs_isotop_filter ul').on('click', 'a', function () {
        var filterElement = $(this).attr('data-filter');
        $('.cs_isotop').isotope({
          filter: filterElement,
        });
      });
    }
  }

  /*--------------------------------------------------------------
    6. Modal Video
  --------------------------------------------------------------*/
  function modalVideo() {
    $(document).on('click', '.cs_video_open', function (e) {
      e.preventDefault();
      var video = $(this).attr('href');
      $('.cs_video_popup_container iframe').attr('src', video);
      $('.cs_video_popup').addClass('active');
    });
    $('.cs_video_popup_close, .cs_video_popup_layer').on('click', function (e) {
      $('.cs_video_popup').removeClass('active');
      $('html').removeClass('overflow_hidden');
      $('.cs_video_popup_container iframe').attr('src', 'about:blank');
      e.preventDefault();
    });
  }

  /*--------------------------------------------------------------
    7. Tabs
  --------------------------------------------------------------*/
  function tabs() {
    $('.cs_tabs .cs_tab_links a').on('click', function (e) {
      var currentAttrValue = $(this).attr('href');
      $('.cs_tabs ' + `[data-id="${currentAttrValue}"]`)
        .fadeIn(400)
        .siblings()
        .hide();
      $(this).parents('li').addClass('active').siblings().removeClass('active');
      isotopInit();
      e.preventDefault();
    });
  }

  /*--------------------------------------------------------------
    8. Counter Animation
  --------------------------------------------------------------*/
  function counterInit() {
    if ($.exists('.odometer')) {
      function winScrollPosition() {
        var scrollPos = $(window).scrollTop(),
          winHeight = $(window).height();
        var scrollPosition = Math.round(scrollPos + winHeight / 1.2);
        return scrollPosition;
      }

      $('.odometer').each(function () {
        var elemOffset = $(this).offset().top;
        if (elemOffset < winScrollPosition()) {
          $(this).html($(this).data('count-to'));
        }
      });
    }
  }

  /*--------------------------------------------------------------
    9. Progress Bar
  --------------------------------------------------------------*/
  function progressBar() {
    $('.cs_progress').each(function () {
      var progressPercentage = $(this).data('progress') + '%';
      $(this).find('.cs_progress_in').css('width', progressPercentage);
    });
  }

  function initWow() {
    if ($.exists('.wow') && typeof WOW !== 'undefined') {
      new WOW().init();
    }
  }

  /*--------------------------------------------------------------
    10. Cursor Animation
  --------------------------------------------------------------*/
  function initCursor() {
    if (
      !window.matchMedia('(pointer:fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof gsap === 'undefined'
    ) {
      return;
    }

    $('body').append('<span class="cs_cursor_lg d"></span>');
    $('body').append('<span class="cs_cursor_sm"></span>');
    $('a, button').on('mouseenter', function () {
      $('.cs_cursor_lg').addClass('opacity-0');
      $('.cs_cursor_sm').addClass('opacity-0');
    });
    $('a, button').on('mouseleave', function () {
      $('.cs_cursor_lg').removeClass('opacity-0');
      $('.cs_cursor_sm').removeClass('opacity-0');
    });
    document.addEventListener('mousemove', cursorMovingAnimation, {
      passive: true,
    });
  }

  function cursorMovingAnimation(event) {
    try {
      const timing = gsap.timeline({
        defaults: {
          x: event.clientX,
          y: event.clientY,
        },
      });

      timing
        .to('.cs_cursor_lg', {
          ease: 'power2.out',
        })
        .to(
          '.cs_cursor_sm',
          {
            ease: 'power2.out',
          },
          '-=0.4',
        );
    } catch (err) {
      console.log(err);
    }
  }
})(jQuery); // End of use strict
