<template>
    <div class="pm-attachment-area">
        <div  id="pm-upload-container">
            <div class="pm-upload-filelist">
                <div class="pm-uploaded-item" v-for="file in files" :key="file.id">
                    <a class="pm-uploaded-img" :href="file.url" target="_blank">
                        <img class="pm-uploaded-file" :src="file.thumb" :alt="file.name">
                    </a> 
                    
                    <a href="#" @click.prevent="deletefile(file.id)" class="button">{{ __( 'Delete File', 'wedevs-project-manager') }}</a>
                        
                </div>
                     
            </div>
            <span> 
                <span v-if="!attr.onlyButton"> {{ __('To attach', 'wedevs-project-manager') }}</span>
                <a v-pm-uploader class="pm-upload-pickfiles"  href="#">
                    {{ attr.buttonText }}
                </a> 
                <span v-if="!attr.onlyButton">{{ __('from your computer.', 'wedevs-project-manager') }}</span>
            </span>
        </div>
    </div>
</template>



<script>
    // Register a global custom directive called v-pm-popup-box
    Vue.directive('pm-uploader', {
        inserted: function (el, binding, vnode) { 
            new PM_Uploader(el, 'pm-upload-container', vnode.context );
        },
    });

    export default {
        props: {
            files: {
                type: Array,
                default: function () {
                    return []
                }
            },
            delete: {
                type: Array,
                default: function () {
                    return []
                }
            },
            single: {
                type: Boolean,
                default: false,
            },
            attr: {
                type: Object,
                default () {
                    return {
                        onlyButton: false,
                        buttonText: __('select files', 'wedevs-project-manager')
                    }
                }
            }
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
            },
            test () {

            }
        }
    }
</script>
