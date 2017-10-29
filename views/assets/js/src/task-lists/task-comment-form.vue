<template>
	<form class="pm-comment-form-vue" @submit.prevent="taskCommentAction()">

        <div class="item message pm-sm-col-12 ">
            <text-editor :editor_id="editor_id" :content="content"></text-editor>
        </div>

         <file-uploader :files="files" :delete="deleted_files"></file-uploader>

        <div v-if="hasCoWorker" class="notify-users">
                        
                <h2 class="pm-box-title"> 
                    {{text.notify_user}}           
                    <label class="pm-small-title" for="select-all"> 
                        <input @change.prevent="notify_all_coo_worker()" type="checkbox" v-model="notify_all_co_worker" id="select-all" class="pm-toggle-checkbox"> 
                        {{text.select_all}}
                    </label>
                </h2>
                <ul class="pm-user-list">
                    <li v-for="co_worker in co_workers">
                        <label :for="'pm_notify_' + co_worker.id">
                            <input @change.prevent="notify_coo_workers( co_worker.id )" type="checkbox" v-model="notify_co_workers" name="notify_co_workers[]" :value="co_worker.id" :id="'pm_notify_' + co_worker.id" > 
                            {{ co_worker.name }}
                        </label>
                    </li>

                    <div class="clearfix"></div>
                </ul>
        </div>
        
        <div class="submit">
            <input v-if="!comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  :value="text.add_new_comment" id="" />
            <input v-if="comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  :value="text.update_comment" id="" />
            <span v-show="show_spinner" class="pm-spinner"></span>
        </div>
    </form>
</template>

<script>
	import editor from './../text-editor.vue';
	import uploader from './../file-uploader.vue';

	export default {
		props: ['comment', 'comments'],
		data () {
			return {
				submit_disabled: false,
				show_spinner: false,
				hasCoWorker: false,
				content: {
	                html: typeof this.comment.content == 'undefined' ? '' : this.comment.content,
	            },
	            task_id: this.$route.params.task_id,
	            files: typeof this.comment.files === 'undefined' ? [] : this.comment.files.data,
				deleted_files: []
			}
		},
		components: {
			'text-editor': editor,
			'file-uploader': uploader
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

		computed: {
			/**
	         * Editor ID
	         * 
	         * @return string
	         */
	        editor_id: function() {
	            var comment_id = ( typeof this.comment.id === 'undefined' ) ? '' : '-' + this.comment.id;
	            return 'pm-comment-editor' + comment_id;
	        },
		},
		methods: {

			taskCommentAction () {
	   			// Prevent sending request when multiple click submit button 
              if ( this.submit_disabled ) {
                  return;
              }

	             // Disable submit button for preventing multiple click
	            this.submit_disabled = true;
	            // Showing loading option 
	            this.show_spinner = true;
	            var self = this;

	            var args = {
	            	data: {
	                  commentable_id: self.task_id,
	                  content: self.comment.content,
	                  commentable_type: 'task',
	                  deleted_files: self.deleted_files || [],
	                  files: self.files || [],
	                },
	            }

	            if(typeof this.comment.id !== 'undefined' ){
	            	args.data.id = this.comment.id;
	            	args.callback = function(res){
	            		var index = self.getIndex( self.comments, self.comment.id, 'id' );
		                self.comments.splice(index, 1, res.data);

	            		self.submit_disabled = false;
		          		self.show_spinner = false;
		          		self.files = []; self.deleted_files = [];
	            	}
	            	self.updateComment ( args );
	            }else{

	            	args.callback = function ( res ) {
	            		self.comments.splice(0, 0, res.data);
	            		self.submit_disabled = false;
		          		self.show_spinner = false;
		          		self.files = []; self.deleted_files = [];
	            	}
	            	self.addComment ( args );

	            }
	   		}
		}
	}
</script>
