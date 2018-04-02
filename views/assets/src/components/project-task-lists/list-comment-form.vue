<template>
    <div class="pm-comment-form">

        <form class="pm-comment-form-vue" @submit.prevent="listCommentAction()">

            <div class="item message pm-sm-col-1">
                <text-editor :editor_id="editor_id" :content="content"></text-editor>
            </div>

            <file-uploader :files="files" :delete="deleted_files"></file-uploader>
            <notify-user v-model="notify_users"></notify-user>
            
            <div class="submit">
                <input v-if="!comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  :value="__( 'Add New Comment','pm' )" id="" />
                <input v-if="comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  :value="__( 'Update Comment', 'pm') " id="" />
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>
        </form>
    </div>
</template>

<script>
    import editor from '@components/common/text-editor.vue';
    import file_uploader from '@components/common/file-uploader.vue';
    import notifyUser from '@components/common/notify-user.vue';
    import Mixins from './mixin';

    export default {
    // Get passing data for this component. 
    props: ['comment', 'list'],

    mixins: [Mixins],

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
            notify_users: [],
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
        'file-uploader': file_uploader,
        notifyUser: notifyUser
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
                   notify_users: this.notify_users
                },
            }
            if(typeof this.comment.id !== 'undefined' ){
                args.data.id = this.comment.id;
                args.callback = function(res){
                    self.$store.commit('projectTaskLists/listUpdateComment', {
                        list_id: self.list_id,
                        comment_id: self.comment.id,
                        comment: res.data
                    });
                    self.submit_disabled = false;
                    self.show_spinner    = false;
                    self.notify_users    = [];
                    self.files           = []; 
                    self.deleted_files   = [];
                }
                self.updateComment ( args );
            }else{
                args.callback = function ( res ) {
                    self.$store.commit('projectTaskLists/listNewComment', {
                        list_id: self.list_id,
                        comment: res.data
                    });
                    self.submit_disabled = false;
                    self.show_spinner    = false;
                    self.notify_users    = [];
                    self.files           = []; 
                    self.deleted_files   = [];
                }
                self.addComment ( args );
            }
            }
    }
    }
</script>

