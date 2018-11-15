<template>
  <form class="pm-comment-form-vue pm-comment-form" @submit.prevent="taskCommentAction()">

        <div class="item message pm-sm-col-12 ">
            <text-editor :editor_id="editor_id" :content="content"></text-editor>
        </div>

        <span class="attach-text" v-if="files.length">{{ 'Attach Files', 'wedevs-project-manager' }}</span>
        <file-uploader :files="files" :delete="deleted_files"></file-uploader>
               
        <div class="pm-flex">
            <div class="comment-action-chunk">
                <input v-if="!comment.edit_mode" :disabled="submit_disabled" type="submit" class="pm-button pm-primary"  :value="add_new_comment" id="" />
                <input v-if="comment.edit_mode" :disabled="submit_disabled" type="submit" class="pm-button pm-primary"  :value="update_comment" id="" />
                <a href="#" @click.prevent="hideCommentForm()" class="pm-button pm-secondary pm-button-cancel">{{__('Cancel', 'wedevs-project-manager')}}</a>
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>
            <div class="comment-action-chunk">
                <a href="#" v-pm-uploader class="pm-button pm-secondary">
                    <span class="icon-pm-clip"></span>
                    {{ __('Attach', 'wedevs-project-manager') }}
                </a>
                <div class="notify-users">

                    <a href="#" @click.prevent="notifyUserButton()" class="pm-button pm-secondary pm-button-nofity-user">
                        <span class="icon-pm-single-user"></span>
                        {{ __('Notify user', 'wedevs-project-manager') }}
                    </a>

                    <div  v-if="activeNotifyUsers"  class="pm-multiselect-top pm-multiselect-single-task">
                        <div class="pm-multiselect-content">
                            <div class="assign-to">{{ __('Assign to', 'wedevs-project-manager') }}</div>
                       
                            <multiselect
                                v-model="notify_users"
                                :options="project_users"
                                :multiple="true"
                                :close-on-select="false"
                                :clear-on-select="true"
                                :show-labels="true"
                                :searchable="true"
                                :placeholder="__('Search User', 'wedevs-project-manager')"
                                select-label=""
                                selected-label="selected"
                                deselect-label=""
                                label="display_name"
                                track-by="id"
                                :allow-empty="true">

                                <template slot="option" slot-scope="props">
                                    <img class="option__image" :src="props.option.avatar_url" alt="No Man’s Sky">
                                    <div class="option__desc">
                                        <span class="option__title">{{ props.option.display_name }}</span>
                                    </div>
                                </template>

                            </multiselect>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
  import editor from '@components/common/text-editor.vue';
  import uploader from '@components/common/file-uploader-updated.vue';
  import notifyUser from '@components/common/notify-user.vue';
  import Multiselect from 'vue-multiselect';
  import Mixins from './mixin';

  export default {
    props: {
        comment: {
            type: [Object],
            default () {
                return {}
            }
        },

        comments: {
            type: [Array],
            default () {
                return []
            }
        },

        task: {
            type: [Object],
            default () {
                return {
                    id: false
                }
            }
        },
        commentFormMeta: {
            type: [Object],
            default () {
                activeNewCommentField: true
            }
        }
    },

    mixins: [Mixins],

    data () {
        return {
            submit_disabled: false,
            show_spinner: false,
            content: {
                html: typeof this.comment.content == 'undefined' ? '' : this.comment.content,
            },
            task_id: typeof this.task.id == 'undefined' ? false : this.task.id,
            files: typeof this.comment.files === 'undefined' ? [] : this.comment.files.data,
            deleted_files: [],
            mentioned_user_ids: null,
            add_new_comment: __( 'Post Comment', 'wedevs-project-manager'),
            update_comment: __( 'Update Comment', 'wedevs-project-manager'),
            notify_users: [],
            fileUploaderAttr: {
                onlyButton: true,
                buttonText: __('Attach', 'wedevs-project-manager')
            },
            activeNotifyUsers: false

        }
    },

    components: {
        'text-editor': editor,
        'file-uploader': uploader,
        'notifyUser': notifyUser,
        'multiselect': Multiselect,
    },

    created () {
        window.addEventListener('click', this.windowActivity);
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
        project_users () {
            return this.$root.$store.state.project_users;
        },
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
        windowActivity (el) {
            var commentAction =  jQuery(el.target).closest('.notify-users');

            if(!commentAction.length) {
                this.activeNotifyUsers = false;
            }
        },

        notifyUserButton () {
            this.activeNotifyUsers = this.activeNotifyUsers ? false : true;

            if(this.activeNotifyUsers) {
                pm.Vue.nextTick(function() {
                    jQuery('.notify-users').find('.multiselect__input').show().focus();
                });
            }
        },

        hideCommentForm () {
            if(typeof this.comment.edit_mode != 'undefined') {
                this.comment.edit_mode = false;
            }
            if(typeof this.commentFormMeta.activeNewCommentField == 'undefined') {
                pm.Vue.set(this.commentFormMeta, 'activeNewCommentField', false);
            } else {
               this.commentFormMeta.activeNewCommentField = false; 
            }
            
        },
        taskCommentAction () {
            var regEx = /data-pm-user-id=":(.+?):"/g;
            this.mentioned_user_ids = this.getMatches(this.comment.content, regEx, 1);

            // Prevent sending request when multiple click submit button 
            if ( this.submit_disabled ) {
                return;
            }
            if (typeof this.content.html === 'undefined' || this.content.html == '') {
                return;
            }
            // Disable submit button for preventing multiple click
            this.submit_disabled = true;
            // Showing loading option 
            this.show_spinner = true;
            var self = this;

            let notify_users = [];

            this.notify_users.map( u => { notify_users.push(u.id) });

            var args = {
                data: {
                    commentable_id: self.task_id,
                    content: self.content.html,
                    commentable_type: 'task',
                    deleted_files: self.deleted_files || [],
                    mentioned_users: self.mentioned_user_ids,
                    files: self.files || [],
                    project_id: self.task.project_id,
                    notify_users: notify_users
                },
            }

            if(typeof this.comment.id !== 'undefined' ){
                args.data.id = this.comment.id;
                args.callback = function(res){
                    var index = self.getIndex( self.comments, self.comment.id, 'id' );
                    self.comments.splice(index, 1, res.data);
                    if ( typeof self.task.activities !== 'undefined' ) {
                        self.task.activities.data.unshift(res.activity.data);
                    } else {
                        self.task.activities = { data: [res.activity.data] };
                    }
                    self.submit_disabled = false;
                    self.show_spinner    = false;
                }

                self.updateComment( args );
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

                    if ( typeof self.task.activities !== 'undefined' ) {
                        self.task.activities.data.unshift(res.activity.data);
                    } else {
                        self.task.activities = { data: [res.activity.data] };
                    }
                }
                self.addComment ( args );
            }
        }
    }
  }
</script>
