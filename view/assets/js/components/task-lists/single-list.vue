<template>
	<div>
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
        /**
         * Initial data for this component
         * 
         * @return obj
         */
        data: function() {
            return {
                list_id: this.$route.params.list_id,
                list: this.$store.state.lists[0],
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
             * Get current project id from vuex store
             * 
             * @return int
             */
            project_id: function() {
                return this.$store.state.project_id;
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
            /**
             * Get todo list for single todo list page
             * 
             * @param  int list_id 
             * 
             * @return void         
             */
            getList: function( list_id, callback ) {
                
                var self      = this,
                    form_data = {
                        list_id: list_id,
                        action: 'cpm_get_todo_list_single',
                        project_id: PM_Vars.project_id,
                        _wpnonce: PM_Vars.nonce,
                    };

                // Sending request for getting singel todo list 
                jQuery.post( PM_Vars.ajaxurl, form_data, function( res ) {

                    if ( res.success ) {

                        // After getting todo list, set it to vuex state lists
                        self.$store.commit( 'update_todo_list_single', { 
                            list: res.data.list,
                            permissions: res.data.permissions,
                            milestones: res.data.milestones,
                            project_users: res.data.project_users
                        });

                        self.render_tmpl = true;

                        if ( typeof callback != 'undefined'  ) {
                            callback(res);
                        }
                    } 
                });
            },
        },

        components: {
            tasks: tasks,
            'list-comments': list_comments
        }
    }
</script>

