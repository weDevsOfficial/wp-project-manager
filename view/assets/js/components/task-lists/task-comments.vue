<template>
	<div class="cpm-task-comment-wrap">

        <h3 class="cpm-comment-title">Discuss this task</h3>
        <ul class="cpm-comment-wrap">
            <li  v-for="comment in comments" :key="comment.id" :class="'cpm-comment clearfix even cpm-fade-out-'+comment.id">

                <div class="cpm-avatar" v-html="comment.avatar"></div>

                <div class="cpm-comment-container">
                    <div class="cpm-comment-meta">
                        <span class="cpm-author" v-html="comment.comment_user"></span>
                        <span>On</span>
                        <span class="cpm-date">
                            <time :datetime="dateISO8601Format( comment.comment_date )" :title="dateISO8601Format( comment.comment_date )">{{ dateTimeFormat( comment.comment_date ) }}</time>
                        </span>
                        <!-- v-if="current_user_can_edit_delete(comment, task)" -->
                        <div  class="cpm-comment-action">
                            <span class="cpm-edit-link">
                                <a href="#" @click.prevent="showHideTaskCommentForm( comment )" class="dashicons dashicons-edit"></a>
                            </span>

                            <span class="cpm-delete-link">
                                <a href="#" @click.prevent="deleteTaskComment( comment.id, task )" class="dashicons dashicons-trash" data-project_id="111" data-id="82" data-confirm="Are you sure to delete this comment?"></a>
                            </span>
                        </div>
                    </div>

                    <div class="cpm-comment-content">
                        <div v-html="comment.content"></div>
                       <!--  <ul class="cpm-attachments">
                            <li v-for="file in comment.files">
                                <a class="cpm-colorbox-img" :href="file.url" title="file.name" target="_blank">
                                    <img :src="file.thumb">
                                </a>
                            </li>
                        </ul> -->
                    </div>

                    <div class="cpm-comment-edit-form" v-if="comment.edit_mode">
                        <!-- <div :class="'cpm-slide-'+comment.id" style="display: none;"> -->
                            <task-comment-form :comment="comment" :comments="comments"></task-comment-form>
                        <!-- </div> -->
                    </div>
                </div>
            </li>
        </ul>
        <div class="single-todo-comments">
            <div class="cpm-comment-form-wrap">

                <div class="cpm-avatar"><img :src="avatar_url" height="48" width="48"/></div>
                <div class="cpm-new-doc-comment-form">
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
	            if ( comment.comment_type == 'cpm_activity' ) {
	                return false;
	            }

	            if ( task.can_del_edit ) {
	                return true;
	            }

	            if ( (comment.user_id == this.currnet_user_id ) && (comment.comment_type == '') ) {
	                return true;
	            }

	            return false;
	        }

	    }
	}
</script>