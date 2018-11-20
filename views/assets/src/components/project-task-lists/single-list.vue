<template>
    <div class="pm-wrap pm pm-front-end">
        <pm-header></pm-header>
        <pm-menu></pm-menu>

        <div v-if="!loading" class="single-list-content">
            <router-link  
                class="list-back-btn pm-button pm-secondary"
                :to="{ 
                    name: 'task_lists', 
                    params: { 
                        project_id: project_id,
                    }
                }">

                <span class="icon-pm-left-arrow"></span>
                <span class="title">{{ __( 'Back to Task Lists', 'wedevs-project-manager') }}</span>
            </router-link>

            <div class="title-wrp">
                <div class="title">
                    <span>{{ list.title }}</span>
                    
                </div>
                <div class="list-actions">
                    <div class="list-title-action progress-bar">
                        <div :style="getProgressStyle( list )" class="bar completed"></div>
                    </div>
                    <div class="list-title-action task-count">
                        <span>{{ list.meta.total_complete_tasks }}</span>/<span>{{ getTotalTask(list.meta.total_complete_tasks, list.meta.total_incomplete_tasks) }}</span>
                    </div>
                    <div v-if="!isInbox(list.id)" class="list-title-action">
                        <span v-if="!parseInt(list.meta.privacy) && user_can('view_private_task')" class="icon-pm-unlock"></span>
                        <span v-if="parseInt(list.meta.privacy) && user_can('view_private_task')" class="icon-pm-private"></span>
                    </div>
                </div>

                <div v-if="!isInbox(list.id) && can_edit_task_list(list)" :data-list_id="list.id" @click="showHideMoreMenu(list)" class="more-menu list-more-menu">

                    <span  class="icon-pm-more-options"></span>
                    <div v-if="list.moreMenu && !list.edit_mode"  class="more-menu-ul-wrap">
                        <ul>
                            <li class="first-li" v-if="!isArchivedList(list)">
                                <a @click.prevent="showEditForm(list)" class="li-a" href="#">
                                    <span class="icon-pm-pencil"></span>
                                    <span>{{ __('Edit', 'wedevs-project-manager') }}</span>
                                </a>
                            </li>
                            <li>
                                <a @click.prevent="deleteSelfList( list )" class="li-a" href="#">
                                    <span class="icon-pm-delete"></span>
                                    <span>{{ __('Delete', 'wedevs-project-manager') }}</span>
                                </a>
                            </li>
                            <pm-do-action hook="list-action-menu" :actionData="list"></pm-do-action>

                        </ul>
                    </div>

                    <div v-if="list.edit_mode" class="list-update-warp">
                         <new-task-list-form section="lists" :list="list" ></new-task-list-form>
                    </div>
                </div>
            </div>

            <div class="description">
                <span>{{ list.description }}</span>
            </div>

            <list-tasks :list="list"></list-tasks>
            <div class="list-comments-wrap">
                <div class="discuss-text">{{ __( 'Discussion', 'wedevs-project-manager') }}</div>
                <list-comments :comments="comments" :commentable="list"></list-comments>
            </div>
            
        </div>
        
        <!-- <div v-if="loading" class="pm-data-load-before" >
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

                <i class="fa fa-arrow-circle-o-left mr-5"></i>{{ __( 'Back to Task Lists', 'wedevs-project-manager') }}
            </router-link>
            
            <div>
                <ul class="pm-todolists">

                    <li :class="'pm-fade-out-'+list_id">

                        <article class="pm-todolist">
                            <header class="pm-list-header">
                                <h3>
                                    {{ list.title }}
                                   
                                    <div class="pm-right" v-if="can_edit_task_list(list)">
                                        <a href="#" v-if="!isArchivedListComponent" @click.prevent="showHideListForm('toggle', list)" class="pm-icon-edit"><span class="dashicons dashicons-edit"></span></a>
                                        <a href="#"  class="pm-btn pm-btn-xs" @click.prevent="deleteSelfList()" :title="delete_task_list" ><span class="dashicons dashicons-trash"></span></a>
                                        <a href="#" @click.prevent="listLockUnlock(list)"  v-if="PM_Vars.is_pro && user_can('view_private_list')"><span :class="privateClass(list.meta.privacy)"></span> </a>
                                    </div>
                                </h3>

                                <div class="pm-entry-detail">
                                    {{ list.description }}
                                </div>

                               <transition name="slide" v-if="can_create_list || !isArchivedListComponent">
                                    <div class="pm-update-todolist-form" v-if="list.edit_mode">
                                        
                                        <new-task-list-form :list="list" section="single"></new-task-list-form>
                                    </div>
                                </transition>
                            </header>


                            <single-list-tasks :list="list" index="0"></single-list-tasks>

                            <footer class="pm-row pm-list-footer">
                                <div class="pm-col-6">

                                    <div v-if="can_create_task && !isArchivedList(list)">
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
        </div> -->
    </div>

</template>

<style lang="less">
    .margin-left() {
        margin-left: 20px;
        margin-right: 20px;
    }
    .single-list-content {
        background: #FAFAFA;
        border-bottom: 1px solid #e5e4e4;
        border-left: 1px solid #e5e4e4;
        border-right: 1px solid #e5e4e4;
        word-break: break-all;
        hyphens: auto;

        .list-comments-wrap {
            .margin-left();
            margin-bottom: 20px;
           
            .pm-comment-edit-form {
                margin-right: 28px !important;
            }
            .pm-comment-form {
                width: 99.9%;
                .comment-submit {
                    margin-right: 6px !important;
                }
                .pm-button-nofity-user {
                    margin-left: 6px !important;
                }
                .comment-submit-btn {
                    margin-top: 6px !important;
                }
            }
            
            .comment-content {
                border: none;
                padding: 14px 0 0 1px;
                .pm-attachment-items {
                    .pm-uploaded-item {
                        padding: 10px 10px 0 0;
                        margin: 0;
                    }
                }

                .pm-popup-menu {
                    width: auto !important;
                    white-space: nowrap;
                }

                .pm-comment-edit-form {
                    .attach-text {
                        margin-bottom: 0;
                    }
                }
                .comment-field-content {
                    padding: 5px 0 0 0 ;
                    .comment-field {
                        width: 94.5%;
                    }
                    .comment-field-avatar {
                        margin-right: 20px;
                    }
                }
            }
            .discuss-text {
                margin: 10px 0;
                margin-top: 35px;
                font-size: 14px;
                font-weight: bold;
                color: #000000;
            }
        }

        .task-group {
            
            .incomplete-task-li {
                .pm-todo-wrap {
                    margin-left: 4px;
                    .todo-content {
                        margin-right: 20px;
                        .icon-pm-more-options {
                            padding-right: 10px;
                        }
                    }
                    .task-update-wrap {
                        width: auto;
                        margin: 0 17px 0 14px;
                    }
                }
            }

            .pm-task-form {
                .update-button {
                    background: #d7dee2 !important;
                    &:hover {
                        background: #b7bdc0 !important;
                    }
                }
            }
            
            .more-task-wrap, .list-task-form {
                .margin-left();
            }
            .complete-task-li {
                .pm-todo-wrap {
                    margin-left: 22px;
                    .todo-content {
                        margin-right: 20px;
                        .icon-pm-more-options {
                            padding-right: 10px;
                        }
                    }
                }
            }
        }

        .description {
            .margin-left();
            margin-top: 7px;
            span {
                color: #525252;
                font-style: italic;
                font-weight: 300;
                font-size: 12px;
                
            }   
        }

        .list-back-btn {
            margin-top: 20px !important;
            margin-bottom: 20px !important;
            .margin-left() !important;
            background: #fff !important;
            padding: 4px 15px !important;
            height: 36px !important;

            .icon-pm-left-arrow {
                font-size: 8px;
                margin-right: 5px;
                position: relative;
                top: -1px;
            }
            .title {
                font-size: 13px;
                color: #000;
            }

            &:hover {
                border-color: #1A9ED4 !important;
                color: #1A9ED4 !important;
                .title {
                    color: #1A9ED4 !important;
                }

                .icon-pm-left-arrow {
                    &:before {
                        color: #1A9ED4 !important;
                    }
                }
            }
        }

        .title-wrp {
            .margin-left();
            display: flex;
            align-items: baseline;

            .title {
                span {
                    font-size: 14px;
                    color: #000;
                    font-weight: bold;
                }
            }

            .list-actions {
                display: flex;
                align-items: center;
                position: relative;
                top: -2px;

                .list-title-action {
                    margin-left: 12px;
                }

                .after-title {
                    position: relative;
                    top: 2px;

                    .view-single-list {
                        cursor: pointer;
                        &:hover {
                            .icon-pm-eye {
                                &:before {
                                    color: #000;
                                }
                            }
                        }
                    }

                    .icon-pm-unlock {
                        &:before {
                            color: #d7dee2;
                        }
                    }
                    .icon-pm-private {
                        &:before {
                            color: #d7dee2;
                        }
                    }
                    .list-title-action {
                        margin-left: 12px;
                    }
                }
            }

            .more-menu {
                padding: 0 12px;
                cursor: pointer;
                position: relative;
                position: relative;
                top: 0px;
                flex: 1;
                justify-content: flex-end;
                display: flex;


                .icon-pm-more-options {
                    &:before {
                        color: #d7dee2;
                    }
                }

                &:hover {
                    .icon-pm-more-options {
                        &:before {
                            color: #6d6d6d;
                        }
                    }
                }

                .more-menu-ul-wrap, .list-update-warp {
                    position: absolute;
                    top: 31px;
                    left: auto;
                    right: -6px;
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                    border: 1px solid #DDDDDD;
                    background: #fff;
                    border-radius: 3px;
                    box-shadow: 0px 2px 40px 0px rgba(214, 214, 214, 0.6);

                    &:before {
                        border-color: transparent transparent #DDDDDD transparent;
                        position: absolute;
                        border-style: solid;
                        top: -9px;
                        right: 11px;
                        content: "";
                        z-index: 9999;
                        border-width: 0px 8px 8px 8px;
                    }

                    &:after {
                        border-color: transparent transparent #ffffff transparent;
                        position: absolute;
                        border-style: solid;
                        top: -7px;
                        right: 11px;
                        content: "";
                        z-index: 9999;
                        border-width: 0 8px 7px 8px;
                    }
                    .first-li {
                        margin-top: 6px;
                    }

                    .li-a {
                        display: inline-block;
                        width: 100%;
                        padding: 0 30px 0 12px;
                        color: #7b7d7e;
                        font-weight: 400;
                        font-size: 12px;
                        white-space: nowrap;
                    }

                    .icon-pm-pencil, .icon-pm-delete, .li-a-icon {
                        display: inline-block;
                        width: 20px;
                    }
                }

                .list-update-warp {
                    width: 300px;

                    form {
                        padding: 10px;

                        .submit {
                            padding: 0;
                            margin: 0;
                            display: flex;
                            align-items: center;
                            .list-cancel {
                                width: auto !important;
                            }
                        }
                        .pm-secondary {
                            width: auto !important;
                            margin-left: 10px !important;
                        }
                        .title-field, .description-field, .milestone-field, .pm-action-wrap {
                            width: 100%;
                            margin-bottom: 15px !important;
                            border-radius: 3px;
                            display: inline-block;
                        }
                        .pm-make-privacy {
                            line-height: 0;
                            label {
                                line-height: 0;
                            }
                        }
                        .content {
                            border: none !important;
                        }

                    }
                }

            }

            .progress-bar {
                width: 52px;
                background: #D7DEE2;
                height: 5px;
                border-radius: 3px;

                .completed {
                    background: #1A9ED4;
                    height: 5px;
                    border-radius: 3px;
                }
            }
        }
    }
</style>

<script>
    
    import single_list_tasks from './single-list-tasks.vue';
    import list_comments from './list-comments.vue';
    import new_task_list_form from './new-task-list-form.vue';
    import new_task_button from './new-task-btn.vue';
    import header from './../common/header.vue';
    import Mixins from './mixin';
    import Menu from '@components/common/menu.vue';
    import tasks from './list-tasks.vue';

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
                delete_task_list: __( 'Delete List', 'wedevs-project-manager'),
               
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
            window.addEventListener('click', this.windowActivity);
        },

        components: {
            'single-list-tasks': single_list_tasks,
            'list-comments': list_comments,
            'new-task-list-form': new_task_list_form,
            'new-task-button': new_task_button,
            'pm-header': header,
            'list-tasks': tasks,
            pmMenu: Menu,
        },

        computed: {
            /**
             * Get todo lists from vuex store
             * 
             * @return array
             */
            list: function () {
                if( this.$store.state.projectTaskLists.lists.length) {
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

            isArchivedListComponent () {
                return this.isArchivedList(this.list);
            }

        },

        methods: {
            windowActivity (el) {
                var listActionWrap = jQuery(el.target).closest('.list-more-menu');

                if ( !listActionWrap.length ) {
                    this.list.moreMenu = false;
                }
            },
            showHideMoreMenu (list) {
                list.moreMenu = list.moreMenu ? false : true; 
            },
            getTotalTask (incomplete, complete) {
                return parseInt(incomplete)+parseInt(complete);
            },
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
    }
</script>

<style>
    .mr-5{
        margin-right: 5px;
    }
</style>

