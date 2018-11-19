<template>
    <div class="pm-wrap pm-front-end">

        <pm-header></pm-header>
        <pm-heder-menu></pm-heder-menu>

        <div v-if="loading" class="pm-data-load-before" >
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

        <div class="pm-individual-discussion" v-else>
            <div v-if="discuss" id="pm-signle-message"> 
                <div class="pm-single">
                    <h3 class="pm-box-title">
                        {{discuss.title}}          
                        <span class="pm-right pm-edit-link">
                            <span v-if="can_edit_message(discuss)" >
                                <a @click.prevent="showHideDiscussForm('toggle', discuss)" href="#"  class="pm-msg-edit dashicons dashicons-edit"></a>
                            </span>
                            
                            <span v-if="PM_Vars.is_pro && user_can('view_private_message')" @click.prevent="lockUnlock(discuss)"  :class="privateClass( discuss )"></span>
                        </span>

                        <div class="pm-small-title">
                            {{ __( 'By', 'wedevs-project-manager') }}
                            <a :href="myTaskRedirect(discuss.creator.data.id)" :title="discuss.creator.data.display_name">
                                {{ discuss.creator.data.display_name }}
                            </a> {{ __( 'on', 'wedevs-project-manager') }} {{ taskDateFormat(discuss.created_at.date) }}, {{ dateTimeFormat(discuss.created_at.timestamp) }}            
                        </div>
                    </h3>
                    <div class="pm-entry-detail">
                        <div v-html="discuss.description"></div>

                        <ul class="pm-attachments" v-if="discuss.files.data.length">
                            <li v-for="file in discuss.files.data" :key="file.id">
                                <pm-file :file="file" />
                            </li>
                        </ul>

                    </div>
                    <transition name="slide" v-if="can_edit_message(discuss)" >
                        <new-discuss-form v-if="discuss.edit_mode" :discuss="discuss"></new-discuss-form>
                    </transition>
                </div>
            </div>

            <div v-if="discuss" class="pm-comment-area pm-box-shadow">
                <h3> {{ discuss.meta.total_comments }} {{ __( 'Comments', 'wedevs-project-manager') }}</h3>
                <ul class="pm-comment-wrap" v-if="comments.length">

                    <li v-for="comment in comments" class="pm-comment clearfix even" :id="'pm-comment-' + comment.id" :key="comment.id">
                        <div class="pm-avatar ">
                            <a :href="myTaskRedirect(comment.creator.data.id)" :title="comment.creator.data.display_name">
                                <img :alt="comment.creator.data.display_name" :src="comment.creator.data.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                            </a>
                        </div>
                        <div class="pm-comment-container">
                            <div class="pm-comment-meta">
                                <span class="pm-author">
                                    <a :href="myTaskRedirect(comment.creator.data.id)" :title="comment.creator.data.display_name">
                                        {{ comment.creator.data.display_name }}
                                    </a>
                                </span>
                                {{ __( 'on', 'wedevs-project-manager') }}           
                                <span class="pm-date">

                                     <time :datetime="getFullDate( comment.created_at.datetime )" :title="getFullDate( comment.created_at.datetime )">{{ relativeDate(comment.created_at.datetime) }}</time>
                                    
                                </span>

                                <div class="pm-comment-action" v-if="can_edit_comment(comment)" >
                                    <span class="pm-edit-link">
                                        <a @click.prevent="showHideDiscussCommentForm('toggle', comment)" href="#" class="pm-edit-comment-link dashicons dashicons-edit "></a>
                                    </span>

                                    <span class="pm-delete-link">
                                        <a href="#" class="pm-delete-comment-link dashicons dashicons-trash" @click.prevent="deleteSelfComment(comment.id, discuss.id)"></a>
                                    </span>
                                </div>
                            </div>
                            <div class="pm-comment-content">
                                <div v-html="comment.content"></div>

                                <ul class="pm-attachments" v-if="comment.files.data.length">
                                    <li v-for="file in comment.files.data" :key="file.id">
                                        <pm-file :file="file" />
                                    </li>
                                </ul>

                            </div>

                            <transition name="slide" v-if="can_edit_comment(comment)" >
                               <comment-form v-if="comment.edit_mode" :comment="comment" :discuss="discuss"></comment-form> 
                            </transition>
                        </div>
                    </li>
                </ul>
                
                <div class="pm-comment-form-wrap">
                    <div class="pm-avatar">
                        <a :href="myTaskRedirect(current_user.ID)" :title="current_user.data.display_name">
                            <img :alt="current_user.data.display_name" :src="avatar_url" :srcset="avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                        </a>
                    </div>
                    <transition name="slide">
                        <comment-form :comment="{}" :discuss="discuss"></comment-form>
                    </transition>
                </div>
            </div>            
        </div>
            
    </div>
</template>

<style lang="less">
    .pm-individual-discussion {
        margin-top: 10px;
    }
    
    .pm-content-img-size {
        height: 80px;
        width: 80px;
    }
    .pm-individual-discussion {
        .pm-comment-form-wrap {
            margin-top: 10px;
        }
    }

    

</style>

<script>
    import header from './../common/header.vue';
    import new_discuss_form from './new-discuss-form.vue';
    import comment_form from './comment-form.vue';
    import Mixins from './mixin';

    export default {
        beforeRouteEnter (to, from, next) {

            next(vm => {
                vm.getSelfDiscuss();
                vm.getGlobalMilestones();
            });
        },
        mixins: [Mixins],
        data(){
            return{
                loading: true,
            }
        },
        created () {
            //console.log(this.$route);
        },
        computed: {
            discuss () {
                if ( this.$store.state.projectDiscussions.discussion.length ) {
                    return this.$store.state.projectDiscussions.discussion[0];
                }

                return false;
            },
            files() {
                if ( this.$store.state.projectDiscussions.discussion.length ) {
                    return this.$store.state.projectDiscussions.discussion[0].files.data;
                }
                return [];
            },
            comments () {
                if ( 
                    this.$store.state.projectDiscussions.discussion.length 
                        &&
                    this.$store.state.projectDiscussions.discussion[0].hasOwnProperty('comments')
                ) {
                    return this.$store.state.projectDiscussions.discussion[0].comments.data;
                }
                return [];
            },

            commentsTotal () {
                if ( this.$store.state.projectDiscussions.discussion.length ) {
                    return this.$store.state.projectDiscussions.discussion[0].comments.meta.pagination.total;
                }
                return 0;
                
            },
            can_create () {
                if ( typeof this.$store.state.projectDiscussions.discussion[0].meta.permission === 'undefined' ){
                    return false;
                }
                return this.$store.state.projectDiscussions.discussion[0].meta.permission.can_create;
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
                        pm.NProgress.done();
                    }
                }
                self.getDiscuss(args);
            },

            commentImgSize (comment) {
                return comment.edit_mode ? 'pm-comment-img-size' : '';
            }
        }
    }

</script>
