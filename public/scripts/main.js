$(document).ready(function () {
    var scroll_pos = 0;
    $("#landing").scroll(function () {
        scroll_pos = $(this).scrollTop();
        if (scroll_pos > 300) {
            $("#landingContent").css('background-color', 'rgba(0,0,0,0.6');
        } else {
            $("#landingContent").css('background-color', 'rgba(255,255,255,0.1)');
        }
    });
});

$('#password, #confirm_password').on('keyup', function () {
    if($('#password').val() == '' || $('#confirm_password').val() == '') {
      $('#message').html('')
      $('#emailPassword').prop('disabled', true)
    } else if($('#password').val() === $('#confirm_password').val()){
      $('#message').html('Matching').css('color', 'green');
      $('#emailPassword').prop('disabled', false)
    } else if($('#password').val() != $('#confirm_password').val()){
      $('#message').html('Not Matching').css('color', 'red');
      $('#emailPassword').prop('disabled', true)
    }
  });