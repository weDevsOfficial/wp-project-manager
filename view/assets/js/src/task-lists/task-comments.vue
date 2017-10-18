<template>
	<div class="pm-task-comment-wrap">
        
        <h3 class="pm-comment-title">Discuss this task</h3>
        <ul class="pm-comment-wrap">
            <li  v-for="comment in comments" :key="comment.id" :class="'pm-comment clearfix even pm-fade-out-'+comment.id">

                <div class="pm-avatar">
                     <a :href="userTaskProfileUrl ( comment.creator.data.id )" :title="comment.creator.data.display_name"><img :alt="comment.creator.data.display_name" :src="comment.creator.data.avatar_url" class="avatar avatar-96 photo" height="96" width="96"></a>
                </div>

                <div class="pm-comment-container">
                    <div class="pm-comment-meta">
                        <span class="pm-author" v-html="comment.comment_user"></span>
                        <span>On</span>
                        <span class="pm-date">
                            <time :datetime="dateISO8601Format( comment.comment_date )" :title="dateISO8601Format( comment.comment_date )">{{ dateTimeFormat( comment.comment_date ) }}</time>
                        </span>
                        <!-- v-if="current_user_can_edit_delete(comment, task)" -->
                        <div  class="pm-comment-action">
                            <span class="pm-edit-link">
                                <a href="#" @click.prevent="showHideTaskCommentForm( comment )" class="dashicons dashicons-edit"></a>
                            </span>

                            <span class="pm-delete-link">
                                <a href="#" @click.prevent="deleteTaskComment( comment.id )" class="dashicons dashicons-trash" data-project_id="111" data-id="82" data-confirm="Are you sure to delete this comment?"></a>
                            </span>
                        </div>
                    </div>

                    <div class="pm-comment-content">
                        <div v-html="comment.content"></div>
                        <ul class="pm-attachments" v-if="comment.files.data.length">
                            <li v-for="commnetFile in comment.files.data">
                                <a class="pm-colorbox-img" :href="commnetFile.url" :title="commnetFile.name" target="_blank">
                                    <img :src="commnetFile.thumb" :alt="commnetFile.name">
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="pm-comment-edit-form" v-if="comment.edit_mode">
                        <!-- <div :class="'pm-slide-'+comment.id" style="display: none;"> -->
                            <task-comment-form :comment="comment" :comments="comments"></task-comment-form>
                        <!-- </div> -->
                    </div>
                </div>
            </li>
        </ul>
        <div class="single-todo-comments">
            <div class="pm-comment-form-wrap">

                <div class="pm-avatar"><img :src="avatar_url" height="48" width="48"/></div>
                <div class="pm-new-doc-comment-form">
                    <task-comment-form :comment="{}" :comments="comments"></task-comment-form>
                </div><!--v-end--><!--v-component-->
            </div>
        </div>
	</div>
</template>

<script>
	import comment_form from './task-comment-form.vue';
	export default {
		// Get passing data for this component.
	    props: ['comments'],

	    data: function() {
	        return {
	            currnet_user_id: 1,
                avatar_url: PM_Vars.avatar_url
	        }
	    },

	    computed: {
	        /**
	         * Get current user avatar
	         */
	        getCurrentUserAvatar: function() {
	            return '';
	        },
	    },

	    components: {
	    	'task-comment-form': comment_form
	    },

	    methods: {
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
                if ( !confirm('Are you sure!') ) {
                    return;
                }
                var self = this;

                var request_data = {
                    url: self.base_url + '/pm/v2/projects/'+self.project_id+'/comments/' + id,
                    type: 'DELETE',
                    success (res) {
                        var index = self.getIndex(self.comments, id, 'id');

                        self.comments.splice(index, 1);
                    }
                }
                this.httpRequest(request_data);
            }

	    }
	}
</script>