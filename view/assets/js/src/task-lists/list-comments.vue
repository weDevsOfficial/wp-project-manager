<template>
	<div class="cpm-list-comment-wrap">

        <h3 class="cpm-comment-title">Discuss this task list</h3>

        <ul class="cpm-comment-wrap">
            <li  v-for="comment in comments" :key="comment.id" :class="'cpm-comment clearfix even cpm-fade-out-'+comment.id">

               <div class="cpm-avatar">
                     <a :href="userTaskProfileUrl ( comment.creator.data.id )" :title="comment.creator.data.display_name"><img :alt="comment.creator.data.display_name" :src="comment.creator.data.avatar_url" class="avatar avatar-96 photo" height="96" width="96"></a>
                </div>

                <div class="cpm-comment-container">
                    <div class="cpm-comment-meta">
                        <span class="cpm-author" v-html="comment.comment_user"></span>
                        <span>On</span>
                        <span class="cpm-date">
                            <time :datetime="dateISO8601Format( comment.comment_date )" :title="dateISO8601Format( comment.comment_date )">{{ dateTimeFormat( comment.comment_date ) }}</time>
                        </span>
                        <!-- v-if="current_user_can_edit_delete(comment, list)" -->
                        <div  class="cpm-comment-action">
                            <span class="cpm-edit-link">
                                <a href="#" @click.prevent="showHideListCommentEditForm( comment )" class="dashicons dashicons-edit"></a>
                            </span>

                            <span class="cpm-delete-link">
                                <a href="#" @click.prevent="deleteListComment( comment.id )" class="dashicons dashicons-trash" data-project_id="111" data-id="82" data-confirm="Are you sure to delete this comment?"></a>
                            </span>
                        </div>
                    </div>
                    <div class="cpm-comment-content">
                        <div v-html="comment.content"></div>
                        <ul class="cpm-attachments" v-if="comment.files.data.length">
                            <li v-for="commnetFile in comment.files.data">
                                <a class="cpm-colorbox-img" :href="commnetFile.url" :title="commnetFile.name" target="_blank">
                                    <img :src="commnetFile.thumb" :alt="commnetFile.name">
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="cpm-comment-edit-form" v-if="comment.edit_mode">
                        <div :class="'cpm-slide-'+comment.id">
                            <list-comment-form :comment="comment" :list="list"></list-comment-form>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="single-todo-comments">
            <div class="cpm-comment-form-wrap">

                <div class="cpm-avatar"><img :src="getCurrentUserAvatar" height="48" width="48"/></div>
                <list-comment-form :comment="{}" :list="list"></list-comment-form>
            </div>
        </div>
	</div>
</template>

<script>
	
	import list_comment_form from './list-comment-form.vue';

	export default {

	    // Get passing data for this component. 
	    props: ['comments', 'list'],

	    computed: {
	        /**
	         * Get current user avatar
	         */
	        getCurrentUserAvatar: function() {
	            return PM_Vars.current_user_avatar_url;
	        },
	    },

	    methods: {
	        current_user_can_edit_delete: function( comment, list ) {
	            
	            if ( list.can_del_edit ) {
	                return true;
	            }
	            
	            if ( (comment.user_id == this.$store.state.get_current_user_id ) && (comment.comment_type == '') ) {
	                return true;
	            }

	            return false;
	        },
            deleteListComment (id) {
                if ( !confirm('Are you sure!') ) {
                    return;
                }
                var self = this;

                var request_data = {
                    url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/comments/' + id,
                    type: 'DELETE',
                    success (res) {
                        var index = self.getIndex(self.comments, id, 'id');

                        self.comments.splice(index, 1);
                    }
                }
                this.httpRequest(request_data);
            }
	    },

	    components: {
	    	'list-comment-form': list_comment_form
	    }
            
	}
</script>

