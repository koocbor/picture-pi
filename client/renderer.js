var currentIndex = 0;
var rootServer = 'http://10.0.1.23:8000';
//var rootServer = 'http://127.0.0.1:8000';

$(document).ready(function() {

    loadNewImageWithDelay($('#img0'), 0);
    loadNewImageWithDelay($('#img1'), 1500);

    setInterval(function () {
        if (currentIndex == 0) {
            $('#img0').removeClass('opaque');
            $('#img1').addClass('opaque');
            currentIndex = 1;
            loadNewImageWithDelay($('#img0'), 2000);
            
            $('#img_info').html($('#img1').attr('photodate'));
        } else {
            $('#img1').removeClass('opaque');
            $('#img0').addClass('opaque');
            currentIndex = 0;
            loadNewImageWithDelay($('#img1'), 2000);

            $('#img_info').html($('#img0').attr('photodate'));
        }
    }, 5000);    
});

function loadNewImageWithDelay(imgTarget, delayInMiliseconds) {
    $.getJSON(rootServer + '?' + new Date().getTime(), function(data) {
        var pathEncoded = data.photoPathEncoded;
        setTimeout(function() {
            imgTarget.attr('src', rootServer + '/photo/' + pathEncoded);

            if (data.exifInfo.exif.DateTimeOriginal) {
                imgTarget.attr('photodate', data.exifInfo.exif.DateTimeOriginal);
            } else {
                imgTarget.attr('photodate', null);
            }
        }, delayInMiliseconds)
    });
    
}