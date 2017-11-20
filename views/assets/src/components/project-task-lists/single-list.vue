<template>
    <div>
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

                <i class="fa fa-angle-left"></i>{{text.back_to_task_lists}}
            </router-link>
            
            <div>
                <ul class="pm-todolists">

                    <li :class="'pm-fade-out-'+list_id">

                        <article class="pm-todolist">
                            <header class="pm-list-header">
                                <h3>
                                    {{ list.title }}
                                    <span :class="privateClass(list)"></span>
                                    <div class="pm-right">
                                        <a href="#" @click.prevent="showHideListForm('toggle', list)" class="pm-icon-edit" title="<?php _e( 'Edit this List', 'pm' ); ?>"><span class="dashicons dashicons-edit"></span></a>
                                        <a href="#" class="pm-btn pm-btn-xs" @click.prevent="deleteList( list.id )" :title="text.delete_list" ><span class="dashicons dashicons-trash"></span></a>
                                    </div>
                                </h3>

                                <div class="pm-entry-detail">
                                    {{ list.description }}
                                </div>

                                <!-- <div class="pm-entry-detail">{{list.post_content}}</div> -->
                                <div class="pm-update-todolist-form" v-if="list.edit_mode">
                                    <!-- New Todo list form -->
                                    <new-task-list-form :list="list" section="single"></new-task-list-form>
                                </div>
                            </header>

                            <!-- Todos component -->
                            <single-list-tasks :list="list" index="0"></single-list-tasks>

                            <footer class="pm-row pm-list-footer">
                                <div class="pm-col-6">

                                    <div>
                                        <new-task-button :task="{}" :list="list" list_index="0"></new-task-button>
                                    </div>

                                </div>

                                <div class="pm-col-4 pm-todo-prgress-bar">
                                    <div :style="getProgressStyle(list)" class="bar completed"></div>
                                </div>
                                <div class=" pm-col-1 no-percent">{{ getProgressPercent(list) }}%</div>
                                <div class="clearfix"></div>
                            </footer>
                        </article>
                    </li>
                </ul>

                <router-view name="single-task"></router-view>

                <list-comments :comments="comments" :list="list"></list-comments>
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

    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getIndividualList();
                vm.getGlobalMilestones();
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
               
            }
        },

        mixins: [PmMixin.projectTaskLists],
        /**
         * Initial action for this component
         * 
         * @return void
         */
        created: function() {
            this.$store.state.is_single_list = true; 
        },

        computed: {
            /**
             * Get todo lists from vuex store
             * 
             * @return array
             */
            list: function () {
                if( this.$store.state.lists.length) {
                    return this.$store.state.lists[0];
                }
            },

            /**
             * Get milestones from vuex store
             * 
             * @return array
             */
            milestones: function() {
                return this.$store.state.milestones;
            },

            comments () {
                if( this.$store.state.lists.length ) {
                    return this.$store.state.lists[0].comments.data;
                }
                
            },

            /**
             * Get initial data from vuex store when this component loaded
             * 
             * @return obj
             */
            init: function() {
                return this.$store.state.init;
            },

        },

        methods: {
            
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
                        self.$store.commit('setList', res.data);
                        self.loading = false; 
                    }
                }
                
                this.getList( args );
               
            },

            showEditForm (list ) {
                list.edit_mode = list.edit_mode ? false : true;
            },
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

