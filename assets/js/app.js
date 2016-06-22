(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// ------------------------------------------

// External Libraries

// ------------------------------------------

jQuery(function ($) {
  $('.slider--testimonials').slick({
    'fade': true,
    'zIndex': 200,
    'prevArrow': '<img src="assets/images/svg/ui-nav-pag.svg"/>',
    'nextArrow': '<img src="assets/images/svg/ui-nav-pag.svg"/>',
    'arrows': true,
    'dots': false,
    'responsive': [{
      'breakpoint': 767,
      'settings': {
        'arrows': false,
        'dots': true
      }
    }]
  });

  /*
    GLOBAL smooth scroll
  */

  $('[href="#anchor--newsletter"]').click(function () {
    $('html, body').animate({
      scrollTop: $(this.hash).offset().top
    }, 1000, 'swing', function () {
      $('.mailform__input--text').focus();
    });
    return false;
  });
});

},{}]},{},[1])


//# sourceMappingURL=maps/app.js.map
