<template>
    <div class="pm-attachment-area">
        <div id="pm-upload-container">
            <div class="pm-upload-filelist">
                <div class="pm-uploaded-item" v-for="file in files" :key="file.id">
                    <a :href="file.url" target="_blank">
                        <img :src="file.thumb" :alt="file.name">
                    </a> 
                    
                    <a href="#" @click.prevent="deletefile(file.id)" class="button">Delete File</a>
                        
                </div>
     
                           
            </div>
           To attach, <a id="pm-upload-pickfiles%s" href="#">select files</a> from your computer.
        </div>
    </div>
</template>

<script>
    export default {
        props: ['files'],
        mixins: [PmMixin.projectTaskLists],

        // Initial action for this component
        created: function() {
            this.$on( 'pm_file_upload_hook', this.fileUploaded );

            var self = this;

            // Instantiate file upload, After dom ready
            pm.Vue.nextTick(function() {
                new PM_Uploader('pm-upload-pickfiles', 'pm-upload-container', self );
            });
            
        },

        methods: {
            /**
             * Set the uploaded file 
             * 
             * @param  object file_res 
             * 
             * @return void          
             */
            fileUploaded: function( file_res ) {
                
                if ( typeof this.files == 'undefined' ) {
                    this.files = [];
                }

                this.files.push( file_res.res.file );
            },

            /**
             * Delete file 
             * 
             * @param  object file_id 
             * 
             * @return void          
             */
            deletefile: function(file_id) {
                if ( ! confirm(PM_Vars.message.confirm) ) {
                    return;
                }

                var request_data  = {
                    file_id: file_id,
                    _wpnonce: PM_Vars.nonce,
                },
                self = this;

                wp.ajax.send('pm_delete_file', {
                    data: request_data,
                    success: function(res) {
                       var file_index = self.getIndex( self.files, file_id, 'id' );
                       self.files.splice(file_index,1);
                    }
                });
            }
        }
    }
</script>