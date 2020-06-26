$(document).ready(function () {
    var scroll_pos = 0;
    $("#landing").scroll(function () {
        scroll_pos = $(this).scrollTop();
        if (scroll_pos > 500) {
            $("#landingContent").css('background-color', 'rgba(0,0,0,0.6');
        } else {
            $("#landingContent").css('background-color', 'rgba(255,255,255,0.3)');
        }
    });
});

