
$(document).ready(function () {
    disableImgButtons(); // disabilita caricamento immagini di phpbb

    var API_KEY = "9d73931a6bca7fd08ca78d41617209b7";
    var imagesLoaded = 0;
    var imagesFailed = 0;
    var totalImages = 0;
    var dataResults = [];
    var files;
    var postId = 'message' // for insert bbCode

    $.ajaxSetup({ timeout: 0 }) // no timeout

    // Fa aprire al bottone immagine il popup del caricatore
    $('#format-buttons button[value=Img]').removeAttr('onclick')
    $('#format-buttons button[value=Img]').click(function(){
        document.location.href="#loaderPopup"
    })

    // Al click del bottone immagine
    $('#sendImage').click(function () {
        files = document.querySelector('#images').files;
        totalImages = files.length;
        for (index = 0; index < files.length; index++) {
            var fileName = files[index].name

            send(fileName, index);
        }
    });

    $('#results').on('click', 'button.resendImage', function () {
        imagesFailed -= 1
        var fileName = $(this).attr('fileName')
        var index = $(this).attr('index')
        $('#results div#' + index).next().remove() // hr
        $('#results div#' + index).remove()
        $('#status h3').remove()
        $('#imagesFailed').html(imagesFailed + '/' + totalImages)
        send(fileName, index)
    })

    $('#results').on('click', 'button.insertBBCode', function (e) {
        e.preventDefault()
        var bbCode = $(this).attr('bbcode')
        $('#' + postId).val($('#' + postId).val() + bbCode + '\n')
        alert('Immagine (bbcode) inserita nel post')
    })

    $('#status').on('click', 'button#insertAllBBCode', function (e) {
        e.preventDefault()
        dataResults.forEach(data => {
            $('#' + postId).val($('#' + postId).val() + makeBBCode(data) + '\n')
        })
        alert('Tutte le immagini (bbcode) sono state inserite nel post')
    })

    $('a.close').click(function(){
        $('#'+postId).trigger('focus')
    })

    $('button#resetLoader').click(function (e) {
        e.preventDefault()
        dataResults = []
        imagesFailed = 0
        imagesLoaded = 0
        totalImages = 0
        $('#loader').removeClass('hide')
        $('#status').addClass('hide')
        $('#status .endInfo').remove()
        $('#results').html('')
        $('#resetLoader').addClass('hide')
    })

    function endLoad() {
        $('#imagesLoaded').html(imagesLoaded + '/' + totalImages)
        $('#imagesFailed').html(imagesFailed + '/' + totalImages)
        if (totalImages == imagesLoaded) {
            $('#status').append("<h3 class='endInfo' style='text-align:center'>Caricamento completato!</h3>")
            var message;
            if(totalImages > 1){
                message = 'Inserisci nel post tutte le immagini'
            }
            else{
                message = "Inserisci nel post l'immagine"
            }
            $('#status').append('<div class="endInfo" style="text-align:center"><button id="insertAllBBCode">'+message+'</button></div>')
            $('#resetLoader').removeClass('hide')
        }
        else if (totalImages == (imagesLoaded + imagesFailed)) {
            $('#status').append('<h3 class="endInfo" style="text-align:center">Caricamento completato parzialmente</h3></div>')
            $('#resetLoader').removeClass('hide')
        }
    }

    function makeBBCode(data) {
        if (data.medium !== undefined)
            return "[url=" + data.image.url + "][img=" + data.medium.url + "][/img][/url]"
        else
            return "[url=" + data.image.url + "][img=" + data.image.url + "][/img][/url]"
    }

    function send(fileName, index) {
        $('#status').removeClass('hide')
        $('#imagesLoaded').html(imagesLoaded + '/' + totalImages)
        $('#imagesFailed').html(imagesFailed + '/' + totalImages)
        $('#results').append('<div style="height:80px" id=' + index + '/>')
        $('#results div#' + index).html('<span style="color:blue">In caricamento..</span> immagine "' + fileName + '"')
        $('#results').append('<hr>')
        $('#loader').addClass('hide')

        const reader = new FileReader();
        reader.addEventListener("load", function () {
            // Prepare a form data
            var base64img = reader.result;
            base64img = base64img.replace("data:image/jpeg;base64,", "");
            base64img = base64img.replace("data:image/png;base64,", "");
            base64img = base64img.replace("data:image/gif;base64,", "");
            base64img = base64img.replace("data:image/svg;base64,", "");
            var formData = new FormData();
            formData.append('image', base64img);
            // send image
            $.ajax({
                url: "https://api.imgbb.com/1/upload?key=" + API_KEY,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
            }).done(function (results) {
                var data = results.data
                var bbCode = makeBBCode(data);
                $('#results div#' + index).html(
                    "<img class='thumb' src='" + data.thumb.url + "'></img>" +
                    "Stato: <span style='color:green'> caricata </span>" +
                    "<div>Nome: " + fileName + "</div>" +
                    "<div><b>bbCode:</b>" + bbCode + "</div>" +
                    "<div class='insertBBCodeContainer'><button class='insertBBCode' bbcode='" + bbCode + "'>Inserisci</button></div>")
                imagesLoaded++;
                dataResults.push(data)
                endLoad()
            }).fail(function () {
                $('#results div#' + index).html(
                    'Stato invio immagine "' + fileName + '":<span style="color:red"> errore.</span>' +
                    "<button class='resendImage' fileName='" + fileName + "' index='" + index + "'>Riprova</button>")
                imagesFailed++;
                endLoad()
            })
        })
        reader.readAsDataURL(files[index]);
    }
});

// Disabilita tasti rimg ed img
function disableImgButtons() {
    $('input').each(function (i, v) {
        val = $(v).val();

        if (val == 'rimg' || val == 'Img') {
            v.onclick = '';
        }
    });
}
