;(function($) {

    /**
     * Upload handler helper
     *
     * @param string browse_button ID of the pickfile
     * @param string container ID of the wrapper
     */
    window.CPM_Uploader_Old = function (browse_button, container) {
        this.container = container;
        this.browse_button = browse_button;

        //if no element found on the page, bail out
        if(!$('#'+browse_button).length) {
            return;
        }

        //instantiate the uploader
        this.uploader = new plupload.Uploader({
            runtimes: 'html5,silverlight,flash,html4',
            browse_button: browse_button,
            container: container,
            multipart: true,
            multipart_params: [],
            multiple_queues: false,
            urlstream_upload: true,
            file_data_name: 'cpm_attachment',
            max_file_size: CPM_Vars.plupload.max_file_size,
            url: CPM_Vars.plupload.url_old,
            flash_swf_url: CPM_Vars.plupload.flash_swf_url,
            silverlight_xap_url: CPM_Vars.plupload.silverlight_xap_url,
            filters: CPM_Vars.plupload.filters,
            resize: CPM_Vars.plupload.resize
        });

        //attach event handlers
        this.uploader.bind('Init', $.proxy(this, 'init'));
        this.uploader.bind('FilesAdded', $.proxy(this, 'added'));
        this.uploader.bind('QueueChanged', $.proxy(this, 'upload'));
        this.uploader.bind('UploadProgress', $.proxy(this, 'progress'));
        this.uploader.bind('Error', $.proxy(this, 'error'));
        this.uploader.bind('FileUploaded', $.proxy(this, 'uploaded'));

        this.uploader.init();
    };

    CPM_Uploader_Old.prototype = {

        init: function (up, params) {
        },

        added: function (up, files) {
            var $container = $('#' + this.container).find('.cpm-upload-filelist');

            $.each(files, function(i, file) {
                $container.append(
                    '<div class="upload-item" id="' + file.id + '"><div class="progress"><div class="percent">0%</div><div class="bar"></div></div><div class="filename original">' +
                    file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
                    '</div></div>');
            });

            up.refresh(); // Reposition Flash/Silverlight
            // up.start();
        },

        upload: function (uploader) {
            this.uploader.start();
        },

        progress: function (up, file) {
            var item = $('#' + file.id);

            $('.bar', item).width( (200 * file.loaded) / file.size );
            $('.percent', item).html( file.percent + '%' );
        },

        error: function (up, error) {
            $('#' + this.container).find('#' + error.file.id).remove();
            alert('Error #' + error.code + ': ' + error.message);
        },

        uploaded: function (up, file, response) {
            var res = $.parseJSON(response.response);

            $('#' + file.id + " b").html("100%");
            $('#' + file.id).remove();

            if(res.success) {
                var $container = $('#' + this.container).find('.cpm-upload-filelist');
                $container.append(res.content);
            } else {
                alert(res.error);
            }
        }
    };

    $(function () {
        new CPM_Uploader_Old('cpm-upload-pickfiles', 'cpm-upload-container');
    });
})(jQuery);

