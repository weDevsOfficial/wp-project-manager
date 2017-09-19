<template>
	<div class="wrap cpm cpm-front-end">

        <pm-header></pm-header>
<br />
<font size='1'><table class='xdebug-error xe-notice' dir='ltr' border='1' cellspacing='0' cellpadding='1'>
<tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! )</span> Notice: Undefined variable: boardable in /Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Discussion_Board/Controllers/Discussion_Board_Controller.php on line <i>117</i></th></tr>
<tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack</th></tr>
<tr><th align='center' bgcolor='#eeeeec'>#</th><th align='left' bgcolor='#eeeeec'>Time</th><th align='left' bgcolor='#eeeeec'>Memory</th><th align='left' bgcolor='#eeeeec'>Function</th><th align='left' bgcolor='#eeeeec'>Location</th></tr>
<tr><td bgcolor='#eeeeec' align='center'>1</td><td bgcolor='#eeeeec' align='center'>0.2636</td><td bgcolor='#eeeeec' align='right'>359784</td><td bgcolor='#eeeeec'>{main}(  )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>0</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>2</td><td bgcolor='#eeeeec' align='center'>0.2638</td><td bgcolor='#eeeeec' align='right'>361720</td><td bgcolor='#eeeeec'>require( <font color='#00bb00'>'/Users/mishu/Documents/wedevs/api/wp-blog-header.php'</font> )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>17</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>3</td><td bgcolor='#eeeeec' align='center'>0.6099</td><td bgcolor='#eeeeec' align='right'>24056456</td><td bgcolor='#eeeeec'>wp(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-blog-header.php' bgcolor='#eeeeec'>.../wp-blog-header.php<b>:</b>16</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>4</td><td bgcolor='#eeeeec' align='center'>0.6099</td><td bgcolor='#eeeeec' align='right'>24056504</td><td bgcolor='#eeeeec'>WP->main(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/functions.php' bgcolor='#eeeeec'>.../functions.php<b>:</b>955</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>5</td><td bgcolor='#eeeeec' align='center'>0.6099</td><td bgcolor='#eeeeec' align='right'>24056504</td><td bgcolor='#eeeeec'>WP->parse_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>733</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>6</td><td bgcolor='#eeeeec' align='center'>0.6105</td><td bgcolor='#eeeeec' align='right'>24081528</td><td bgcolor='#eeeeec'>do_action_ref_array(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>386</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>7</td><td bgcolor='#eeeeec' align='center'>0.6105</td><td bgcolor='#eeeeec' align='right'>24081528</td><td bgcolor='#eeeeec'>WP_Hook->do_action(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>515</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>8</td><td bgcolor='#eeeeec' align='center'>0.6105</td><td bgcolor='#eeeeec' align='right'>24081528</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>323</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>9</td><td bgcolor='#eeeeec' align='center'>0.6105</td><td bgcolor='#eeeeec' align='right'>24082656</td><td bgcolor='#eeeeec'>rest_api_loaded(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>298</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>10</td><td bgcolor='#eeeeec' align='center'>0.6439</td><td bgcolor='#eeeeec' align='right'>24566680</td><td bgcolor='#eeeeec'>WP_REST_Server->serve_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>271</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>11</td><td bgcolor='#eeeeec' align='center'>0.6451</td><td bgcolor='#eeeeec' align='right'>24570664</td><td bgcolor='#eeeeec'>WP_REST_Server->dispatch(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>329</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>12</td><td bgcolor='#eeeeec' align='center'>0.6471</td><td bgcolor='#eeeeec' align='right'>24715104</td><td bgcolor='#eeeeec'>CPM\Discussion_Board\Controllers\Discussion_Board_Controller->update(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>947</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>13</td><td bgcolor='#eeeeec' align='center'>0.6622</td><td bgcolor='#eeeeec' align='right'>25143456</td><td bgcolor='#eeeeec'>CPM\Discussion_Board\Controllers\Discussion_Board_Controller->attach_milestone(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Discussion_Board/Controllers/Discussion_Board_Controller.php' bgcolor='#eeeeec'>.../Discussion_Board_Controller.php<b>:</b>83</td></tr>
</table></font>
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

            <h3>{{ commentsTotal }} Comments</h3>

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
                                    <a href="#" class="cpm-edit-comment-link dashicons dashicons-edit " data-comment_id="309" data-project_id="60" data-object_id="97"></a>
                                </span>

                                <span class="cpm-delete-link">
                                    <a href="#" class="cpm-delete-comment-link dashicons dashicons-trash" data-project_id="60" data-id="309" data-confirm="Are you sure to delete this comment?"></a>
                                </span>
                            </div>
                        </div>
                        <div class="cpm-comment-content">
                            <div v-html="comment.content"></div>
                        </div>

                        <div class="cpm-comment-edit-form"></div>
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
                return this.$store.state.discuss;
            },
            comments () {
                return this.$store.state.comments.data;
            },

            commentsTotal () {
               
                if ( ! jQuery.isEmptyObject( this.$store.state.comments.meta ) ) {
                    return this.$store.state.comments.meta.pagination.total;
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
