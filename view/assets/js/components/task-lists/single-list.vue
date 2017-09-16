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

                    <li :class="'cpm-fade-out-'+list.id">

                        <article class="cpm-todolist">
                            <header class="cpm-list-header">
                                <h3>
                                    <router-link :to="{ name: 'single-list', params: { list_id: list.ID }}">{{ list.title }}</router-link>
                                    <span :class="privateClass(list)"></span>
                                    <div class="cpm-right">
                                        <a href="#" @click.prevent="showEditForm( list )" class="cpm-icon-edit" title="<?php _e( 'Edit this List', 'cpm' ); ?>"><span class="dashicons dashicons-edit"></span></a>
                                        <a href="#" class="cpm-btn cpm-btn-xs" @click.prevent="deleteList( list.ID )" title="<?php _e( 'Delete this List', 'cpm' ); ?>" :data-list_id="list.ID" data-confirm="<?php _e( 'Are you sure to delete this task list?', 'cpm' ); ?>"><span class="dashicons dashicons-trash"></span></a>
                                    </div>
                                </h3>

                                <div class="cpm-entry-detail">
                                    {{ list.description }}
                                </div>

                                <!-- <div class="cpm-entry-detail">{{list.post_content}}</div> -->
                                <div class="cpm-update-todolist-form" v-if="list.edit_mode">
                                    <!-- New Todo list form -->
                                    <new-task-list-form :list="list" index="0"></new-task-list-form>
                                </div>
                            </header>

                            <!-- Todos component -->
                            <tasks :list="list" index="0"></tasks>

                            <footer class="cpm-row cpm-list-footer">
                                <div class="cpm-col-6">

                                    <div>
                                        <new-task-button :task="{}" :list="list" list_index="0"></new-task-button>
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
    </div>

</template>

<script>
    
    import tasks from './tasks.vue';
    import list_comments from './list-comments.vue';
    import new_task_list_form from './new-task-list-form.vue';
    import new_task_button from './new-task-btn.vue';

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

            showEditForm (list ) {
                console.log(list);
                list.edit_mode = list.edit_mode ? false : true;
            },
        },



        components: {
            tasks: tasks,
            'list-comments': list_comments,
            'new-task-list-form': new_task_list_form,
            'new-task-button': new_task_button
        }
    }
</script>

