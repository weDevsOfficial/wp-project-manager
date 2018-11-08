<template>
    <div class="pm-comment-form">
        <form @submit.prevent="newSelfComment()">
            <div class="item message pm-sm-col-12">
                <text-editor :editor_id="editor_id" :content="content"></text-editor>
                
            </div>
            
            <file-uploader :files="files" :delete="deleted_files"></file-uploader>
            <notify-user v-model="notify_users"></notify-user>

            <div class="submit">
                <input v-if="!comment.edit_mode" type="submit" class="button-primary" name="pm_new_comment" :value="add_new_comment" id="">
                <input v-if="comment.edit_mode" type="submit" class="button-primary" name="pm_new_comment" :value="Update_Comment" id="">
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>
        </form>
    </div>
</template>

<style lang="less">
    .pm-comment-form .notify-users .pm-user-list {
        padding: 10px 10px 10px 16px !important;
    }
</style>

<script>    
    import editor from '@components/common/text-editor.vue';
    import uploader from '@components/common/file-uploader.vue';
    import notifyUser from '@components/common/notify-user.vue';
    import Mixins from './mixin';
    
    export default {
        props: ['comment', 'discuss'],
        mixins: [Mixins],
        data () {
            return {
                content: {
                    html: typeof this.comment.content == 'undefined' ? '' : this.comment.content,
                },
                submit_disabled: false,
                show_spinner: false,
                mentioned_user_ids: null,
                notify_users: [],
                add_new_comment: __( 'Add New Comment', 'wedevs-project-manager'),
                Update_Comment: __( 'Update Comment', 'wedevs-project-manager'),
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
            'file-uploader': uploader,
             notifyUser: notifyUser
        },

        computed: {
            /**
             * Editor ID
             * 
             * @return string
             */
            editor_id: function() {
                var comment_id = ( typeof this.comment.id === 'undefined' ) ? '' : '-' + this.comment.id;
                return 'pm-comment-editor-' + comment_id;
            },
        },

        methods: {
            newSelfComment () {
                if (typeof this.comment.content === 'undefined' || this.comment.content == '' ) {
                    return;
                }
                var self = this;
                var comment_id = typeof self.comment.id == 'undefined' ? false : true;

                var regEx = /data-pm-user-id=":(.+?):"/g;
                this.mentioned_user_ids = this.getMatches(this.comment.content, regEx, 1);

                var args = {
                    content: this.comment.content,
                    commentable_id: this.discuss.id,
                    commentable_type: 'discussion_board',
                    deleted_files: this.deleted_files,
                    files: this.files,
                    mentioned_users: this.mentioned_user_ids,
                    notify_users: this.notify_users,

                    callback: function() {
                        self.content.html = '';
                        self.notify_users = [];
                    }
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
