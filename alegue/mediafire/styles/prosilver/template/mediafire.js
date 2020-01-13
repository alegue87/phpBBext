/*
MediaFire - caricatore immagini
*/

// window.sessionToken;
// Assegnato in styles/prosilver/template/event/posting_layout_include_panel_body.html

// E' necessaria per inizializzare l'hasher in MFUploader!
// viene passato a MFUploader che a sua volta 
// durante l'inizializzazione dell'hasher glielo passa come _resourcePath
// window.superTemplatePath = '{T_SUPER_TEMPLATE_PATH}' 
// non va con questa nuova versione: utilizzo il path assoluto

$(document).ready(function()
{
    // Rimuove Img e rimg
    disableImgButtons();
    //console.log(window.sessionToken);
    //console.log('init MFuploader');

    // Config Options:
    // oCallbacks.onUpdate
    // oCallbacks.onUploadProgress
    // oCallbacks.onHashProgress
    // oCallbacks.onDuplicateConfirm

    var oCallbacks = 
    {
        onUpdate: function(e, oFile, other)
        { 
            console.log('Uploading file ' + oFile.name + ' stato: ' + oFile.state ) 

            switch (oFile.state)
            {
                case 'complete':
                    
                    console.log('oFile completo:');
                    console.log(oFile);
                    console.log('qk: ' + oFile.quickkey);
                    console.log('hashes: ')
                    console.log(oFile.hashes.full);

                    // Le img per il forum devono avere un larghezza massima di 720 px quindi:

                    // Query al server di conversione immagini ( per recuperare directlink ) 
                    //"http://www.mediafire.com/conversion_server.php?fd56&quickkey=h686zgn6bx3nj7r&doc_type=i&size_id=6"

                    // size_id = 4 = 515 x 386
                    // fd56 sono i primi quattro caratterdi di oFile.hashes.full  

                    sHash = oFile.hashes.full.slice(0, 4);
                    sQuickKey = oFile.quickkey;

                    //http://www.mediafire.com/convkey/[hash]/[quickkey].jpg?size_id=[size_id]
                    // NOTA: è necessario aggiungere '6g' al termine di quickkey altrimenti non funge
                    // ho controllato da pollUpload quickkey è la medesima... 
                    sUrl = 'http://www.mediafire.com/convkey/'+ sHash + '/' + sQuickKey + '6g.jpg?size_id=4' ;
                    console.log(sUrl);

                    $('table#immagini').append(creaLineaImmagine(sUrl));

                    break;

                case 'skip':

                    $('#info').append('<p>Immagine col nome "' + oFile.name + '" è già stata caricata ( saltata )</p>');

                    break;
                        
                case 'duplicate':

                    $('#info').append('<p>Immagine col nome "' + oFile.name + '" è già stata caricata ( doppia ) </p>');

                    break;

                case 'failed':

                    $('#info').append('<p>Fallito caricamento per immagine:  "' + oFile.name + '"</p>');

                    break;

                    // Stati dei file:
                    /*
                        this.FILE_STATE_HASH_QUEUED = 'hash-queue';
                        this.FILE_STATE_HASHING = 'hashing';
                        this.FILE_STATE_HASHED = 'hashed';
                        this.FILE_STATE_UPLOAD_CHECK = 'pre-upload';
                        this.FILE_STATE_UPLOAD_QUEUED = 'upload-queue';
                        this.FILE_STATE_UPLOADING = 'uploading';
                        this.FILE_STATE_VERIFYING = 'verifying';
                        this.FILE_STATE_COMPLETE = 'complete';
                        this.FILE_STATE_DUPLICATE = 'duplicate';
                        this.FILE_STATE_ABORTED = 'aborted';
                        this.FILE_STATE_SKIPPED = 'skipped';
                        this.FILE_STATE_FAILED = 'failed';
                    */
            }
        },
        onUploadProgress: function(e, oFile, bytesUploaded)
        { 
            console.log('Uploaded bytes ' + bytesUploaded + ' for ' + oFile.name)
        },
        onHashProgress: function(e, oFile, bytesHashed)
        {
            console.log('Hashed bytes ' + bytesHashed + ' for ' + oFile.name)
        },
        onDuplicateConfirm: function(){ console.log('presente un file duplicato') }
    }

    // oConfig
        // oConfig.relativePath
        // oConfig.folderkey
        // oConfig.apiUrl
        // oConfig.apiVersion
        // oConfig.uploadUrl
        // oConfig.resourcePath
        // oConfig.concurrentUploads
        // oConfig.retryAttempts
        // oConfig.disableInstantUploads
        // oConfig.actionOnDuplicate
        // oConfig.returnThumbnails (true/false)
        // oConfig.filterByExtension (string or array)
    // 

    var oConfig =
    {
        actionOnDuplicate: 'replace',
        //filterByExtension: 'jpeg,jpg,png,bmp,gif',  // Già il tag input funge da filtro 'image/*' ( vedi sotto )
        resourcePath: 'ext/alegue/mediafire/styles/prosilver/template/mediafire/'
    };
    alert('init mf')
    var uploader = new MFUploader(window.sessionToken, oCallbacks, oConfig);

    $('#caricatore_immagini').change(function(e)
    {
        num = e.target.files.length;

        if ( !confirm('Caricare ' + num + ' ' + ( num > 0 ? 'immagini' : 'immagine') + '?') )
        {
            return;
        }
        else
        {
            $('#info').append('<p>Caricamento immagini avviato: attendere..</p>');
            var files = e.target.files;

            uploader.send(files);
        }
    });

    // Copia incolla automatico del bbcode nel post
    $('body').on('click', '.bbcode > a', function(e)
    {
        e.preventDefault();
        $('#message').val( $('#message').val() + '\n' + $(this).text() );
        alert('Codice inserito nel post');
    });

    // Spedisce l'utente al caricatore immagini
    $('button').click(function(e)
    {
        val = $(this).val()
        if( val  == 'Img' || val == 'rimg' )
        {
            e.preventDefault();
            alert('Utilizza il caricatore immagini ( sotto )');
            return;
        }

    });

});

function creaLineaImmagine(url)
{
    sImg = "<td class='immagine'><img class='immagine' src='" + url + "'></td>";
    sBBCode = "<td class='bbcode'><a href=''>[img]" + url + '[/img]</a></td>';

    return "<tr class='linea_immagine'>" + sImg + sBBCode + '</tr>';
}

// Disabilita tasti rimg ed img
function disableImgButtons()
{
    $('input').each(function(i, v)
    {
        val = $(v).val();

        if( val == 'rimg' || val == 'Img' )
        {
            v.onclick = '';
        }
    });
}
