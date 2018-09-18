    var $ = jQuery;
    /**
     * Upload handler helper
     *
     * @param string browse_button ID of the pickfile
     * @param string container ID of the wrapper
     */
    window.PM_Uploader = function (browse_button, container, component) {
        this.container = container;
        this.browse_button = browse_button;
        
        //if no element found on the page, bail out
        if(!$('#'+browse_button).length) {
            return;
        }
        
        this.component = component;

        //instantiate the uploader
        this.uploader = new plupload.Uploader({
            dragdrop: true,
            drop_element: 'pm-upload-container',
            runtimes: 'html5,silverlight,flash,html4',
            browse_button: browse_button,
            container: container,
            multipart: true,
            multipart_params: [],
            multiple_queues: false,
            urlstream_upload: true,
            file_data_name: 'files',
            max_file_size: PM_Vars.plupload.max_file_size,
            url: PM_Vars.plupload.url,
            flash_swf_url: PM_Vars.plupload.flash_swf_url,
            silverlight_xap_url: PM_Vars.plupload.silverlight_xap_url,
            filters: PM_Vars.plupload.filters,
            resize: PM_Vars.plupload.resize,
        });

        //attach event handlers
        this.uploader.bind('Init', $.proxy(this, 'init'));
        this.uploader.bind('FilesAdded', $.proxy(this, 'added'));
        this.uploader.bind('QueueChanged', $.proxy(this, 'upload'));
        // this.uploader.bind('UploadProgress', $.proxy(this, 'progress'));
        // this.uploader.bind('Error', $.proxy(this, 'error'));
        // this.uploader.bind('FileUploaded', $.proxy(this, 'uploaded'));

        this.uploader.init();

    };

    PM_Uploader.prototype = {

        init: function (up, params) {

        },

        added: function (up, files) {

            var $container = $('#' + this.container).find('.pm-upload-filelist');
            self = this;
            
            $.each(files, function(i, file) {
                file.formatSize = plupload.formatSize(file.size);
                let preloader   = new window.FileReader();
                
                preloader.readAsDataURL(file.getNative());

                preloader.onload = function() {
                    
                    file.thumb = preloader.result;
                    self.component.files.push( JSON.parse( JSON.stringify( file ) ) );
                };
            });

            //up.destroy();
        },
        BeforeUpload: function(uploader, file ) {
            
        },

        upload: function (uploader) {
            //console.log(uploader);
           // this.uploader.start();
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
                this.component.files.push(res.data.file);
                //this.component.$emit( 'pm_file_upload_hook', { res: res.data, component: this.component } );
            } else {
                alert(res.error);
            }
        }
    };



