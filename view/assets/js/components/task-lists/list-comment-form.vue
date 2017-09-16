<template>
	<div class="cpm-comment-form">

		<form class="cpm-comment-form-vue" @submit.prevent="updateComment()">

	        <div class="item message cpm-sm-col-1">
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
	                    <li v-for="co_worker in co_workers" :key="co_worker.id">
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
	</div>
</template>

<script>
	import editor from './text-editor.vue';
	import file_uploader from './file-uploader.vue';

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
	            files: typeof this.comment.files == 'undefined' ? [] : this.comment.files,
	            content: {
	                html: typeof this.comment.content == 'undefined' ? '' : this.comment.content,
	            },
	            notify_co_workers: [],
	            notify_all_co_worker: false,
	            show_spinner: false,
	            submit_disabled: false,
	        }
	    },

	    /**
	     * Observe onchange value
	     */
	    watch: {
	        /**
	         * Observed comment file change
	         * 
	         * @param  array new_files 
	         * 
	         * @return void           
	         */
	        files: function( new_files ) {
	            this.comment.files = new_files;
	        },

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
	            var comment_id = ( typeof this.comment.comment_ID == 'undefined' ) ? 
	                '' : '-' + this.comment.comment_ID;
	            return 'cpm-list-editor' + comment_id;
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
	        updateComment: function() {
	            // Prevent sending request when multiple click submit button 
	            if ( this.submit_disabled ) {
	                return;
	            }

	            // Make disable submit button
	            this.submit_disabled = true;

	            var self      = this,
	                is_update = typeof this.comment.comment_ID == 'undefined' ? false : true,
	                form_data = {
	                	commentable_type: 'task-list',
	                    content: this.comment.content,
	                    commentable_id: self.$route.params.list_id,
	                };

	            // Showing spinner    
	            this.show_spinner = true;

	            var request_data = {
	            	url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/comments',
	            	type: 'POST',
	            	data: form_data,
	            	success (res) {
	            		self.submit_disabled = false;
	            	},
	            	error (res) {
	            		self.submit_disabled = false;
	            	}
	            }

	            self.httpRequest(request_data);
	            // Sending request for add and update comment
	            // jQuery.post( PM_Vars.ajaxurl, form_data, function( res ) {
	                
	            //     self.show_spinner    = false;
	            //     self.submit_disabled = false;
	                
	            //     if ( res.success ) {
	                    
	            //         if ( ! is_update ) {
	            //             // After getting todo list, set it to vuex state lists
	            //             self.$store.commit( 'update_todo_list_comment', { 
	            //                 list_id: self.list.ID,
	            //                 comment: res.data.comment,
	            //             });

	            //             self.files = [];
	            //             self.content.html = '';
	                        
	            //             self.$root.$emit( 'after_comment' );
	 
	            //         } else {
	            //             self.showHideListCommentEditForm( self.comment.comment_ID );
	            //         }

	            //         // Display a success toast, with a title
	            //         //toastr.success(res.data.success);
	            //     } else {

	            //         // Showing error
	            //         res.data.error.map( function( value, index ) {
	            //             toastr.error(value);
	            //         });
	            //     } 
	            // });
	        },

	        /**
	         * Get files id array from file object
	         * 
	         * @param  object files 
	         * 
	         * @return array       
	         */
	        filtersOnlyFileID: function( files ) {
	            if ( typeof files == 'undefined' ) {
	                return [];
	            }

	            return files.map( function( file ) {
	                return file.id;
	            });
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

