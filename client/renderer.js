var currentIndex = 0;

$(document).ready(function() {

    $('#img1').attr('src', 'http://127.0.0.1:8000?' + new Date().getTime());

    setInterval(function () {
        if (currentIndex == 0) {
            $('#img0').removeClass('opaque');
            $('#img1').addClass('opaque');
            currentIndex = 1;
            loadNewImageWithDelay($('#img0'), 2000);
            
            $('#img_info').html('');
            readExif($('#img1'));
        } else {
            $('#img1').removeClass('opaque');
            $('#img0').addClass('opaque');
            currentIndex = 0;
            loadNewImageWithDelay($('#img1'), 2000);

            $('#img_info').html('');
            readExif($('#img0'));
        }
    }, 5000);    
});

function loadNewImageWithDelay(imgTarget, delayInMiliseconds) {
    setTimeout(function() {
        imgTarget.attr('src', 'http://127.0.0.1:8000?' + new Date().getTime());
    }, delayInMiliseconds)
}