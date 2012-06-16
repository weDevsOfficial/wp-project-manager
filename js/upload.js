jQuery(function($){
    var uploader = new plupload.Uploader(CPM_Vars.plupload);

    uploader.bind('Init', function(up, params) {
        //$('#cpm-upload-filelist').html("<div>Current runtime: " + params.runtime + "</div>");
        });

    $('#cpm-upload-uploadfiles').click(function(e) {
        uploader.start();
        e.preventDefault();
    });

    uploader.init();

    uploader.bind('FilesAdded', function(up, files) {
        $.each(files, function(i, file) {
            $('#cpm-upload-filelist').append(
                '<div id="' + file.id + '">' +
                file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
                '</div>');
        });

        up.refresh(); // Reposition Flash/Silverlight
        uploader.start();
    });

    uploader.bind('UploadProgress', function(up, file) {
        $('#' + file.id + " b").html(file.percent + "%");
    });

    uploader.bind('Error', function(up, err) {
        $('#cpm-upload-filelist').append("<div>Error: " + err.code +
            ", Message: " + err.message +
            (err.file ? ", File: " + err.file.name : "") +
            "</div>"
            );

        up.refresh(); // Reposition Flash/Silverlight
    });

    uploader.bind('FileUploaded', function(up, file, response) {
        //$('#' + file.id + " b").html("100%");
        $('#' + file.id).remove();
        $('#cpm-upload-filelist').append(response.response);
    //console.log(response);
    });
});