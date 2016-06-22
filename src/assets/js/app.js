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
});