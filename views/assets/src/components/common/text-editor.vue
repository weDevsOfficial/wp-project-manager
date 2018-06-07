<template>
    <textarea :id="editor_id" v-model="content.html"></textarea>
</template>

<script>
    export default {
        
        watch: {
            content: {
                handler (html) {
                    if ( html.html == '' ) {
                        
                        tinymce.get(this.editor_id).setContent(html.html);
                        tinymce.get(this.editor_id).save();
                    }
                    
                },
                deep: true
            }
        },

        // Get passing data for this component.
        props: ['editor_id', 'content'],

        // Initial action for this component
        mounted: function() {
            var self = this;

            if (tinymce.get(this.editor_id)) {
                tinymce.execCommand( 'mceRemoveEditor', false, this.editor_id );
            }

            // Instantiate the editor
            var settings = {
                selector: 'textarea#' + self.editor_id,
                menubar: false,
                placeholder: self.__( 'Write a comment...', 'pm' ),
                branding: false,
                menubar: false,
                setup: function (editor) {
                    editor.on('change', function () {
                        self.content.html = editor.getContent();
                    });
                    editor.on('keyup', function (event) {
                        self.content.html = editor.getContent();
                    });
                    editor.on('NodeChange', function () {
                        self.content.html = editor.getContent();
                    });
                },

                external_plugins: PM_Vars.todo_list_text_editor.external_plugins,
                fontsize_formats: '10px 11px 13px 14px 16px 18px 22px 25px 30px 36px 40px 45px 50px 60px 65px 70px 75px 80px',
                font_formats : 'Arial=arial,helvetica,sans-serif;'+
                    'Comic Sans MS=comic sans ms,sans-serif;'+
                    'Courier New=courier new,courier;'+
                    'Georgia=georgia,palatino;'+
                    'Lucida=Lucida Sans Unicode, Lucida Grande, sans-serif;'+
                    'Tahoma=tahoma,arial,helvetica,sans-serif;'+
                    'Times New Roman=times new roman,times;'+
                    'Trebuchet MS=trebuchet ms,geneva;'+
                    'Verdana=verdana,geneva;',
                plugins: PM_Vars.todo_list_text_editor.plugins,
                toolbar1: 'shortcodes bold italic strikethrough bullist numlist alignleft aligncenter alignjustify alignright link wp_adv',
                toolbar2: 'formatselect forecolor backcolor underline blockquote hr code',
                toolbar3: 'fontselect fontsizeselect removeformat undo redo',
            };

            if (PmProComment) {
                PmProComment.mentions['source'] = self.$store.state.project_users;
                settings = jQuery.extend(settings, PmProComment);
            }

            tinymce.init(settings);
        },
    }
</script>





