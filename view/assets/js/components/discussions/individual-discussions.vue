<template>
	<div class="wrap cpm cpm-front-end">

        <pm-header></pm-header>

        <div id="cpm-signle-message"> 
            <div class="cpm-single">

                <h3 class="cpm-box-title">
                    {{discuss.title}}          
                    <span class="cpm-right cpm-edit-link">
                        <a @click.prevent="showHideDiscussForm('toggle', discuss)" href="#" data-msg_id="97" data-project_id="60" class="cpm-msg-edit dashicons dashicons-edit"></a>
                        <span class="cpm-not-private"></span>
                    </span>
                    <div class="cpm-small-title">
                        By 
                        <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">
                            admin
                        </a> on September 11, 2017  at  01:34 pm            
                    </div>
                </h3>
                <div class="cpm-entry-detail">
                    <div v-html="discuss.description"></div>
                </div>
                <span class="cpm-msg-edit-form">
                    <div class="cpm-message-form-wrap">
                        <new-discuss-form v-if="discuss.edit_mode" :discuss="discuss"></new-discuss-form>
                    </div>
                </span>
            </div>
        </div>

        <div class="cpm-comment-area cpm-box-shadow">

            <h3> {{ commentsTotal }} Comments</h3>

            <ul class="cpm-comment-wrap">

                <li v-for="comment in comments" class="cpm-comment clearfix even" id="cpm-comment-309">
                    <div class="cpm-avatar ">
                        <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">
                            <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">
                        </a>
                    </div>
                    <div class="cpm-comment-container">
                        <div class="cpm-comment-meta">
                            <span class="cpm-author">
                                <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">
                                    admin
                                </a>
                            </span>
                            On            
                            <span class="cpm-date">
                                <time datetime="2017-09-11T13:34:37+00:00" title="2017-09-11T13:34:37+00:00">September 11, 2017 1:34 pm</time>
                            </span>

                            <div class="cpm-comment-action">
                                <span class="cpm-edit-link">
                                    <a @click.prevent="showHideCommentForm('toggle', comment)" href="#" class="cpm-edit-comment-link dashicons dashicons-edit " data-comment_id="309" data-project_id="60" data-object_id="97"></a>
                                </span>

                                <span class="cpm-delete-link">
                                    <a href="#" class="cpm-delete-comment-link dashicons dashicons-trash" data-project_id="60" data-id="309" data-confirm="Are you sure to delete this comment?"></a>
                                </span>
                            </div>
                        </div>
                        <div class="cpm-comment-content">
                            <div v-html="comment.content"></div>
                        </div>

                        <div class="cpm-comment-edit-form">
                            <comment-form v-if="comment.edit_mode" :comment="comment" :discuss="discuss"></comment-form>
                        </div>
                    </div>

                </li>
            </ul>
            
            <div class="cpm-comment-form-wrap">
                <div class="cpm-avatar"><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin"><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48"></a></div>
                <comment-form :comment="{}" :discuss="discuss"></comment-form>
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
                vm.getDiscuss(vm);
                vm.getMilestones(vm);
            });
        },
        computed: {
            discuss () {
                if ( this.$store.state.discussion.length ) {
                    return this.$store.state.discussion[0];
                }

                return {};
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
        }
    }

</script>
