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


function resetHeight(){
    // reset the body height to that of the inner browser
    const landing = document.getElementById('landing').style.height = window.innerHeight + "px";
}
// reset the height whenever the window's resized
window.addEventListener("resize", resetHeight);
// called to initially set the height.
resetHeight();
