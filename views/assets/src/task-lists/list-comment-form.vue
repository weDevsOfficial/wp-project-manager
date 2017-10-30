<template>
	<div class="pm-comment-form">

		<form class="pm-comment-form-vue" @submit.prevent="listCommentAction()">

	        <div class="item message pm-sm-col-1">
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
	                    <li v-for="co_worker in co_workers" :key="co_worker.id">
	                        <label :for="'pm_notify_' + co_worker.id">
	                            <input @change.prevent="notify_coo_workers( co_worker.id )" type="checkbox" v-model="notify_co_workers" name="notify_co_workers[]" :value="co_worker.id" :id="'pm_notify_' + co_worker.id" > 
	                            {{ co_worker.name }}
	                        </label>
	                    </li>

	                    <div class="clearfix"></div>
	                </ul>
	        </div>
	        
	        <div class="submit">
	            <input v-if="!comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  value="Add New Comment" id="" />
	            <input v-if="comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  value="Update Comment" id="" />
	            <span v-show="show_spinner" class="pm-spinner"></span>
	        </div>
	    </form>
	</div>
</template>

<script>
	import editor from './../common/text-editor.vue';
	import file_uploader from './../common/file-uploader.vue';

	export default {
	    // Get passing data for this component. 
	    props: ['comment', 'list'],

	    /**
	     * Initial data for this component
	     * 
	     * @return obj
	     */
	    data: function() {
	        return {
	            files: typeof this.comment.files === 'undefined' ? [] : this.comment.files.data,
				deleted_files: [],
	            content: {
	                html: typeof this.comment.content === 'undefined' ? '' : this.comment.content,
	            },
	            notify_co_workers: [],
	            notify_all_co_worker: false,
	            show_spinner: false,
	            submit_disabled: false,
	            list_id: this.$route.params.list_id
	        }
	    },

	    /**
	     * Observe onchange value
	     */
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
	    	'file-uploader': file_uploader
	    },

	    /**
	     * Unassigned varable value
	     */
	    computed: {
	        /**
	         * Editor ID
	         * 
	         * @return string
	         */
	        editor_id: function() {
	            var comment_id = ( typeof this.comment.id == 'undefined' ) ? 
	                '' : '-' + this.comment.id;
	            return 'pm-list-editor' + comment_id;
	        },

	        /**
	         * Get current projects co-worker
	         * 
	         * @return object
	         */
	        co_workers: function() {
	            return this.get_porject_users_by_role('co_worker');
	        },

	        /**
	         * Check has co-worker in project or not
	         * 
	         * @return boolean
	         */
	        hasCoWorker: function() {
	            var co_worker = this.get_porject_users_by_role('co_worker');

	            if (co_worker.length) {
	                return true;
	            }

	            return false;
	        }
	    },

	    methods: {
	        /**
	         * Insert and update todo-list comment
	         * 
	         * @return void
	         */    
	   		listCommentAction () {
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
	                  commentable_id: self.list_id,
	                  content: self.comment.content,
	                  commentable_type: 'task_list',
	                  deleted_files: self.deleted_files || [],
	                  files: self.files || [],
	                },
	            }

	            if(typeof this.comment.id !== 'undefined' ){
	            	args.data.id = this.comment.id;
	            	args.callback = function(res){
	            		self.$store.commit('listUpdateComment', {
                    		list_id: self.list_id,
                    		comment_id: self.comment.id,
                    		comment: res.data
                    	});
	            		self.submit_disabled = false;
		          		self.show_spinner = false;
		          		self.files = []; self.deleted_files = [];
	            	}
	            	self.updateComment ( args );
	            }else{

	            	args.callback = function ( res ) {
	            		self.$store.commit('listNewComment', {
                    		list_id: self.list_id,
                    		comment: res.data
                    	});
	            		self.submit_disabled = false;
		          		self.show_spinner = false;
		          		self.files = []; self.deleted_files = [];
	            	}
	            	self.addComment ( args );

	            }
	   		},

	        
	        /**
	         * Check select all check box enable or disabled. for notify users
	         * 
	         * @param  int user_id 
	         * 
	         * @return void         
	         */
	        notify_coo_workers: function( user_id ) {
	            var co_worker_length = this.get_porject_users_id_by_role('co_worker').length,
	                notify_co_worker_length = this.notify_co_workers.length;
	            
	            if ( co_worker_length != notify_co_worker_length ) {
	                this.notify_all_co_worker = false;
	            }

	            if ( co_worker_length === notify_co_worker_length ) {
	                this.notify_all_co_worker = true;
	            }
	        },

	        /**
	         * Is notification send all co-worker or not
	         */
	        notify_all_coo_worker: function() {

	            if ( this.notify_all_co_worker ) {
	                this.notify_co_workers = [];
	                this.notify_co_workers = this.get_porject_users_id_by_role('co_worker');
	            } else {
	                this.notify_co_workers = [];
	            }
	        },
	    }
	}
</script>

