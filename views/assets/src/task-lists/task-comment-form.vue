<template>
	<form class="pm-comment-form-vue" @submit.prevent="updateComment()">

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
	import editor from './../common/text-editor.vue';
	import uploader from './../common/file-uploader.vue';

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

			updateComment () {
	        	// Exit from this function, If submit button disabled 
		        if ( this.submit_disabled ) {
		            return;
		        }

		         //console.log(new File( [this.files[0].thum], this.files[0].name, { type: 'image/png'} ), this.pfiles[0]);
				var data = new FormData();
				
		        // Disable submit button for preventing multiple click
		        this.submit_disabled = true;
		        // Showing loading option 
		        this.show_spinner = true;


		        var self      = this,
		            is_update = typeof this.comment.id == 'undefined' ? false : true;
		            
	            data.append('content', self.comment.content);
	            data.append('commentable_id', self.task_id);
	            data.append('commentable_type', 'task');
	            
	            
	            this.deleted_files.map(function(del_file) {
	            	data.append('files_to_delete[]', del_file);
	            });
	            

	            this.files.map(function(file) {
	            	if ( typeof file.attachment_id === 'undefined' ) {
	            		var decode = self.dataURLtoFile(file.thumb, file.name);
						data.append( 'files[]', decode );
	            	}
				});
  
		        
		        if (is_update) {
		            var url = self.base_url + '/pm/v2/projects/'+self.project_id+'/comments/'+this.comment.id;
		            var type = 'POST'; 
		        } else {
		            var url = self.base_url + '/pm/v2/projects/'+self.project_id+'/comments';
		            var type = 'POST';
		        }

		        var request_data = {
		            url: url,
		            type: type,
		            data: data,
		            cache: false,
        			contentType: false,
        			processData: false,
		            success (res) {

		                self.addMeta(res.data);
		                self.show_spinner = false;

		                if (is_update) {
		                	var index = self.getIndex( self.comments, self.comment.id, 'id' );
		                	self.comments.splice(index, 1, res.data);
		                } else {
		                	self.comments.splice(0, 0, res.data);
		                }

		                // Display a success toast, with a title
		                pm.Toastr.success(res.data.success);
		           
		                self.submit_disabled = false;
		                //self.showHideTaskCommentForm(false, self.comment);
		            },

		            error (res) {
		                self.show_spinner = false;
		                
		                // Showing error
		                res.data.error.map( function( value, index ) {
		                    pm.Toastr.error(value);
		                });
		                self.submit_disabled = false;
		            }
		        }

		        self.httpRequest(request_data);
	        },

	       	addMeta (comment) {
	        	comment.edit_mode = false;
	        },
		}
	}
</script>
