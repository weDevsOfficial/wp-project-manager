<template>
	<div>
        <br />
<font size='1'><table class='xdebug-error xe-notice' dir='ltr' border='1' cellspacing='0' cellpadding='1'>
<tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! )</span> Notice: Undefined index: complete_task_page in /Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Task_List/Transformer/Task_List_Transformer.php on line <i>96</i></th></tr>
<tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack</th></tr>
<tr><th align='center' bgcolor='#eeeeec'>#</th><th align='left' bgcolor='#eeeeec'>Time</th><th align='left' bgcolor='#eeeeec'>Memory</th><th align='left' bgcolor='#eeeeec'>Function</th><th align='left' bgcolor='#eeeeec'>Location</th></tr>
<tr><td bgcolor='#eeeeec' align='center'>1</td><td bgcolor='#eeeeec' align='center'>0.2735</td><td bgcolor='#eeeeec' align='right'>362352</td><td bgcolor='#eeeeec'>{main}(  )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>0</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>2</td><td bgcolor='#eeeeec' align='center'>0.2740</td><td bgcolor='#eeeeec' align='right'>364288</td><td bgcolor='#eeeeec'>require( <font color='#00bb00'>'/Users/mishu/Documents/wedevs/api/wp-blog-header.php'</font> )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>17</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>3</td><td bgcolor='#eeeeec' align='center'>1.3637</td><td bgcolor='#eeeeec' align='right'>24053664</td><td bgcolor='#eeeeec'>wp(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-blog-header.php' bgcolor='#eeeeec'>.../wp-blog-header.php<b>:</b>16</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>4</td><td bgcolor='#eeeeec' align='center'>1.3637</td><td bgcolor='#eeeeec' align='right'>24053712</td><td bgcolor='#eeeeec'>WP->main(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/functions.php' bgcolor='#eeeeec'>.../functions.php<b>:</b>955</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>5</td><td bgcolor='#eeeeec' align='center'>1.3637</td><td bgcolor='#eeeeec' align='right'>24053712</td><td bgcolor='#eeeeec'>WP->parse_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>733</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>6</td><td bgcolor='#eeeeec' align='center'>1.3652</td><td bgcolor='#eeeeec' align='right'>24078632</td><td bgcolor='#eeeeec'>do_action_ref_array(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>386</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>7</td><td bgcolor='#eeeeec' align='center'>1.3652</td><td bgcolor='#eeeeec' align='right'>24078632</td><td bgcolor='#eeeeec'>WP_Hook->do_action(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>515</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>8</td><td bgcolor='#eeeeec' align='center'>1.3652</td><td bgcolor='#eeeeec' align='right'>24078632</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>323</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>9</td><td bgcolor='#eeeeec' align='center'>1.3653</td><td bgcolor='#eeeeec' align='right'>24079760</td><td bgcolor='#eeeeec'>rest_api_loaded(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>298</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>10</td><td bgcolor='#eeeeec' align='center'>1.4603</td><td bgcolor='#eeeeec' align='right'>24563784</td><td bgcolor='#eeeeec'>WP_REST_Server->serve_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>271</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>11</td><td bgcolor='#eeeeec' align='center'>1.4627</td><td bgcolor='#eeeeec' align='right'>24567480</td><td bgcolor='#eeeeec'>WP_REST_Server->dispatch(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>329</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>12</td><td bgcolor='#eeeeec' align='center'>1.4707</td><td bgcolor='#eeeeec' align='right'>24711912</td><td bgcolor='#eeeeec'>CPM\Task_List\Controllers\Task_List_Controller->show(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>947</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>13</td><td bgcolor='#eeeeec' align='center'>1.4882</td><td bgcolor='#eeeeec' align='right'>24803128</td><td bgcolor='#eeeeec'>CPM\Task_List\Controllers\Task_List_Controller->get_response(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Task_List/Controllers/Task_List_Controller.php' bgcolor='#eeeeec'>.../Task_List_Controller.php<b>:</b>47</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>14</td><td bgcolor='#eeeeec' align='center'>1.4976</td><td bgcolor='#eeeeec' align='right'>24989648</td><td bgcolor='#eeeeec'>League\Fractal\Scope->toArray(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Transformer_Manager.php' bgcolor='#eeeeec'>.../Transformer_Manager.php<b>:</b>20</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>15</td><td bgcolor='#eeeeec' align='center'>1.4976</td><td bgcolor='#eeeeec' align='right'>24989648</td><td bgcolor='#eeeeec'>League\Fractal\Scope->executeResourceTransformers(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/vendor/league/fractal/src/Scope.php' bgcolor='#eeeeec'>.../Scope.php<b>:</b>235</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>16</td><td bgcolor='#eeeeec' align='center'>1.4976</td><td bgcolor='#eeeeec' align='right'>24989648</td><td bgcolor='#eeeeec'>League\Fractal\Scope->fireTransformer(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/vendor/league/fractal/src/Scope.php' bgcolor='#eeeeec'>.../Scope.php<b>:</b>346</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>17</td><td bgcolor='#eeeeec' align='center'>1.5944</td><td bgcolor='#eeeeec' align='right'>25431160</td><td bgcolor='#eeeeec'>League\Fractal\Scope->fireIncludedTransformers(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/vendor/league/fractal/src/Scope.php' bgcolor='#eeeeec'>.../Scope.php<b>:</b>411</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>18</td><td bgcolor='#eeeeec' align='center'>1.5944</td><td bgcolor='#eeeeec' align='right'>25431160</td><td bgcolor='#eeeeec'>League\Fractal\TransformerAbstract->processIncludedResources(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/vendor/league/fractal/src/Scope.php' bgcolor='#eeeeec'>.../Scope.php<b>:</b>435</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>19</td><td bgcolor='#eeeeec' align='center'>1.6206</td><td bgcolor='#eeeeec' align='right'>25538192</td><td bgcolor='#eeeeec'>League\Fractal\TransformerAbstract->includeResourceIfAvailable(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/vendor/league/fractal/src/TransformerAbstract.php' bgcolor='#eeeeec'>.../TransformerAbstract.php<b>:</b>127</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>20</td><td bgcolor='#eeeeec' align='center'>1.6206</td><td bgcolor='#eeeeec' align='right'>25538192</td><td bgcolor='#eeeeec'>League\Fractal\TransformerAbstract->callIncludeMethod(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/vendor/league/fractal/src/TransformerAbstract.php' bgcolor='#eeeeec'>.../TransformerAbstract.php<b>:</b>156</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>21</td><td bgcolor='#eeeeec' align='center'>1.6206</td><td bgcolor='#eeeeec' align='right'>25538696</td><td bgcolor='#eeeeec'><a href='http://www.php.net/function.call-user-func:{/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/vendor/league/fractal/src/TransformerAbstract.php:190}' target='_new'>call_user_func:{/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/vendor/league/fractal/src/TransformerAbstract.php:190}</a>
(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/vendor/league/fractal/src/TransformerAbstract.php' bgcolor='#eeeeec'>.../TransformerAbstract.php<b>:</b>190</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>22</td><td bgcolor='#eeeeec' align='center'>1.6206</td><td bgcolor='#eeeeec' align='right'>25538696</td><td bgcolor='#eeeeec'>CPM\Task_List\Transformer\Task_List_Transformer->includeCompleteTasks(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/vendor/league/fractal/src/TransformerAbstract.php' bgcolor='#eeeeec'>.../TransformerAbstract.php<b>:</b>190</td></tr>
</table></font>
        <!-- Spinner before load task -->
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
            <router-link class="cpm-btn cpm-btn-blue cpm-margin-bottom add-tasklist" to="/"><i class="fa fa-angle-left"></i>Back to Task Lists</router-link>

            <div v-if="render_tmpl">
                <ul class="cpm-todolists">

                    <li v-for="( list, index ) in lists" :key="list.ID"  :class="'cpm-fade-out-'+list.ID">

                        <article class="cpm-todolist">
                            <header class="cpm-list-header">
                                <h3>
                                    <router-link :to="{ name: 'single-list', params: { list_id: list.ID }}">{{ list.post_title }}</router-link>
                                    <span :class="privateClass(list)"></span>
                                    <div class="cpm-right">
                                        <a href="#" @click.prevent="showHideTodoListForm( list, index )" class="cpm-icon-edit" title="<?php _e( 'Edit this List', 'cpm' ); ?>"><span class="dashicons dashicons-edit"></span></a>
                                        <a href="#" class="cpm-btn cpm-btn-xs" @click.prevent="deleteList( list.ID )" title="<?php _e( 'Delete this List', 'cpm' ); ?>" :data-list_id="list.ID" data-confirm="<?php _e( 'Are you sure to delete this task list?', 'cpm' ); ?>"><span class="dashicons dashicons-trash"></span></a>
                                    </div>
                                </h3>

                                <div class="cpm-entry-detail">
                                    {{ list.post_content }}
                                </div>

                                <!-- <div class="cpm-entry-detail">{{list.post_content}}</div> -->
                                <div class="cpm-update-todolist-form" v-if="list.edit_mode">
                                    <!-- New Todo list form -->
                                    <todo-list-form :list="list" :index="index"></todo-list-form>
                                </div>
                            </header>

                            <!-- Todos component -->
                            <tasks :list="list" :index="index"></tasks>

                            <footer class="cpm-row cpm-list-footer">
                                <div class="cpm-col-6">

                                    <div v-if="canUserCreateTask">
                                        <new-task-button :task="{}" :list="list" :list_index="index"></new-task-button>
                                    </div>

                                </div>

                                <div class="cpm-col-4 cpm-todo-prgress-bar">
                                    <div :style="getProgressStyle(list)" class="bar completed"></div>
                                </div>
                                <div class=" cpm-col-1 no-percent">{{ getProgressPercent(list) }}%</div>
                                <div class="clearfix"></div>
                            </footer>
                        </article>
                    </li>
                </ul>
                <router-view name="single_task"></router-view>
                <list-comments :comments="comments" :list="comment_list"></list-comments>
            </div>
        </div>
        <router-view name="single_task"></router-view>
    </div>

</template>

<script>
    
    import tasks from './tasks.vue';
    import list_comments from './list-comments.vue';

    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getList(vm);
            });
        },
        /**
         * Initial data for this component
         * 
         * @return obj
         */
        data: function() {
            return {
                list_id: this.$route.params.list_id,
                list: {},
                render_tmpl: false,
                task_id: parseInt(this.$route.params.task_id) ? this.$route.params.task_id : false, //for single task popup
                loading: true
            }
        },


        /**
         * Initial action for this component
         * 
         * @return void
         */
        created: function() {
            this.loading = false;
            this.render_tmpl = true;
            this.$store.state.is_single_list = true;
            return;
            var self = this;
            
            this.$store.commit('emptyTodoLists');
            
            // Get todo list 
            this.getList( this.$route.params.list_id, function(res) {
                self.loading = false;
            });
        },

        computed: {
            /**
             * Get todo lists from vuex store
             * 
             * @return array
             */
            lists: function () {
                return this.$store.state.lists;
            },

            /**
             * Get milestones from vuex store
             * 
             * @return array
             */
            milestones: function() {
                return this.$store.state.milestones;
            },

            /**
             * Get initial data from vuex store when this component loaded
             * 
             * @return obj
             */
            init: function() {
                return this.$store.state.init;
            },

            comments: function() {
                if ( this.$store.state.lists.length ) {
                    return this.$store.state.lists[0].comments;
                }

                return [];
            },

            comment_list: function() {
                if ( this.$store.state.lists.length ) {
                    return this.$store.state.lists[0];
                }

                return {};
            }

        },

        methods: {
            //cpm/v2/projects/1/task-lists/6?with=tasks,comments,complete_tasks,incomplete_tasks&comment_page=1&complete_task_page=1&incomplete_task_page=1
            /**
             * Get todo list for single todo list page
             * 
             * @param  int list_id 
             * 
             * @return void         
             */
            getList: function(self) {
                
                var list_id = self.$route.params.list_id;
                var request = {
                    url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/task-lists/'+list_id+'?with=incomplete_tasks,complete_tasks',
                    success (res) {
                        self.list = res.data;
                    }
                };
                self.httpRequest(request);
                
                // var self      = this,
                //     form_data = {
                //         list_id: list_id,
                //         action: 'cpm_get_todo_list_single',
                //         project_id: PM_Vars.project_id,
                //         _wpnonce: PM_Vars.nonce,
                //     };

                // // Sending request for getting singel todo list 
                // jQuery.post( PM_Vars.ajaxurl, form_data, function( res ) {

                //     if ( res.success ) {

                //         // After getting todo list, set it to vuex state lists
                //         self.$store.commit( 'update_todo_list_single', { 
                //             list: res.data.list,
                //             permissions: res.data.permissions,
                //             milestones: res.data.milestones,
                //             project_users: res.data.project_users
                //         });

                //         self.render_tmpl = true;

                //         if ( typeof callback != 'undefined'  ) {
                //             callback(res);
                //         }
                //     } 
                // });
            },
        },

        components: {
            tasks: tasks,
            'list-comments': list_comments
        }
    }
</script>

