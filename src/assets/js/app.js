// ------------------------------------------

// External Libraries

// ------------------------------------------

jQuery(function($){
  $('.slider--testimonials').slick({
    'fade': true,
    'zIndex': 200,
    'prevArrow': '<img src="assets/images/svg/ui-nav-pag.svg"/>',
    'nextArrow': '<img src="assets/images/svg/ui-nav-pag.svg"/>',
    'arrows': true,
    'dots': false,
    'responsive': [
      {
        'breakpoint': 767,
        'settings': {
          'arrows': false,
          'dots': true
        }
      }
    ]
  });
});