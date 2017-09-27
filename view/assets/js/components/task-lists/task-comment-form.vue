<template>
	<form class="cpm-comment-form-vue" @submit.prevent="updateComment()">

        <div class="item message cpm-sm-col-12 ">
            <text-editor :editor_id="editor_id" :content="content"></text-editor>
        </div>
        
        <!-- <file-uploader :files="files"></file-uploader> -->

        <div v-if="hasCoWorker" class="notify-users">
                        
                <h2 class="cpm-box-title"> 
                    Notify users            
                    <label class="cpm-small-title" for="select-all"> 
                        <input @change.prevent="notify_all_coo_worker()" type="checkbox" v-model="notify_all_co_worker" id="select-all" class="cpm-toggle-checkbox"> 
                        Select all
                    </label>
                </h2>
                <ul class="cpm-user-list">
                    <li v-for="co_worker in co_workers">
                        <label :for="'cpm_notify_' + co_worker.id">
                            <input @change.prevent="notify_coo_workers( co_worker.id )" type="checkbox" v-model="notify_co_workers" name="notify_co_workers[]" :value="co_worker.id" :id="'cpm_notify_' + co_worker.id" > 
                            {{ co_worker.name }}
                        </label>
                    </li>

                    <div class="clearfix"></div>
                </ul>
        </div>
        
        <div class="submit">
            <input v-if="!comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  value="Add New Comment" id="" />
            <input v-if="comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  value="Update Comment" id="" />
            <span v-show="show_spinner" class="cpm-spinner"></span>
        </div>
    </form>
</template>

<script>
	import editor from './../text-editor.vue';

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
			}
		},
		components: {
			'text-editor': editor
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
	            return 'cpm-comment-editor' + comment_id;
	        },
		},
		methods: {

			updateComment () {
	        	// Exit from this function, If submit button disabled 
		        if ( this.submit_disabled ) {
		            return;
		        }
		        
		        // Disable submit button for preventing multiple click
		        this.submit_disabled = true;
		        var self      = this,
		            is_update = typeof self.comment.id == 'undefined' ? false : true,
		            
		            form_data = {
		                content: self.comment.content,
		                commentable_id: self.task_id,
		                commentable_type: 'task',
		            };
		        
		        // Showing loading option 
		        this.show_spinner = true;

		        if (is_update) {
		            var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/comments/'+this.comment.id;
		            var type = 'PUT'; 
		        } else {
		            var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/comments';
		            var type = 'POST';
		        }

		        var request_data = {
		            url: url,
		            type: type,
		            data: form_data,
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
		                toastr.success(res.data.success);
		           
		                self.submit_disabled = false;
		              

		                //self.showHideTaskCommentForm(false, self.comment);
		            },

		            error (res) {
		                self.show_spinner = false;
		                
		                // Showing error
		                res.data.error.map( function( value, index ) {
		                    toastr.error(value);
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
