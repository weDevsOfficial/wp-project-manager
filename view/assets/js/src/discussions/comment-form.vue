<template>
    
    	<form class="pm-comment-form" @submit.prevent="newSelfComment()">
            <div class="item message pm-sm-col-12">
                <text-editor :editor_id="editor_id" :content="content"></text-editor>
            </div>
            
            <file-uploader :files="files" :delete="deleted_files"></file-uploader>
            <div class="notify-users">
                
                <h2 class="pm-box-title"> 
                    Notify users            
                    <label class="pm-small-title" for="select-all"> 
                        <input type="checkbox" name="select-all" id="select-all" class="pm-toggle-checkbox"> 
                        Select all
                    </label>
                </h2>

                <ul class="pm-user-list">
                    <li>
                        <label for="pm_notify_1">
                            <input type="checkbox" name="notify_user[]" id="pm_notify_1" value="1"> 
                            Admin
                        </label>
                    </li>
                    <div class="clearfix"></div>
                </ul>
            </div>

            <div class="submit">
                <input type="submit" class="button-primary" name="pm_new_comment" value="Add this comment" id="">
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>
        </form>
    
</template>

<script>	
	import editor from './../text-editor.vue';
    import uploader from './../file-uploader.vue';
	
	export default {
		props: ['comment', 'discuss'],
		data () {
            return {
                content: {
                    html: typeof this.comment.content == 'undefined' ? '' : this.comment.content,
                },
                submit_disabled: false,
				show_spinner: false,
                deleted_files: [],
                files: typeof this.comment.files === 'undefined' ? [] : this.comment.files.data,
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
            'file-uploader': uploader
		},

		computed: {
			/**
	         * Editor ID
	         * 
	         * @return string
	         */
	        editor_id: function() {
	            var comment_id = ( typeof this.comment.commentable_id === 'undefined' ) ? '' : '-' + this.comment.commentable_id;
	            return 'pm-comment-editor' + comment_id;
	        },
		},

        methods: {
            newSelfComment () {
                var self = this;
                var comment_id = typeof self.comment.id == 'undefined' ? false : true;

                var args = {
                    content: this.comment.content,
                    commentable_id: this.discuss.id,
                    commentable_type: 'discussion_board',
                    deleted_files: this.deleted_files,
                    files: this.files
                };

                if (comment_id) {
                    args.comment_id = self.comment.id;
                    self.updateComment(args);
                
                } else {
                    self.newComment(args);
                }
            }
        }
	}
	
</script>
