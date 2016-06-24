export default class Mailform {
  constructor(el) {
    this.el     = el

    this.init()
  }
  init() {
    var $form = $(this.el);
    if ( $form.length > 0 ) {
      $form.bind('submit', (event) => {
        if (event) event.preventDefault()
        if (this.isValid($form))
          this.register($form)
      });
    }
  }
  isValid($form) {
    if (!$form.find(this.el + '__hp input').val())
      return true
  }
  register($form) {
    this.waitCallback()
    $.ajax({
      type        : $form.attr('method'),
      url         : $form.attr('action'),
      data        : $form.serialize(),
      cache       : false,
      dataType    : 'json',
      contentType : 'application/json; charset=utf-8',
      error       : (err) => {
        this.errorCallback()
      },
      success     : (data) => {
        this.successCallback(data)
      }
    });
  }
  waitCallback() {
    $(this.el).addClass('is-waiting')
  }
  successCallback(data) {
    $(this.el).removeClass('is-waiting')
    if (data.result != "success") {
      console.error(data.msg)
      this.errorCallback()
    } else {
      console.log('success.. and success!')
    }
  }
  errorCallback(err) {
    // perform error handling
    $(this.el).addClass('is-errored')
    $(this.el).on('click', ()=>{
      $(this.el + '__input--text').val('')
      $(this.el).removeClass('is-errored')
    })
  }
}
