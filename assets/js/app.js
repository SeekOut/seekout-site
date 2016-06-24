(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _mailform = require('./lib/mailform.js');

var _mailform2 = _interopRequireDefault(_mailform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jQuery(function ($) {
  /*
    Mailchimp Newsletter Submit binding
  */
  var mailform = new _mailform2.default('.mailform', '.newsletter');

  /*
    Carousels
  */
  if (matchMedia) {
    var tsMediaQuery = window.matchMedia("(max-width: 767px)");
    tsMediaQuery.addListener(tsCallback);
    tsCallback(tsMediaQuery);
  }
  function tsCallback(tsMediaQuery) {
    if ($('.slider--testimonials').hasClass('slick-initialized')) $('.slider--testimonials').slick('unslick');
    var slickOptions;
    if (tsMediaQuery.matches) {
      slickOptions = {
        'fade': true,
        'zIndex': 200,
        'arrows': false,
        'dots': true
      };
    } else {
      slickOptions = {
        'fade': true,
        'zIndex': 200,
        'prevArrow': '<img src="assets/images/svg/ui-nav-pag.svg"/>',
        'nextArrow': '<img src="assets/images/svg/ui-nav-pag.svg"/>',
        'arrows': true,
        'dots': true
      };
    }
    $('.slider--testimonials').slick(slickOptions);
  }

  if (matchMedia) {
    var mqPostEventSlider = window.matchMedia("(max-width: 419px)");
    mqPostEventSlider.addListener(postEventSliderCallback);
    postEventSliderCallback(mqPostEventSlider);
  }
  function postEventSliderCallback(mqPostEventSlider) {
    if ($('.slider--post-your-event').hasClass('slick-initialized')) $('.slider--post-your-event').slick('unslick');
    if (mqPostEventSlider.matches) {
      $('.slider--post-your-event').slick({
        'fade': true,
        'zIndex': 200,
        'prevArrow': '<img src="assets/images/svg/ui-nav-pag.svg"/>',
        'nextArrow': '<img src="assets/images/svg/ui-nav-pag--white.svg"/>',
        'arrows': true,
        'dots': false
      });
    }
  }

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

  /*
    Footer social media links
  */
  $(".popup-link").click(function () {
    var window_size = this.getAttribute('data-popup-size');
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,' + window_size);
    return false;
  });
});

},{"./lib/mailform.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mailform = function () {
  function Mailform(el, parentEl) {
    _classCallCheck(this, Mailform);

    this.el = el;
    this.parentEl = parentEl;

    this.init();
  }

  _createClass(Mailform, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var $form = $(this.el);
      if ($form.length > 0) {
        $form.bind('submit', function (event) {
          if (event) event.preventDefault();
          if (_this.isValid($form)) _this.register($form);
        });
      }
    }
  }, {
    key: 'isValid',
    value: function isValid($form) {
      if (!$form.find(this.el + '__hp input').val()) return true;
    }
  }, {
    key: 'register',
    value: function register($form) {
      var _this2 = this;

      this.waitCallback();
      $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action'),
        data: $form.serialize(),
        cache: false,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function error(err) {
          _this2.errorCallback();
        },
        success: function success(data) {
          _this2.successCallback(data);
        }
      });
    }
  }, {
    key: 'waitCallback',
    value: function waitCallback() {
      $(this.el).addClass('is-waiting');
    }
  }, {
    key: 'successCallback',
    value: function successCallback(data) {
      $(this.el).removeClass('is-waiting');
      if (data.result != "success") {
        console.error(data.msg);
        this.errorCallback();
      } else {
        console.log('success.. and success!');
        $(this.el).closest(this.parentEl).addClass('is-success');
      }
    }
  }, {
    key: 'errorCallback',
    value: function errorCallback(err) {
      var _this3 = this;

      // perform error handling
      $(this.el).addClass('is-errored');
      $(this.el).on('click', function () {
        $(_this3.el + '__input--text').val('');
        $(_this3.el).removeClass('is-errored');
        $(_this3.el).off('click');
      });
    }
  }]);

  return Mailform;
}();

exports.default = Mailform;

},{}]},{},[1])


//# sourceMappingURL=maps/app.js.map
