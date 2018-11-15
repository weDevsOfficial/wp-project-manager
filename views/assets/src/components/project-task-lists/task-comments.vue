<template>
    <div class="pm-task-comment-wrap">
        
        <div class="discuss-text pm-h2">{{ __( 'Discussion', 'wedevs-project-manager') }}</div>

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
                                    <time :datetime="dateISO8601Format( comment.comment_date )" :title="getFullDate( comment.created_at.date+' '+comment.created_at.time )">{{ relativeDate(comment.created_at.timestamp) }}</time>
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
                                <task-comment-form :task="task" :comment="comment" :comments="comments" :commentFormMeta="commentFormMeta"></task-comment-form>
                            </div>
                        </transition>
                    </div>
                </li>
            </ul>
            <div class="pm-flex comment-field-content" v-if="!isArchivedTaskList(task)">
                <div class="pm-avatar comment-field-avatar">
                    <a  href="#/my-tasks">
                        <img class="avatar" :src="PM_Vars.avatar_url">
                    </a>
                </div>
                <div class="comment-field">
                    <div @click.prevent="showHideNewCommentField()" v-if="!commentFormMeta.activeNewCommentField" class="comment-field-text pm-light-font">{{ __( 'Add a comment', 'wedevs-project-manager' ) }}</div>
                    <task-comment-form 
                        v-if="commentFormMeta.activeNewCommentField"  
                        :task="task" 
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
    }
    .pm-task-comment-thumb {
        height: 80px;
        width: 80px;
    }
</style>

<script>
    import comment_form from './task-comment-form.vue';
    import Mixins from './mixin';
    
    export default {
        // Get passing data for this component.
        props: ['comments', 'task'],

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
            // this.comments.forEach(function(comment) {
            //     pm.Vue.set(comment, 'actionMode', false);
            // });

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
                if (this.isArchivedTaskList(this.task)) {
                    return false;
                }
                if(typeof comment.actionMode == 'undefined') {
                    pm.Vue.set(comment, 'actionMode', true);
                } else {
                    comment.actionMode = comment.actionMode ? false : true; 
                }
                
            },
            showHideNewCommentField () {
                if (this.isArchivedTaskList(this.task)) {
                    return false;
                }
                
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
