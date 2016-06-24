import Mailform from './lib/mailform.js'

jQuery(function($){
  /*
    Mailchimp Newsletter Submit binding
  */
  let mailform = new Mailform('.mailform', '.newsletter');

  /*
    Carousels
  */
  if (matchMedia) {
    var tsMediaQuery = window.matchMedia("(max-width: 767px)");
    tsMediaQuery.addListener(tsCallback);
    tsCallback(tsMediaQuery);
  }
  function tsCallback(tsMediaQuery) {
    if ($('.slider--testimonials').hasClass('slick-initialized'))
      $('.slider--testimonials').slick('unslick');
    var slickOptions;
    if (tsMediaQuery.matches) {
      slickOptions = {
        'fade': true,
        'zIndex': 200,
        'arrows': false,
        'dots': true
      }
    } else {
      slickOptions = {
        'fade': true,
        'zIndex': 200,
        'prevArrow': '<img src="assets/images/svg/ui-nav-pag.svg"/>',
        'nextArrow': '<img src="assets/images/svg/ui-nav-pag.svg"/>',
        'arrows': true,
        'dots': true
      }
    }
    $('.slider--testimonials').slick(slickOptions);
  }

  if (matchMedia) {
    var mqPostEventSlider = window.matchMedia("(max-width: 619px)");
    mqPostEventSlider.addListener(postEventSliderCallback);
    postEventSliderCallback(mqPostEventSlider);
  }
  function postEventSliderCallback(mqPostEventSlider) {
    if ($('.slider--post-your-event').hasClass('slick-initialized'))
      $('.slider--post-your-event').slick('unslick');
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

  $('[href="#anchor--newsletter"]').click(function() {
    $('html, body').animate({
      scrollTop: $(this.hash).offset().top
    }, 1000, 'swing', function(){
      $('.mailform__input--text').focus();
    });
    return false;
  });

  /*
    Footer social media links
  */
  $(".popup-link").click(function(){
    var window_size = this.getAttribute('data-popup-size');
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,' + window_size);
    return false;
  });

});