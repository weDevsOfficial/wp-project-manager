<template>
    <div class="mytask-current">
        <table class="wp-list-table widefat fixed striped posts current-task-table">
            <thead>
                <tr>
                    <td @click.prevent="activeSorting('title')" class="pointer">
                        {{ __('Tasks', 'wedevs-project-manager') }}
                        <span class="sort-wrap">
                            <i 
                                :class="sorting.title.asc ? 'active-sorting pm-icon flaticon-caret-down' : 'pm-icon flaticon-caret-down'" 
                                aria-hidden="true">
                                
                            </i>
                            <i 
                                :class="sorting.title.desc ? 'active-sorting pm-icon flaticon-sort' : 'pm-icon flaticon-sort'" 
                                aria-hidden="true">
                                    
                            </i>
                        </span>
                    </td>
                    <td>{{ __('Task List', 'wedevs-project-manager') }}</td>
                    <td>{{ __('Projects', 'wedevs-project-manager') }}</td>
                    <td @click.prevent="activeSorting('due_date')" class="pointer">
                        {{ __('Due Date', 'wedevs-project-manager') }}
                        <span class="sort-wrap">
                            <i 
                                :class="sorting.due_date.asc ? 'active-sorting pm-icon flaticon-caret-down' : 'pm-icon flaticon-caret-down'" 
                                aria-hidden="true">
                                    
                            </i>
                            <i 
                                :class="sorting.due_date.desc ? 'active-sorting pm-icon flaticon-sort' : 'pm-icon flaticon-sort'" 
                                aria-hidden="true">
                                    
                            </i>
                        </span>
                    </td>
                    <td @click.prevent="activeSorting('created_at')" class="pointer">
                        {{ getCreatedAtLabel() }}
                        <span class="sort-wrap">
                            <i 
                                :class="sorting.created_at.asc ? 'active-sorting pm-icon flaticon-caret-down' : 'pm-icon flaticon-caret-down'" 
                                aria-hidden="true">
                                    
                            </i>
                            <i 
                                :class="sorting.created_at.desc ? 'active-sorting pm-icon flaticon-sort' : 'pm-icon flaticon-sort'" 
                                aria-hidden="true">
                                    
                            </i>
                        </span>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr v-if="tasks.length" v-for="task in tasks">
                    <!-- <td>{{ task.id }}</td> -->
                    <td><a href="#" @click.prevent="popuSilgleTask(task)">{{ task.title }}</a></td>
                    <td>
                        <router-link
                          :to="{
                            name: 'single_list',
                            params: {
                                project_id: task.project_id,
                                list_id: task.task_list_id
                            }
                        }">
                            {{ task.task_list.data.title }}
                        </router-link>

                    </td>
                    <td>
                        <router-link
                          :to="{
                            name: 'task_lists',
                            params: {
                                project_id: task.project_id,
                            }
                        }">
                            {{ task.project.title }}
                        </router-link>
                    </td>
                    <td v-html="getRelativeDueDate(task)"></td>
                    <td>{{ getCreatedAtValue(task) }}</td>
                </tr>
                <tr v-if="!tasks.length">
                    <td colspan="5">{{ __('No task found!', 'wedevs-project-manager') }}</td>
                </tr>
            </tbody>
        </table>

        <div v-if="parseInt(individualTaskId) && parseInt(individualProjectId)">
            <single-task 
                :taskId="parseInt(individualTaskId)" 
                :projectId="parseInt(individualProjectId)"
                @closeTaskModal="closeTaskModal">
                    
            </single-task>
        </div>
        <router-view name="singleTask"></router-view>
    </div>
</template>

<style lang="less">
    .mytask-current {
        .current-task-table {
            .id-td {
                width: 85px;
            }
            .pointer {
                cursor: pointer;
            }
            thead td {
                position: relative;
            }
            .sort-wrap {
                position: absolute;
                right: 25px;
                display: flex;
                top: 50%;
                flex-direction: column;
                transform: translate(10px, -50%);
                i {
                    line-height: 0;
                    transform: rotate(180deg);
                    &:not(.active-sorting) {
                        color: #b5b5b5;
                    }
                    &:before {
                        font-size: 8px !important;

                    }

                }
                .flaticon-sort {
                    margin-top: 6px;
                }
            }   
        }
    }
</style>
<script>
    export default {
        props: {
            tasks: {
                type: [Array],
                default () {
                    return [];
                }
            }
        },

        data () {
            return {
                individualTaskId: 0,
                individualProjectId: 0,
                sorting: {
                    // id: {
                    //     asc: true,
                    //     desc: false
                    // },
                    title: {
                        asc: false,
                        desc: false
                    },
                    due_date: {
                        asc: false,
                        desc: false
                    },
                    created_at: {
                        asc: false,
                        desc: false
                    }
                }
            }
        },

        components: {
            'single-task': pm.SingleTask,
        },

        created () {
            pmBus.$on('pm_after_close_single_task_modal', this.afterCloseSingleTaskModal);
        },

        methods: {
            closeTaskModal (task) {
                this.$emit('afterCloseTaskModal', task);
            },

            activeSorting(key) {
                var self = this;
                
                jQuery.each(this.sorting, function( index, val ) {
                    if(index != key) {
                        self.sorting[index].asc = false;
                        self.sorting[index].desc = false;
                    }
                })

                if( !self.sorting[key].asc && !self.sorting[key].desc) {
                    self.sorting[key].asc = true;
                } else {
                    self.sorting[key].asc = self.sorting[key].asc ? false : true;
                    self.sorting[key].desc = self.sorting[key].desc ? false : true;
                } 

                if(self.sorting[key].asc === true) {
                    self.$emit('columnSorting', {
                        orderby: key,
                        order: 'asc'
                    });
                }

                if(self.sorting[key].desc === true) {
                    self.$emit('columnSorting', {
                        orderby: key,
                        order: 'desc'
                    });
                }
            },

            getRelativeDueDate (task) {
                
                if(typeof task.due_date.date != 'undefined' && task.due_date.date != '' && task.due_date.date) {
                    let dueDate = pm.Moment( task.due_date.date ).format( 'MMM DD, YYYY' );
                    return this.relativeDate(dueDate);
                }

                return '&ndash;';
            },
            
            getDate(task) {
                if(typeof task.completed_at != 'undefined' && task.completed_at != '') {
                    return pm.Moment( task.completed_at ).format( 'MMM DD, YYYY' );
                }

                return '';
                
            },

            goToSigleList (task) {
                this.$router.push({
                    name: 'single_list',
                    params: { 
                        project_id: task.project_id,
                        list_id: task.task_list_id
                    }
                });
            },

            goToProject(task) {
                this.$router.push({
                    name: 'task_lists',
                    params: { 
                        project_id: task.project_id,
                    }
                });
            },

            afterCloseSingleTaskModal () {
                this.individualTaskId = false;
                this.individualProjectId = false;
            },

            popuSilgleTask (task) {
                this.individualTaskId = task.id;
                this.individualProjectId = task.project_id;
            },

            getCreatedAtValue (task) {
                if(typeof this.$route.query.start_at == 'undefined' || typeof this.$route.query.due_date == 'undefined') {
                    let created_at = task.created_at.date ? task.created_at.date : task.created_at;
                    return this.getDate(created_at);
                }

                if(this.$route.query.start_at == '' || this.$route.query.due_date == '') {
                    let created_at = task.created_at.date ? task.created_at.date : task.created_at;
                    return this.getDate(created_at);
                }
                
                if(this.$route.query.start_at != '' && this.$route.query.due_date != '') {
                    let start_at = task.start_at.date ? task.start_at.date : task.start_at;
                    let due_date = task.due_date.date ? task.due_date.date : task.due_date;
                    
                    return this.getDate(start_at) +' - '+ this.getDate(due_date);
                }
            },

            getDate(date) {
                if(typeof date != 'undefined' && date != '') {
                    return pm.Moment( date ).format( 'MMM DD, YYYY' );
                }

                return '';
                
            },

            getCreatedAtLabel () {

                if(typeof this.$route.query.start_at == 'undefined' || typeof this.$route.query.due_date == 'undefined') {
                    return __('Created at', 'wedevs-project-manager');
                }

                if(this.$route.query.start_at == '' || this.$route.query.due_date == '') {
                    return __('Created at', 'wedevs-project-manager');
                }

                if(this.$route.query.start_at != '' && this.$route.query.due_date != '') {
                    return __('Date Between', 'wedevs-project-manager');
                }
            }
        }
    }
</script>
