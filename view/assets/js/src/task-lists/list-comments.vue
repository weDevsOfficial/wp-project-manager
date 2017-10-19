<template>
	<div class="pm-list-comment-wrap">

        <h3 class="pm-comment-title">{{text.discuss_this_task_list}}</h3>

        <ul class="pm-comment-wrap">
            <li  v-for="comment in comments" :key="comment.id" :class="'pm-comment clearfix even pm-fade-out-'+comment.id">

               <div class="pm-avatar">
                     <a :href="userTaskProfileUrl ( comment.creator.data.id )" :title="comment.creator.data.display_name"><img :alt="comment.creator.data.display_name" :src="comment.creator.data.avatar_url" class="avatar avatar-96 photo" height="96" width="96"></a>
                </div>

                <div class="pm-comment-container">
                    <div class="pm-comment-meta">
                        {{text.by}}
                        <span class="pm-author" >
                            
                            <a :href="userTaskProfileUrl ( comment.creator.data.id )" :title="comment.creator.data.display_name">
                                {{ comment.creator.data.display_name }}
                            </a>
                        </span>
                        <span>{{text.on}}</span>
                        <span class="pm-date">
                            <time :datetime="dateISO8601Format( comment.comment_date )" :title="dateISO8601Format( comment.comment_date )">{{ dateTimeFormat( comment.comment_date ) }}</time>
                        </span>
                        <!-- v-if="current_user_can_edit_delete(comment, list)" -->
                        <div  class="pm-comment-action">
                            <span class="pm-edit-link">
                                <a href="#" @click.prevent="showHideListCommentEditForm( comment )" class="dashicons dashicons-edit"></a>
                            </span>

                            <span class="pm-delete-link">
                                <a href="#" @click.prevent="deleteListComment( comment.id )" class="dashicons dashicons-trash"></a>
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
                        <div :class="'pm-slide-'+comment.id">
                            <list-comment-form :comment="comment" :list="list"></list-comment-form>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="single-todo-comments">
            <div class="pm-comment-form-wrap">

                <div class="pm-avatar"><img :src="getCurrentUserAvatar" height="48" width="48"/></div>
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
                if ( !confirm( this.text.are_you_sure ) ) {
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
	    },

	    components: {
	    	'list-comment-form': list_comment_form
	    }
            
	}
</script>

