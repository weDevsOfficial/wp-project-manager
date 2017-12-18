/**
 * Global object for all components and root
 */
var CPM_Task_Mixin = {
    data: function() {
        return {
            list_form_data: {}
        }
    },

    computed: {
        /**
         * Is current user can create task
         *
         * @return object
         */
        canUserCreateTask: function() {
            return this.$store.state.permissions.create_todo;
        },

        task_start_field: function() {
           return this.$store.state.permissions.task_start_field;
        },

        /**
         * Check is todo-list single or not
         *
         * @return Boolean
         */
        is_single_list: function() {
            return this.$store.state.is_single_list;
        },

        /**
         * Check is task single or not
         *
         * @return Boolean
         */
        is_single_task: function() {
            return this.$store.state.is_single_task;
        },

        /**
         * Todo-lists view active mode
         *
         * @return string
         */
        active_mode: function() {
            return ( this.$store.state.active_mode == '' ) ? 'list' : this.$store.state.active_mode;
        },

    },

    /**
     * Methods for global component
     */
	methods: {

        /**
         * Single task popup
         *
         * @param  object task
         *
         * @return void
         */
        singleTask: function( task ) {
            this.$store.commit( 'single_task_popup', { task: task } );
        },

        /**
         * Handel new todo list form show and hide
         *
         * @param  obj list
         * @param  int list_index
         *
         * @return void
         */
        showHideTodoListForm: function( list, list_index ) {
            if ( list.ID ) {
                //this.$store.commit( 'showHideUpdatelistForm', { list: list, list_index: list_index } );
            } else {
                //this.$store.commit( 'newTodoListForm' );
            }


            var edit_mode = list.ID ? true : false,
                self      = this;

            if ( edit_mode ) {
                var is_edit = self.$store.state.lists[list_index].edit_mode;

                if ( is_edit ) {
                    CPM_Component_jQuery.slide( list.ID, function() {
                        self.$store.commit( 'showHideUpdatelistForm', { list: list, list_index: list_index } );
                    });

                } else {
                    self.$store.commit( 'showHideUpdatelistForm', { list: list, list_index: list_index } );

                     Vue.nextTick( function() {

                        CPM_Component_jQuery.slide( list.ID );
                    });
                }
            } else {
                var is_edit = self.$store.state.show_list_form;

                if ( is_edit ) {
                    CPM_Component_jQuery.slide( 'list', function() {
                        self.$store.commit( 'newTodoListForm' );
                    });
                } else {
                    self.$store.commit( 'newTodoListForm' );

                    Vue.nextTick( function() {

                        CPM_Component_jQuery.slide( 'list' );
                    } );

                }

            }
        },

        /**
         * Handel new todo or task form show and hide
         *
         * @param  int list_index
         * @param  int task_index
         *
         * @return void
         */
        showHideTaskForm: function( list_index, task_index ) {

            if ( ( typeof task_index == 'undefined' ) || ( task_index === false ) ) {

                var edit_mode = this.$store.state.lists[list_index].show_task_form,
                    list_id   = this.$store.state.lists[list_index].ID,
                    self      = this;

                if ( edit_mode ) {

                    CPM_Component_jQuery.slide( 'undefined', function() {
                        self.$store.commit( 'showHideTaskForm', { list_index: list_index, task_index: false } );
                    });

                } else {
                    self.$store.commit( 'showHideTaskForm', { list_index: list_index, task_index: false } );

                    Vue.nextTick( function() {
                        CPM_Component_jQuery.slide( 'undefined' );
                    } );
                }

            } else {
                var edit_mode = this.$store.state.lists[list_index].tasks[task_index].edit_mode,
                    list_id   = this.$store.state.lists[list_index].ID,
                    task_id   = this.$store.state.lists[list_index].tasks[task_index].ID,
                    self      = this;

                if ( edit_mode ) {

                    CPM_Component_jQuery.slide( task_id, function() {
                        self.$store.commit( 'showHideTaskForm', { list_index: list_index, task_index: task_index } );
                    });

                } else {
                    self.$store.commit( 'showHideTaskForm', { list_index: list_index, task_index: task_index } );

                    Vue.nextTick( function() {

                        CPM_Component_jQuery.slide( task_id );
                    } );
                }
            }
        },

        /**
         * WP settings date format convert to moment date format with time zone
         *
         * @param  string date
         *
         * @return string
         */
        dateFormat: function( date ) {
            if ( date == '' ) {
                return;
            }

            moment.tz.add(CPM_Vars.time_zones);
            moment.tz.link(CPM_Vars.time_links);

            var format = 'MMMM DD YYYY';

            if ( CPM_Vars.wp_date_format == 'Y-m-d' ) {
                format = 'YYYY-MM-DD';

            } else if ( CPM_Vars.wp_date_format == 'm/d/Y' ) {
                format = 'MM/DD/YYYY';

            } else if ( CPM_Vars.wp_date_format == 'd/m/Y' ) {
                format = 'DD/MM/YYYY';
            }

            return moment.tz( date, CPM_Vars.wp_time_zone ).format( String( format ) );
        },

        /**
         * WP settings date format convert to moment date format with time zone
         *
         * @param  string date
         *
         * @return string
         */
        shortDateFormat: function( date ) {
            if ( date == '' ) {
                return;
            }

            moment.tz.add(CPM_Vars.time_zones);
            moment.tz.link(CPM_Vars.time_links);

            var format = 'MMM DD';

            return moment.tz( date, CPM_Vars.wp_time_zone ).format( String( format ) );
        },

        /**
         * WP settings date time format convert to moment date format with time zone
         *
         * @param  string date
         *
         * @return string
         */
        dateTimeFormat: function( date ) {
            if ( date == '' ) {
                return;
            }

            moment.tz.add(CPM_Vars.time_zones);
            moment.tz.link(CPM_Vars.time_links);

            var date_format = 'MMMM DD YYYY',
                time_format = 'h:mm:ss a';

            if ( CPM_Vars.wp_date_format == 'Y-m-d' ) {
                date_format = 'YYYY-MM-DD';

            } else if ( CPM_Vars.wp_date_format == 'm/d/Y' ) {
                date_format = 'MM/DD/YYYY';

            } else if ( CPM_Vars.wp_date_format == 'd/m/Y' ) {
                date_format = 'DD/MM/YYYY';
            }

            if ( CPM_Vars.wp_time_format == 'g:i a' ) {
                time_format = 'h:m a';

            } else if ( CPM_Vars.wp_time_format == 'g:i A' ) {
                time_format = 'h:m A';

            } else if ( CPM_Vars.wp_time_format == 'H:i' ) {
                time_format = 'HH:m';
            }

            var format = String( date_format+', '+time_format );

            return moment.tz( date, CPM_Vars.wp_time_zone ).format( format );
        },

        /**
         * Get index from array object element
         *
         * @param   itemList
         * @param   id
         *
         * @return  int
         */
        getIndex: function ( itemList, id, slug) {
            var index = false;

            itemList.forEach(function(item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        },

        /**
         * ISO_8601 Date format convert to moment date format
         *
         * @param  string date
         *
         * @return string
         */
        dateISO8601Format: function( date ) {
            return moment( date ).format();
        },

        /**
         * Show hide todo-list edit form
         *
         * @param  int comment_id
         *
         * @return void
         */
        showHideListCommentEditForm: function( comment_id ) {
            var comment_index = this.getIndex( this.$store.state.lists[0].comments, comment_id, 'comment_ID' ) ,
                self = this;

            var edit_mode = self.$store.state.lists[0].comments[comment_index].edit_mode;

            if ( edit_mode ) {
                CPM_Component_jQuery.slide( comment_id, function() {
                    self.$store.commit( 'showHideListCommentEditForm', { comment_index: comment_index, list_index: 0 } );
                });

            } else {
                self.$store.commit( 'showHideListCommentEditForm', { comment_index: comment_index, list_index: 0 } );

                Vue.nextTick( function() {
                    CPM_Component_jQuery.slide( comment_id );
                } );
            }
        },

        /**
         * Show hide todo-list edit form
         *
         * @param  int comment_id
         *
         * @return void
         */
        showHideTaskCommentEditForm: function( task, comment_id ) {
            var list_index    = this.getIndex( this.$store.state.lists, task.post_parent, 'ID' ),
                task_index    = this.getIndex( this.$store.state.lists[list_index].tasks, task.ID, 'ID' ),
                comment_index = this.getIndex( this.task.comments, comment_id, 'comment_ID' ) ,
                self          = this;

            var edit_mode = this.task.comments[comment_index].edit_mode;

            if ( edit_mode ) {
                CPM_Component_jQuery.slide( comment_id, function() {
                    //self.$store.commit( 'showHideTaskCommentEditForm', { list_index: list_index, task_index: task_index, comment_index: comment_index } );
                    self.task.comments[comment_index].edit_mode = false;

                });

            } else {
                //self.$store.commit( 'showHideTaskCommentEditForm', { list_index: list_index, task_index: task_index, comment_index: comment_index } );
                self.task.comments[comment_index].edit_mode = true;

                Vue.nextTick( function() {
                    CPM_Component_jQuery.slide( comment_id );
                } );
            }
        },


        /**
         * Get current project users by role
         *
         * @param  string role
         *
         * @return array
         */
        get_porject_users_by_role: function( role ) {
            return this.$store.state.project_users.filter(function( user ) {
                return ( user.role == role ) ? true : false;
            });
        },

        /**
         * Get current project users by role
         *
         * @param  string role
         *
         * @return array
         */
        get_porject_users_id_by_role: function( role ) {
            var ids = [];

            this.$store.state.project_users.map(function(user) {
                if ( user.role == role ) {
                    ids.push(user.id);
                }

                if ( typeof role == 'undefined' ) {
                    ids.push(user.id);
                }
            });

            return ids;
        },

        /**
         * Remove comment
         *
         * @param int comment_id
         *
         * @return void
         */
        deleteComment: function( comment_id, list_id ) {

            if ( ! confirm( CPM_Vars.message.confirm ) ) {
                return;
            }

            var self       = this,
                list_index = this.getIndex( this.$store.state.lists, list_id, 'ID' ),
                form_data  = {
                    action: 'cpm_comment_delete',
                    comment_id: comment_id,
                    _wpnonce: CPM_Vars.nonce,
                };
                comment_index = this.getIndex( this.$store.state.lists[list_index].comments, comment_id, 'comment_ID' );

            // Seding request for insert or update todo list
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {
                if ( res.success ) {
                    // Display a success message, with a title
                    //toastr.success(res.data.success);

                    CPM_Component_jQuery.fadeOut( comment_id, function() {
                        self.$store.commit( 'after_delete_comment', {
                            list_index: list_index,
                            comment_index: comment_index
                        });
                    });


                }
            });
        },

        /**
         * Remove comment
         *
         * @param int comment_id
         *
         * @return void
         */
        deleteTaskComment: function( comment_id, task ) {

            if ( ! confirm( CPM_Vars.message.confirm ) ) {
                return;
            }

            var self       = this,
                list_index = this.getIndex( this.$store.state.lists, task.post_parent, 'ID' ),
                task_index = this.getIndex( this.$store.state.lists[list_index].tasks, task.ID, 'ID' ),
                form_data  = {
                    action: 'cpm_comment_delete',
                    comment_id: comment_id,
                    _wpnonce: CPM_Vars.nonce,
                };
                comment_index = this.getIndex( task.comments, comment_id, 'comment_ID' );

            // Seding request for insert or update todo list
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {
                if ( res.success ) {
                    // Display a success message, with a title
                    //toastr.success(res.data.success);

                    CPM_Component_jQuery.fadeOut( comment_id, function() {
                        self.$store.commit( 'after_delete_task_comment', {
                            list_index: list_index,
                            task_index: task_index,
                            comment_index: comment_index
                        });
                    });
                }
            });
        },

        /**
         * Get user information from task assigned user id
         *
         * @param  array assigned_user
         *
         * @return obje
         */
        getUsers: function( assigned_user ) {
            if ( ! assigned_user ) {
                return [];
            }
            filtered_users = [];

            var assigned_to = assigned_user.map(function (id) {
                    return parseInt(id);
                });


            filtered_users = this.$store.state.project_users.filter( function (user) {
                return ( assigned_to.indexOf( parseInt(user.id) ) >= 0 );
            });

            return filtered_users;
        },

        /**
         * CSS class for task date
         *
         * @param  string start_date
         * @param  string due_date
         *
         * @return string
         */
        taskDateWrap: function( start_date, due_date ) {
            if ( start_date == '' && due_date == '' ) {
                return false;
            }

            moment.tz.add(CPM_Vars.time_zones);
            moment.tz.link(CPM_Vars.time_links);

            var today   = moment.tz( CPM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' ),
                due_day = moment.tz( due_date, CPM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' );

            if ( ! moment( String(due_day), 'YYYY-MM-DD' ).isValid() && ! moment( String(start_date), 'YYYY-MM-DD' ).isValid()) {
                return false;
            }

            if ( moment( String(due_day), 'YYYY-MM-DD' ).isValid() ) {
                return moment( String(today), 'YYYY-MM-DD' ).isSameOrBefore( String(due_day) ) ? 'cpm-current-date' : 'cpm-due-date';
            }

            return 'cpm-current-date';
        },

        completedTaskWrap: function ( start_date, due_date ) {
            if ( start_date == '' && due_date == '' ) {
                return false;
            }

            moment.tz.add(CPM_Vars.time_zones);
            moment.tz.link(CPM_Vars.time_links);

            var today   = moment.tz( CPM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' ),
                due_day = moment.tz( due_date, CPM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' );

            if ( ! moment( String(due_day), 'YYYY-MM-DD' ).isValid() && ! moment( String(start_date), 'YYYY-MM-DD' ).isValid()) {
                return false;
            }

            return 'cpm-task-done';
        },

        /**
         * Showing (-) between task start date and due date
         *
         * @param  string  task_start_field
         * @param  string  start_date
         * @param  string  due_date
         *
         * @return Boolean
         */
        isBetweenDate: function( task_start_field, start_date, due_date ) {
            if ( task_start_field && ( start_date != '' ) && ( due_date != '' ) ) {
                return true;
            }

            return false;
        },

        /**
         * Get initial data for todo-list page
         *
         * @param  int project_id
         *
         * @return void
         */
        getInitialData: function( project_id, callback ) {

            var self = this,
                data = {
                    project_id: project_id,
                    current_page: this.$route.params.page_number,
                    _wpnonce: CPM_Vars.nonce,
                    action: 'cpm_initial_todo_list'
                }


            jQuery.post( CPM_Vars.ajaxurl, data, function( res ) {
                if ( res.success ) {
                    self.$store.commit( 'setTaskInitData', res );
                    if ( typeof callback != 'undefined'  ) {
                        callback(true);
                    }

                } else {
                    if ( typeof callback != 'undefined'  ) {
                        callback(false);
                    }
                }
            });
        },

        /**
         * Refresh todo-list page
         *
         * @return void
         */
        refreshTodoListPage: function() {
            // Redirect to first page
            this.$router.push('/');

            // Condition because $route is watch in CPM_Router_Init component
            // When watch is not active then its execute
            if ( ! this.$route.params.page_number ) {
                this.getInitialData( this.$store.state.project_id );
            }
        },

                /**
         * Mark task done and undone
         *
         * @param  int  task_id
         * @param  Boolean is_checked
         * @param  int  task_index
         *
         * @return void
         */
        taskDoneUndone: function( task, is_checked ) {

            var self = this,
                form_data = {
                    _wpnonce: CPM_Vars.nonce,
                    action: is_checked ? 'cpm_task_complete' : 'cpm_task_open',
                    task_id: task.ID,
                    project_id: CPM_Vars.project_id
                },
                list_index = this.getIndex( this.$store.state.lists, task.post_parent, 'ID' ),
                task_index = this.getIndex( this.$store.state.lists[list_index].tasks, task.ID, 'ID' );

            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {

                if ( res.success ) {
                    // Display a success message
                    toastr.success(res.data.success);

                    self.$store.commit( 'task_done_undone', { is_done: is_checked, list_index: list_index, task_index: task_index } );
                    self.$root.$emit('cpm_after_task_done_open', { is_done: is_checked, list_index: list_index, task_index: task_index });
                } else {
                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                        self.$store.commit( 'task_done_undone', { is_done: false, list_index: list_index, task_index: task_index } );
                    });
                }
            });
        },

        isEmptyObject: function(obj) {
            return Object.keys(obj).length === 0;
        },

        getTasks: function(list_id, page_number, action, callback) {
            var form_data = {
                    _wpnonce: CPM_Vars.nonce,
                    list_id: list_id,
                    page_number: typeof page_number == 'undefined' ? 0 : page_number,
                    project_id: CPM_Vars.project_id
                },
                self = this,
                action =  action; //this.$store.state.is_single_list ? 'cpm_get_tasks' : 'cpm_get_incompleted_tasks'

            wp.ajax.send( action, {
                data: form_data,
                success: function(res) {
                    var list_index = self.getIndex( self.$store.state.lists, self.list.ID, 'ID' );
                    self.$store.commit( 'insert_tasks', {tasks: res, list_index: list_index} );

                    if ( typeof callback != 'undefined' ) {
                        callback(res);
                    }
                }
            });
        },

        /**
         * Count completed tasks
         *
         * @param  array tasks
         *
         * @return int
         */
        countCompletedTasks: function( list ) {
            // if ( ! list.tasks ) {
            //     return 0;
            // }

            // var completed_task = 0;

            // list.tasks.filter( function( task ) {
            //     if ( ( list.count_completed_tasks === 1 ) || list.count_completed_tasks ) {
            //         completed_task++;
            //     }
            // });

            return list.count_completed_tasks;
        },

        /**
         * Count incompleted tasks
         *
         * @param  array tasks
         *
         * @return int
         */
        countIncompletedTasks: function( tasks ) {
            if ( ! tasks ) {
                return 0;
            }

            var in_completed_task = 0;

            tasks.filter( function( task ) {
                if ( ( task.completed === 0 ) || !task.completed ) {
                    in_completed_task++;
                }
            });

            return in_completed_task;
        },

        /**
         * Get task completed percentage from todo list
         *
         * @param  array tasks
         *
         * @return float
         */
        getProgressPercent: function( list ) {

            if (typeof list ==  'undefined') {
                return 0;
            }

            var total_tasks     = parseInt(list.count_incompleted_tasks) + parseInt(list.count_completed_tasks), //tasks.length,
                completed_tasks = list.count_completed_tasks, //this.countCompletedTasks( list ),
                progress        = ( 100 * completed_tasks ) / total_tasks;

            return isNaN( progress ) ? 0 : progress.toFixed(0);
        },

        /**
         * Get task completed progress width
         *
         * @param  array tasks
         *
         * @return obj
         */
        getProgressStyle: function( list ) {
            if ( typeof list == 'undefined' ) {
                return 0;
            }
            var width = this.getProgressPercent( list );

            return { width: width+'%' };
        },

        /**
         * Delete list
         *
         * @param  int list_id
         *
         * @return void
         */
        deleteList: function( list_id ) {
            if ( ! confirm( CPM_Vars.message.confirm ) ) {
                return;
            }

            var self       = this,
                list_index = this.getIndex( this.$store.state.lists, list_id, 'ID' ),
                form_data  = {
                    action: 'cpm_tasklist_delete',
                    list_id: list_id,
                    project_id: CPM_Vars.project_id,
                    _wpnonce: CPM_Vars.nonce,
                };

            // Seding request for insert or update todo list
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {
                if ( res.success ) {
                    // Display a success message, with a title
                    //toastr.success(res.data.success);

                    CPM_Component_jQuery.fadeOut( list_id, function() {

                        self.refreshTodoListPage();

                        // self.$store.commit( 'after_delete_todo_list', {
                        //     list_index: list_index,
                        // });
                    });
                } else {
                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                    });
                }
            });
        },

        privateClass: function(list) {
            return list.private == 'on' ? 'cpm-lock' : '';
        },

        updateActiveMode: function (mode) {
            var self       = this,
                form_data  = {
                    project_id: CPM_Vars.project_id,
                    mode: mode,
                    _wpnonce: CPM_Vars.nonce,
                };

            wp.ajax.send('cpm_update_active_mode', {
                data: form_data,
                success: function(res) {

                },
                error: function(res) {

                }
            });
        }
	}
}

