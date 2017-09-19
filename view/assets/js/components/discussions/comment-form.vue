<template>
	<form class="cpm-comment-form" @submit.prevent="newComment()">

        <div class="item message cpm-sm-col-12 ">
            <text-editor :editor_id="editor_id" :content="content"></text-editor>
        </div>

        <div class="cpm-attachment-area">
            <div id="cpm-upload-container-cm" style="position: relative;">
                <div class="cpm-upload-filelist"></div>
                To attach, 
                <a id="cpm-upload-pickfiles-cm" href="#" style="position: relative; z-index: 1;">select files</a> 
                from your computer.    
                <div id="html5_1bpoq08n61p7o669iciir2tmm3_container" class="moxie-shim moxie-shim-html5" style="position: absolute; top: 0px; left: 66px; width: 66px; height: 16px; overflow: hidden; z-index: 0;">
                    <input id="html5_1bpoq08n61p7o669iciir2tmm3" type="file" style="font-size: 999px; opacity: 0; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" multiple="" accept="">
                </div>
            </div>
        </div>

        <div class="notify-users">
            
            <h2 class="cpm-box-title"> 
                Notify users            
                <label class="cpm-small-title" for="select-all"> 
                    <input type="checkbox" name="select-all" id="select-all" class="cpm-toggle-checkbox"> 
                    Select all
                </label>
            </h2>

            <ul class="cpm-user-list">
                <li>
                    <label for="cpm_notify_1">
                        <input type="checkbox" name="notify_user[]" id="cpm_notify_1" value="1"> 
                        Admin
                    </label>
                </li>
                <div class="clearfix"></div>
            </ul>
        </div>

        <div class="submit">
            <input type="submit" class="button-primary" name="cpm_new_comment" value="Add this comment" id="">
        </div>
        <div class="cpm-loading" style="display: none;">Saving...</div>
    </form>
</template>

<script>	
	import editor from './../text-editor.vue';
	
	export default {
		props: ['comment', 'discuss'],
		data () {
            return {
                content: {
                    html: typeof this.comment.content == 'undefined' ? '' : this.comment.content,
                },
                submit_disabled: false,
				show_spinner: false,
            }
        },

        watch: {
            /**
             * Observe onchange comment message
             *
             * @param string new_content 
             * 
             * @type void
             */
            content: {
                handler: function( new_content ) {
                    this.comment.content = new_content.html;
                },

                deep: true
            },
        },

		components: {
			'text-editor': editor,
		},

		computed: {
			/**
	         * Editor ID
	         * 
	         * @return string
	         */
	        editor_id: function() {
	            var comment_id = ( typeof this.comment.commentable_id === 'undefined' ) ? '' : '-' + this.comment.commentable_id;
	            return 'cpm-comment-editor' + comment_id;
	        },
		}
	}
	
</script>
