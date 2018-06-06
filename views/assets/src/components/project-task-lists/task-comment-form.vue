<template>
  <form class="pm-comment-form-vue" @submit.prevent="taskCommentAction()">

        <div class="item message pm-sm-col-12 ">
            <text-editor :editor_id="editor_id" :content="content"></text-editor>
        </div>

         <file-uploader :files="files" :delete="deleted_files"></file-uploader>
         <notify-user v-model="notify_users"></notify-user>
               
        <div class="submit">
            <input v-if="!comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  :value="add_new_comment" id="" />
            <input v-if="comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  :value="update_comment" id="" />
            <span v-show="show_spinner" class="pm-spinner"></span>
        </div>
    </form>
</template>

<script>
  import editor from '@components/common/text-editor.vue';
  import uploader from '@components/common/file-uploader.vue';
  import notifyUser from '@components/common/notify-user.vue';
  import Mixins from './mixin';

  export default {
    props: ['comment', 'comments'],
    mixins: [Mixins],
    data () {
        return {
            submit_disabled: false,
            show_spinner: false,
            content: {
                      html: typeof this.comment.content == 'undefined' ? '' : this.comment.content,
                  },
            task_id: this.$route.params.task_id,
            files: typeof this.comment.files === 'undefined' ? [] : this.comment.files.data,
            deleted_files: [],
            mentioned_user_ids: null,
            add_new_comment: __( 'Add New Comment', 'pm' ),
            update_comment: __( 'Update Comment', 'pm' ),
            notify_users: [],
        }
    },
    components: {
        'text-editor': editor,
        'file-uploader': uploader,
        notifyUser: notifyUser
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
            var regEx = /data-pm-user-id=":(.+?):"/g;
            this.mentioned_user_ids = this.getMatches(this.comment.content, regEx, 1);

            // Prevent sending request when multiple click submit button 
            if ( this.submit_disabled ) {
                return;
            }
            if (typeof this.comment.content === 'undefined' || this.comment.content == '') {
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
                    mentioned_users: self.mentioned_user_ids,
                    files: self.files || [],
                    notify_users: this.notify_users
                },
            }

            if(typeof this.comment.id !== 'undefined' ){
                args.data.id = this.comment.id;
                args.callback = function(res){
                    var index = self.getIndex( self.comments, self.comment.id, 'id' );
                    self.comments.splice(index, 1, res.data);

                }

                self.updateComment ( args );
            }else{

                args.callback = function ( res ) {
                    self.comments.push(res.data);
                    self.submit_disabled = false;
                    self.show_spinner    = false;
                    self.content.html    = '';
                    self.comment.content = '';
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
