<template>
    <div class="pm-attachment-area">
        <div id="pm-upload-container">
            <div class="pm-upload-filelist">
                <div class="pm-uploaded-item" v-for="file in files" :key="file.id">
                    <a :href="file.url" target="_blank">
                        <img :src="file.thumb" :alt="file.name">
                    </a> 
                    
                    <a href="#" @click.prevent="deletefile(file.id)" class="button">{{text.delete_file}}</a>
                        
                </div>
     
                           
            </div>
            <span v-html="text.attach_from_computer"></span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['files', 'delete'],

        // Initial action for this component
        created: function() {
            //this.files = typeof files.data ===

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
                if ( ! confirm( this.text.are_you_sure ) ) {
                    return;
                }
                var self = this;
                var index = self.getIndex(self.files, file_id, 'id');

                if (index !== false) {
                    self.files.splice(index, 1);
                    this.delete.push(file_id);
                }  
            }
        }
    }
</script>