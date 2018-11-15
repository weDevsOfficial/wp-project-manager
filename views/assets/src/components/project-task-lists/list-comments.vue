<template>
    <div class="pm-task-comment-wrap">
        
        <!-- <div class="discuss-text pm-h2">{{ __( 'Discussion', 'wedevs-project-manager') }}</div> -->

        <div  class="comment-content">
            <ul class="comment-content-ul" v-if="comments.length">
                <li  v-for="comment in comments" :key="'tasks-comments-'+comment.id" :class="'comment-li pm-fade-out-'+comment.id">
                    <div  :class="lcommentLiBodyClass(comment.edit_mode)">
                        <div class="comment-header">
                            <div class="pm-avatar">
                                <a :href="myTaskRedirect( comment.creator.data.id )" :title="comment.creator.data.display_name">
                                <img :alt="comment.creator.data.display_name" :src="comment.creator.data.avatar_url" class="avatar avatar-96 photo" height="96" width="96"></a>
                            </div>
                            
                            <div v-if="!comment.edit_mode" class="author-date">
                                <span class="pm-author">
                                    <a :href="myTaskRedirect( comment.creator.data.id )" :title="comment.creator.data.display_name">
                                        {{ ucfirst(comment.creator.data.display_name) }}
                                    </a>
                                </span>
                                
                                <span class="pm-date">
                                    <time :datetime="dateISO8601Format( comment.comment_date )" :title="getFullDate( comment.created_at.timestamp)">{{ relativeDate(comment.created_at.timestamp) }}</time>
                                </span>
                            </div>
                            <div v-if="!comment.edit_mode && can_edit_comment(comment)" @click.prevent="showActionMenu(comment)" class="icon-pm-down-arrow comment-action-arrow">
                                <div v-if="comment.actionMode" class="pm-popup-menu comment-action">
                                    <ul class="comment-action-ul">
                                        <li>
                                            <a  href="#" @click.prevent="showHideTaskCommentForm( comment )">
                                                <span class="icon-pm-pencil"></span>
                                                <span class="comment-action-edit">{{ __('Edit', 'wedevs-project-manager') }}</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" @click.prevent="deleteTaskComment( comment.id )">
                                                <span class="icon-pm-delete"></span>
                                                <span class="comment-action-delete">{{ __('Delete', 'wedevs-project-manager') }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                        </div>


                        <div v-if="!comment.edit_mode" class="pm-comment-content">
                            
                            <div v-html="comment.content"></div>
                            <ul class="pm-attachments" v-if="comment.files.data.length">
                                <li v-for="file in comment.files.data" :key="file.id">
                                    <pm-file :file="file" />
                                </li>
                            </ul>

                        </div>

                        <transition name="slide" v-if="can_edit_comment(comment)" >
                            <div class="pm-comment-edit-form" v-if="comment.edit_mode">
                                <task-comment-form :task="commentable" :comment="comment" :comments="comments" :commentFormMeta="commentFormMeta"></task-comment-form>
                            </div>
                        </transition>
                    </div>
                </li>
            </ul>
            <div class="comment-field-content">
                <div class="pm-avatar comment-field-avatar">
                    <a  href="#/my-tasks">
                        <img class="avatar" :src="PM_Vars.avatar_url">
                    </a>
                </div>
                <div class="comment-field">
                    <div @click.prevent="showHideNewCommentField()" v-if="!commentFormMeta.activeNewCommentField" class="comment-field-text pm-light-font">{{ __( 'Add a comment', 'wedevs-project-manager' ) }}</div>
                    <task-comment-form 
                        v-if="commentFormMeta.activeNewCommentField"  
                        :task="commentable" 
                        :comment="{}" 
                        :comments="comments"
                        :commentFormMeta="commentFormMeta">
                    </task-comment-form>
                </div>
            </div>
        </div>



    </div>
</template>

<style lang="less">
    .pm-task-comment-wrap {
        .comment-content-ul {
            .icon-pm-down-arrow {
                cursor: pointer;
                &:hover {
                    &:before {
                        color: #444;
                    }
                }
            }
        }
        .comment-action-ul {
            li {
                a {
                    display: block;
                }
            }
        }

        .pm-comment-form {
            .attach-text {
                margin-top: 20px;
                margin-bottom: 10px;
                display: block;
                font-size: 12px;
                font-weight: bold;
            }
            .comment-action-chunk {
                display: flex;
                .pm-button {
                    &:hover {
                        .icon-pm-clip, .icon-pm-single-user {
                            &:before {
                                color: #444;
                            }
                        }
                    }
                }
                .icon-pm-clip, .icon-pm-single-user {
                    margin-right: 5px;
                }
                .pm-button-cancel {
                    margin-left: 5px;
                }
                .pm-button-nofity-user {
                    margin-left: 5px;
                }

                .notify-users {
                    border: none;
                    position: relative;
                    .pm-multiselect-top {
                        right: 30px;
                        top: 42px;
                    }
                }
            }
        }
        
        .discuss-text {
            margin-bottom: 5px;
        }
        .comment-content {
            border: 1px solid #ECECEC;
            border-radius: 3px;
            padding: 18px;
            background: #FAFAFA;
            .comment-action-arrow {
                position: relative;

                .comment-action {
                    position: absolute;
                    font-size: 12px;
                    margin: 0;
                    padding: 0;
                    top: 20px;
                    width: 85px;
                    left: auto;
                    right: -13px;
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                    padding: 0;
                    border: 1px solid #DDDDDD;
                    background: #fff;
                    border-radius: 3px;
                    box-shadow: 0px 2px 40px 0px rgba(214, 214, 214, 0.6);

                    &::before {
                        border-color: transparent transparent #DDDDDD transparent;
                        position: absolute;
                        border-style: solid;
                        top: -9px;
                        left: auto;
                        content: "";
                        right: 10px;
                        z-index: 9999;
                        border-width: 0px 8px 8px 8px;
                    }

                    &::after {
                        border-color: transparent transparent #ffffff transparent;
                        position: absolute;
                        border-style: solid;
                        top: -7px;
                        left: auto;
                        right: 10px;
                        content: "";
                        z-index: 9999;
                        border-width: 0 8px 7px 8px;
                    }

                    .comment-action-ul {
                        li {
                            &:hover {
                                .icon-pm-pencil {
                                    &:before {
                                        color: #000;
                                    }
                                }

                                .icon-pm-delete {
                                    &:before {
                                        color: #ff0404;
                                    }
                                }
                            }
                            padding: 8px 10px 7px 10px;
                            margin: 0;
                            .comment-action-edit {
                                color: #000;
                                margin-left: 3px;
                            }
                            .comment-action-delete {
                                color: #000;
                                margin-left: 6px;
                            }
                        }
                        
                    }
                }
            }
            

            .comment-content-ul {
                .comment-li {
                    background: none;
                    border: none;
                    margin-bottom: 10px;

                    p {
                        margin: 0;
                        padding: 0;
                    }

                    .comment-li-body {
                        display: flex;
                        justify-content: space-between;
                    }
                }
            }
            .comment-header {
                display: flex;
                justify-content: space-between;
                .icon-pm-down-arrow {
                    font-size: 7px;
                    cursor: pointer;
                    position: relative;
                }
            }
        }
        .pm-avatar {
            margin-right: 20px;
            img {
                height: 24px;
                width: 24px;
                border-radius: 12px;
            }
        }
        .author-date {
            flex: 1;
            .pm-date {
                font-size: 13px;
                color: #9C9C9C;
            }
            .pm-author {
                font-size: 12px;
                font-weight: bold;
            }
        }

        .pm-author {
            margin-right: 10px;
        }
        .pm-comment-content {
            margin-left: 44px;
            margin-top: -4px;
            color: #000 !important;
            
        }
        .pm-comment-edit-form {
            flex: 1;
        }
        .comment-field-content {
            display: flex;
            align-items: center;
            margin-right: 20px;
            padding: 8px 0px 0px 8px;
            .comment-field-avatar {
                align-self: baseline;
                margin-right: 12px;
            }
            .comment-field {
                width: 92%;
                .comment-field-text {
                    border: 1px solid #ECECEC;
                    padding: 8px;
                    border-radius: 3px;
                    background: #FFFFFF;
                }
            }
        }
        .mce-tinymce {
            box-shadow: none;
        }
        .pm-comment-acction {
            width: 38%;
        }

        .pm-attachments {
            li {
                display: inline-block;
                margin: 10px 8px 0 0;
                border: none;
                padding: 0;

                img {
                    margin: 0;
                }
            }
        }
    }
    .pm-task-comment-thumb {
        height: 80px;
        width: 80px;
    }
</style>

<script>
    import comment_form from './list-comment-form.vue';
    import Mixins from './mixin';
    

    export default {
        // Get passing data for this component.
        props: {
            comments: {
                type: [Array],
                default () {
                    return [];
                }
            },

            commentable: {
                type: [Object],
                default () {
                    return {};
                }
            }
        },

        mixins: [Mixins],

        data: function() {
            return {
                currnet_user_id: PM_Vars.current_user.ID,
                avatar_url: PM_Vars.avatar_url,
                commentFormMeta: {
                    activeNewCommentField: false   
                }
            }
        },

        created () {
            window.addEventListener('click', this.windowActivity);
        },

        components: {
            'task-comment-form': comment_form
        },

        methods: {
            lcommentLiBodyClass (edit) {
                return edit ? 'comment-li-body' : '';
            },
            windowActivity (el) {
                var commentAction =  jQuery(el.target).closest('.comment-action-arrow');

                if(!commentAction.length) {
                    this.comments.forEach(function(comment) {
                        pm.Vue.set(comment, 'actionMode', false);
                    });
                }
            },
            showActionMenu (comment) {

                if(typeof comment.actionMode == 'undefined') {
                    pm.Vue.set(comment, 'actionMode', true);
                } else {
                    comment.actionMode = comment.actionMode ? false : true; 
                }
                
            },
            showHideNewCommentField () {
                this.commentFormMeta.activeNewCommentField = this.commentFormMeta.activeNewCommentField ? false : true;
            },
            commentDate (comment) {
                if (typeof comment.created_at != 'undefined') {
                    return pm.Moment(comment.created_at.datetime).fromNow();
                    return this.shortDateFormat(comment.created_at.datetime) + ', ' + this.shortTimeFormat(comment.created_at.datetime);
                }

                return '';
            },
            showHideTaskCommentForm (comment) {
                comment.edit_mode = comment.edit_mode ? false : true;
            },
            current_user_can_edit_delete: function( comment, task ) {
                if ( comment.comment_type == 'pm_activity' ) {
                    return false;
                }

                if ( task.can_del_edit ) {
                    return true;
                }

                if ( (comment.user_id == this.currnet_user_id ) && (comment.comment_type == '') ) {
                    return true;
                }

                return false;
            },

            deleteTaskComment (id) {
                if ( !confirm( this.__( 'Are you sure?', 'wedevs-project-manager') ) ) {
                    return;
                }
                var self = this;

                var request_data = {
                    url: self.base_url + '/pm/v2/projects/'+self.project_id+'/comments/' + id + '/delete',
                    type: 'POST',
                    success (res) {
                        var index = self.getIndex(self.comments, id, 'id');
                        pm.Toastr.success(res.message);
                        self.comments.splice(index, 1);
                        self.$store.commit('updateProjectMeta', 'total_activities');
                    }
                }
                this.httpRequest(request_data);
            }

        }
    }
</script>
