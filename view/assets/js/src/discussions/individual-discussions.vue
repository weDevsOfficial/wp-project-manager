<template>
	<div class="wrap cpm cpm-front-end">

        <pm-header></pm-header>

        <div v-if="loading" class="cpm-data-load-before" >
            <div class="loadmoreanimation">
                <div class="load-spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div>
        </div>

        <div v-else>
            <div v-if="discuss" id="cpm-signle-message"> 
                <div class="cpm-single">
                    <h3 class="cpm-box-title">
                        {{discuss.title}}          
                        <span class="cpm-right cpm-edit-link">
                            <a @click.prevent="showHideDiscussForm('toggle', discuss)" href="#" data-msg_id="97" data-project_id="60" class="cpm-msg-edit dashicons dashicons-edit"></a>
                            <span class="cpm-not-private"></span>
                        </span>

                        <div class="cpm-small-title">
                            By 
                            <a href="#" :title="discuss.creator.data.display_name">
                                {{ discuss.creator.data.display_name }}
                            </a> on September 11, 2017  at  01:34 pm            
                        </div>
                    </h3>
                    <div class="cpm-entry-detail">
                        <div v-html="discuss.description"></div>

                        <ul class="cpm-attachments" v-if="files.length">
                            <li v-for="file in files">
                                <a class="cpm-colorbox-img" :href="file.url" :title="file.name" target="_blank">
                                    <img :src="file.thumb" :alt="file.name">
                                </a>
                            </li>
                        </ul>

                    </div>
                    <span class="cpm-msg-edit-form">
                        <div class="cpm-message-form-wrap">
                            <new-discuss-form v-if="discuss.edit_mode" :discuss="discuss"></new-discuss-form>
                        </div>
                    </span>
                </div>
            </div>

            <div v-if="discuss" class="cpm-comment-area cpm-box-shadow">

                <h3> {{ discuss.meta.total_comments }} Comments</h3>
                <ul class="cpm-comment-wrap">

                    <li v-for="comment in comments" class="cpm-comment clearfix even" :id="'cpm-comment-' + comment.id" key="comment.id">
                        <div class="cpm-avatar ">
                            <a :href="userTaskProfileUrl ( comment.creator.data.id )" :title="comment.creator.data.display_name">
                                <img :alt="comment.creator.data.display_name" :src="comment.creator.data.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                            </a>
                        </div>
                        <div class="cpm-comment-container">
                            <div class="cpm-comment-meta">
                                <span class="cpm-author">
                                    <a :href="userTaskProfileUrl ( comment.creator.data.id )" :title="comment.creator.data.display_name">
                                        {{ comment.creator.data.display_name }}
                                    </a>
                                </span>
                                On            
                                <span class="cpm-date">
                                    <time datetime="2017-09-11T13:34:37+00:00" title="2017-09-11T13:34:37+00:00">September 11, 2017 1:34 pm</time>
                                </span>

                                <div class="cpm-comment-action">
                                    <span class="cpm-edit-link">
                                        <a @click.prevent="showHideDiscussCommentForm('toggle', comment)" href="#" class="cpm-edit-comment-link dashicons dashicons-edit " data-comment_id="309" data-project_id="60" data-object_id="97"></a>
                                    </span>

                                    <span class="cpm-delete-link">
                                        <a href="#" class="cpm-delete-comment-link dashicons dashicons-trash" @click.prevent="deleteSelfComment(comment.id, discuss.id)"></a>
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

                            <div class="cpm-comment-edit-form">
                               <comment-form v-if="comment.edit_mode" :comment="comment" :discuss="discuss"></comment-form> 
                            </div>
                        </div>
                    </li>
                </ul>
                
                <div class="cpm-comment-form-wrap">
                    <div class="cpm-avatar">
                        <a :href="userTaskProfileUrl( current_user.ID )" :title="current_user.data.display_name">
                            <img :alt="current_user.data.display_name" :src="avatar_url" :srcset="avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                        </a>
                    </div>
                    <comment-form :comment="{}" :discuss="discuss"></comment-form> 
                </div>
            </div>            
        </div>
            
    </div>
</template>

<script>
    import header from './../header.vue';
    import new_discuss_form from './new-discuss-form.vue';
    import comment_form from './comment-form.vue';

    export default {
        beforeRouteEnter (to, from, next) {

            next(vm => {
                vm.getSelfDiscuss();
                vm.getMilestones(vm);
            });
        },
        data(){
            return{
                loading: true,
            }
        },
        computed: {
            discuss () {
                if ( this.$store.state.discussion.length ) {
                    return this.$store.state.discussion[0];
                }

                return false;
            },
            files() {
                if ( this.$store.state.discussion.length ) {
                    return this.$store.state.discussion[0].files.data;
                }
                return [];
            },
            comments () {
                if ( this.$store.state.discussion.length ) {
                    return this.$store.state.discussion[0].comments.data;
                }
                return [];
            },

            commentsTotal () {
                if ( this.$store.state.discussion.length ) {
                    return this.$store.state.discussion[0].comments.meta.pagination.total;
                }
                return 0;
                
            }
        },
        components: {
            'pm-header': header,
            'new-discuss-form': new_discuss_form,
            'comment-form': comment_form,
        },

        methods: {
            deleteSelfComment (comment_id, commentable_id) {
                var self = this;
                var args = {
                    comment_id: comment_id,
                    commentable_id: commentable_id,
                    callback: function() {
                        
                    }
                }

                self.deleteComment(args);
            },

            getSelfDiscuss () {
                var self = this;
                var args = {
                    callback: function(res) {
                        self.loading = false;
                        NProgress.done();
                    }
                }
                self.getDiscuss(args);
            }
        }
    }

</script>
