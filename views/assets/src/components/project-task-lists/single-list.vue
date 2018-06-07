<template>
    <div class="pm-wrap pm pm-front-end">
        <pm-header></pm-header>

        <!-- Spinner before load task -->
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
 
        <div v-else>

            <router-link  
                class="pm-btn pm-btn-blue pm-margin-bottom add-tasklist"
                :to="{ 
                    name: 'task_lists', 
                    params: { 
                        project_id: project_id,
                    }
                }">

                <i class="fa fa-angle-left"></i>{{ __( 'Back to Task Lists', 'pm' ) }}
            </router-link>
            
            <div>
                <ul class="pm-todolists">

                    <li :class="'pm-fade-out-'+list_id">

                        <article class="pm-todolist">
                            <header class="pm-list-header">
                                <h3>
                                    {{ list.title }}
                                   
                                    <div class="pm-right" v-if="can_edit_task_list(list)">
                                        <a href="#" @click.prevent="showHideListForm('toggle', list)" class="pm-icon-edit"><span class="dashicons dashicons-edit"></span></a>
                                        <a href="#" class="pm-btn pm-btn-xs" @click.prevent="deleteSelfList()" :title="delete_task_list" ><span class="dashicons dashicons-trash"></span></a>
                                        <a href="#" @click.prevent="listLockUnlock(list)"  v-if="PM_Vars.is_pro && user_can('view_private_list')"><span :class="privateClass(list.meta.privacy)"></span> </a>
                                    </div>
                                </h3>

                                <div class="pm-entry-detail">
                                    {{ list.description }}
                                </div>

                               <transition name="slide" v-if="can_create_list">
                                    <div class="pm-update-todolist-form" v-if="list.edit_mode">
                                        <!-- New Todo list form -->
                                        <new-task-list-form :list="list" section="single"></new-task-list-form>
                                    </div>
                                </transition>
                            </header>

                            <!-- Todos component -->
                            <single-list-tasks :list="list" index="0"></single-list-tasks>

                            <footer class="pm-row pm-list-footer">
                                <div class="pm-col-6">

                                    <div v-if="can_create_task">
                                        <new-task-button :task="{}" :list="list" list_index="0"></new-task-button>
                                    </div>

                                </div>

                                <div class="pm-col-4">
                                    <div class="pm-todo-progress-bar">
                                        <div :style="getProgressStyle( list )" class="bar completed"></div>
                                    </div>
                                </div>
                                <div class=" pm-col-1 no-percent">{{ getProgressPercent(list) }}%</div>
                                <div class="clearfix"></div>
                            </footer>
                        </article>
                    </li>
                </ul>


                <list-comments :comments="comments" :list="list"></list-comments>
                <router-view name="single-task"></router-view>
            </div>
        </div>
    </div>

</template>

<script>
    
    import single_list_tasks from './single-list-tasks.vue';
    import list_comments from './list-comments.vue';
    import new_task_list_form from './new-task-list-form.vue';
    import new_task_button from './new-task-btn.vue';
    import header from './../common/header.vue';
    import Mixins from './mixin';

    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                
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
                //list: {},
                render_tmpl: false,
                task_id: parseInt(this.$route.params.task_id) ? this.$route.params.task_id : false, //for single task popup
                loading: true,
                delete_task_list: __( 'Delete List', 'pm' ),
               
            }
        },

        mixins: [Mixins],
        watch: {
            '$route' (to, from) {
                if(from.name == 'single_task') {
                    this.getIndividualList();
                    this.getGlobalMilestones();
                }
            }
        },
        /**
         * Initial action for this component
         * 
         * @return void
         */
        created: function() {
            this.getIndividualList();
            this.getGlobalMilestones();
            this.$store.state.projectTaskLists.is_single_list = true; 
            pmBus.$on('pm_before_destroy_single_task', this.afterDestroySingleTask);
            pmBus.$on('pm_generate_task_url', this.generateTaskUrl);
        },

        computed: {
            /**
             * Get todo lists from vuex store
             * 
             * @return array
             */
            list: function () {
                if( this.$store.state.projectTaskLists.lists.length) {
                    console.log(this.$store.state.projectTaskLists.lists[0]);
                    return this.$store.state.projectTaskLists.lists[0];
                }
            },

            /**
             * Get milestones from vuex store
             * 
             * @return array
             */
            milestones: function() {
                return this.$store.state.projectTaskLists.milestones;
            },

            comments () {
                if( this.$store.state.projectTaskLists.lists.length ) {
                    return this.$store.state.projectTaskLists.lists[0].comments.data;
                }
                
            },

            /**
             * Get initial data from vuex store when this component loaded
             * 
             * @return obj
             */
            init: function() {
                return this.$store.state.projectTaskLists.init;
            },

        },

        methods: {
            generateTaskUrl (task) {
                 var url = this.$router.resolve({
                    name: 'single_task',
                    params: {
                        task_id: task.id,
                        project_id: task.project_id,
                        list_id: task.task_list.data.id
                    }
                }).href;
                var url = PM_Vars.project_page + url;
                
                //var url = PM_Vars.project_page + '#/projects/' + task.project_id + '/task-lists/' +task.task_list.data.id+ '/tasks/' + task.id; 
                this.copy(url);
            },

            afterTaskDoneUndone (task) {
                this.$store.commit( 'projectTaskLists/afterTaskDoneUndone', {
                    status: task.status == 'complete' || task.status === true ? 1 : 0,
                    task: task,
                    list_id: task.task_list.data.id,
                    task_id: task.id
                });
            },
          
            afterDestroySingleTask (task) {

                this.setTaskDefaultData(task);
                this.$store.commit('projectTaskLists/afterUpdateTask', {
                    task: task,
                    list_id: task.task_list.data.id
                });
             
                this.$store.commit('projectTaskLists/updateSingleTaskActiveMode', false);
            },

            setTaskDefaultData (task) {
                var lists = this.$store.state.projectTaskLists.lists;
                var list_index = this.getIndex( lists, task.task_list.data.id, 'id' );
            
                if (list_index === false) {
                    return;
                }
                
                if ( task.status == 'incomplete' || task.status === false ) {
                    var task_index = this.getIndex( 
                            lists[list_index].incomplete_tasks.data, 
                            task.id, 
                            'id' 
                    );

                    if(task_index === false ) {
                        this.$store.commit('projectTaskLists/afterTaskDoneUndone', {
                            list_id: task.task_list.data.id,
                            task_id: task.id,
                            status: 0
                        });
                    } else {
                        var prevTask = lists[list_index].incomplete_tasks.data[task_index];

                        task.sub_task_content = typeof prevTask.sub_task_content == 'undefined' 
                            ? false : prevTask.sub_task_content;

                        task.edit_mode = prevTask.edit_mode;
                    }
                }

                if ( task.status == 'complete' || task.status === true ) {
                    var task_index = this.getIndex( 
                            lists[list_index].complete_tasks.data, 
                            task.id, 
                            'id' 
                    );

                    if(task_index === false) {
                        this.$store.commit('projectTaskLists/afterTaskDoneUndone', {
                            list_id: task.task_list.data.id,
                            task_id: task.id,
                            status: 1
                        });
                    } 
                }
            },
            
            /**
             * Get todo list for single todo list page
             * 
             * @param  int list_id 
             * 
             * @return void         
             */
            getIndividualList () {
                var self = this;
                var args = {
                    condition: {
                        with : 'incomplete_tasks,complete_tasks,comments'
                    },
                    list_id: this.list_id,
                    callback: function (res) {
                        self.$store.commit('projectTaskLists/setList', res.data);
                        self.loading = false; 
                    }
                }
                
                this.getList( args );
               
            },

            showEditForm (list ) {
                list.edit_mode = list.edit_mode ? false : true;
            },

            deleteSelfList () {
                var args = {
                    list_id: this.list_id,
                    callback: function (res) {
                        this.$router.push({
                            name: 'task_lists', 
                            params: { 
                                project_id: this.project_id,
                            }
                        });
                    }
                }

                this.deleteList(args);
            }
        },



        components: {
            'single-list-tasks': single_list_tasks,
            'list-comments': list_comments,
            'new-task-list-form': new_task_list_form,
            'new-task-button': new_task_button,
            'pm-header': header
        }
    }
</script>

