<template>
	<div><textarea :id="editor_id" v-model="content.html"></textarea></div>
</template>

<script>
	
	export default {
	    
	    //mixins: pm_todo_list_mixins( PM_Todo_List.todo_list_text_editor ),    

	    // Get passing data for this component.
	    props: ['editor_id', 'content'],

	    // Initial action for this component
	    created: function() {
	        var self = this;
	        this.$root.$on( 'after_comment', this.afterComment );
	        // After ready dom
	        pm.Vue.nextTick(function() {
	            // Remove the editor
	            tinymce.execCommand( 'mceRemoveEditor', true, self.editor_id );
	            
	            // Instantiate the editor
	            var settings = {
	                selector: 'textarea#' + self.editor_id,
	                menubar: false,
	                placeholder: self.text.write_a_comments,
	                branding: false,
	                
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

	                external_plugins: {
	                    'placeholder' : PM_Vars.assets_url + 'js/tinymce/plugins/placeholder/plugin.min.js',
	                },

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
	                plugins: 'placeholder textcolor colorpicker wplink wordpress',
	                toolbar1: 'shortcodes bold italic strikethrough bullist numlist alignleft aligncenter alignjustify alignright link',
	                toolbar2: 'formatselect forecolor backcolor underline blockquote hr code',
	                toolbar3: 'fontselect fontsizeselect removeformat undo redo',
	            };

	            if (self.tinyMCE_settings) {
	                settings = jQuery.extend(settings, self.tinyMCE_settings);
	            }


	            tinymce.init(settings);
	            
	        });
	       
	        //tinymce.execCommand( 'mceRemoveEditor', true, id );
	        //tinymce.execCommand( 'mceAddEditor', true, id );
	        //tinymce.execCommand( 'mceAddControl', true, id );
	    },

	    methods: {
	        afterComment: function() {
	            tinyMCE.get(this.editor_id).setContent('');
	        }
	    }
	}
</script>