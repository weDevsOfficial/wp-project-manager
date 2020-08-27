
export default {
	methods: {
        selfGetLists (project_id, callback) {
            var self = this,
                projects = this.$store.state.calendar.projects;

            if(!projects) {
                if(typeof callback !== 'undefined') {
                    callback()
                }

                return;
            };

            var index = self.getIndex(projects, project_id, 'id');

            if(index === false) {
                if(typeof callback !== 'undefined') {
                    callback()
                }

                return;
            }

            if( typeof projects[index].task_lists !== 'undefined') {
                if(typeof callback !== 'undefined') {
                    callback()
                }

                return;
            }

            var args = {
                data: {
                    project_id: project_id,
                },
                callback (component, res) {
                    self.$store.commit('setListInProject', {
                        project_id: project_id,
                        lists: res.data
                    });

                    if(typeof callback !== 'undefined') {
                        callback(res)
                    }
                }
            }

            this.getCalendarLists(args);
        },
        getCalendarLists (args) {
            var self = this;

            var request = {
                url: self.base_url + 'pm/v2/projects/'+args.data.project_id+'/task-lists?per_page=-1',
                success (res) {

                    if ( typeof args.callback !== 'undefined' ) {
                        args.callback (self, res);
                    }
                },
                error (res) {

                }
            }

            self.httpRequest(request);
        },

        getEvents (args) {
            var self = this,
            pre_define = {
                data: {

                },
                callback: false,
            };
            var args = jQuery.extend(true, pre_define, args );
            var request = {
                url: self.base_url + 'pm-pro/v2/calendar-events',
                type: 'GET',
                data: args.data,
                success (res) {
                    if(typeof args.callback === 'function' ){
                        args.callback.call(self, res.data);
                    }
                }
            };
            self.httpRequest(request);
        },

        updateTask ( args ){
            var self      = this,
            pre_define = {
                data: {
                    project_id: self.project_id
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + 'pm/v2/projects/'+args.data.project_id+'/tasks/'+args.data.task_id+'/update',
                type: 'POST',
                data: args.data,
                success (res) {
                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);

                    if ( typeof args.callback === 'function' ) {
                        args.callback.call ( self, res );
                    }

                },

                error (res) {
                    // Showing error
                    res.responseJSON.message.map( function( value, index ) {
                        pm.Toastr.error(value);
                    });

                    if ( typeof args.callback === 'function' ) {
                        args.callback.call ( self,  res );
                    }
                }
            }

            self.httpRequest(request_data);
        },

        /**
         * Update milesotne
         * @param  {[Objecat]}   args [description]
         * @return {[type]}             [description]
         */
        updateMilestone ( args ) {
            var self = this,
            pre_define = {
                data: {
                    order: 0,
                    status:'incomplete',
                    project_id: self.project_id,
                },
                callback: false,
            };
            var args = jQuery.extend(true, pre_define, args );

            var request_data = {
                url: self.base_url + 'pm/v2/projects/'+args.data.project_id+'/milestones/'+args.data.id+'/update',
                type: 'POST',
                data: args.data,
                success (res) {
                    pm.Toastr.success(res.data.success);

                    if(typeof args.callback === 'function'){
                        args.callback.call ( self, res );
                    }
                },

                error (res) {
                    // Showing error
                    res.responseJSON.message.map( function( value, index ) {
                        pm.Toastr.error(value);
                    });

                    if(typeof args.callback === 'function'){
                        args.callback.call ( self, res );
                    }
                }
            }
            self.httpRequest(request_data);
        },
        eventFromateData(event){

            if(typeof event.start === 'undefined') {
                event['start'] = {
                    date: event.start_at.date
                }
            }

            if(typeof event.end === 'undefined') {
                event['end'] = {
                    date: event.due_date.date
                }
            }

            var eventObj = {
                'id' : event.id,
                'title' : event.title,
                'start' : this.start( event ),
                'end' : this.end( event ),
                'type': event.type,
                'url': this.url(event ),
                'project_id': event.project_id,
                'timezone': 'local',
                'assignees': this.assignees(event),
            }


            var className, color;
            if( event.type == 'milestone' ){
                eventObj.className = this.milestoneClass( event ).join(" ");
                eventObj.color = '#32b1c8';
                eventObj.durationEditable = false;
                eventObj.resourceEditable = true;
            }else{
                eventObj.className = this.taskClass( event ).join(" ");
                eventObj.color = '#c86432';
                eventObj.durationEditable = true;
            }
            return eventObj;
        },
        milestoneClass ( event ) {
            var className = ['milestone'];

            className.push(event.status);

            return className;
        },
        taskClass ( event ) {
            var className = ['pm-calender-todo'];
            var today   = pm.Moment().format('YYYY-MM-DD');
            var due_date = new Date(event.end.date);

            if( event.status == 'complete' ){
                className.push('pm-complete-task');
                return className;
            }

            if ( ! pm.Moment( due_date ).isValid() ) {
                className.push('pm-task-running');
                return className;
            }

            if( pm.Moment(due_date).isSameOrAfter(today) ){
                className.push('pm-task-running');
            }else {
                className.push('pm-expire-task');
            }

            return className;
        },
        end ( event ) {
            var end = new Date(event.end.date);
            var created_at = new Date(event.created_at.date);
            if( pm.Moment(end ).isValid() ){
                return pm.Moment(end).add(1, 'day').format('YYYY-MM-DD');
            }

            return pm.Moment(created_at).add(1, 'day').format('YYYY-MM-DD');
        },
        start ( event ){

            var end = new Date(event.end.date);
            var created_at = new Date(event.created_at.date);
            if(event.start.date !== null){
                var start = new Date(event.start.date );
                if( pm.Moment( start ).isValid() ){
                    return pm.Moment(start).format('YYYY-MM-DD');
                }
            }

            if( pm.Moment( end ).isValid() && pm.Moment(end).isBefore(created_at) ){
                return pm.Moment(end).format('YYYY-MM-DD');
            }

            return pm.Moment(created_at).format('YYYY-MM-DD');
        },
        url ( event ) {

            //return '#/calendar';
            var url;
            if(event.type == 'task') {

                // if ( 'mytask-tasks' == this.$route.name || 'mytask_calendar_single_task' == this.$route.name ) {
                //     url = this.$router.resolve({ name: 'mytask_calendar_single_task', params: {task_id: event.id, project_id: event.project_id}}).href;

                // } else {
                //     url = this.$router.resolve({ name: 'calendar_single_task', params: {task_id: event.id, project_id: event.project_id}}).href;

                // }

                url = '#/calendar';

                return window.location.href;

            }else if (event.type == 'milestone' ) {

                url = this.$router.resolve({ name: 'milestones', params: { project_id: event.project_id }}).href;

            }

            var location = window.location.href;
            location = location.slice(0, location.indexOf("#"));
            url = location + url;

            return url;
        },
        assignees ( event ) {
            var assignees=[];
            if( typeof event.assignees !== 'undefined' ){

                event.assignees.data.map(function ( assignee ) {
                    assignees.push({'avatar_url':assignee.avatar_url, 'display_name': assignee.display_name, 'id': assignee.id});
                });
                return assignees;
            }
        },
        eventRender (event, element, calEvent) {
            if( typeof event.assignees != 'undefined' && element.hasClass('pm-calender-todo') ) {
                element.find('.fc-time').remove();
                event.assignees.map((assignee) => {
                    element.find('.fc-title').before( $("<span class=\"fc-event-icons\"><img src="+assignee.avatar_url+" width='18' height='18' title="+assignee.display_name +"></span>") );
                });
            }
        },
        resourceRender (resourceObj, labelTds, bodyTds) {
            labelTds.find('.fc-icon').html("<span class=\"pm-pro-resource-user-icons\"><img src="+resourceObj.avatar_url+" width='18' height='18' title="+resourceObj.title+"></span>");
        },
        eventDrop (event, delta, revertFunc, jsEvent, ui, view) {

            if(event.type == 'task') {
                var userIds = [];
                var resourceId = event.resourceId;
                var resourceIds = event.resourceIds;

                var assignees = event.assignees.map(user => user.id);

                if(typeof resourceId !== 'undefined') {
                    userIds = [resourceId];
                }

                if(typeof resourceIds !== 'undefined' && resourceIds) {
                    userIds = resourceIds;
                }

                var fromIds = _.difference(assignees, userIds);
                var toIds = _.difference(userIds, assignees);

                if(toIds.length) {
                    toIds.forEach(function(id, index) {
                        if(id) {
                            if(assignees.indexOf(id) === -1) {
                                assignees.push(id);

                                var resource = jQuery('#pm-calendar').fullCalendar('getResourceById', id);

                                event.assignees.push({
                                    avatar_url: resource.avatar_url,
                                    display_name: resource.title,
                                    id: resource.id
                                })
                            }
                        }
                    })
                }

                if(fromIds.length) {
                    fromIds.forEach(function(id, index) {
                        if(assignees.indexOf(id) !== -1) {
                            assignees.splice(assignees.indexOf(id), 1);
                        }

                        var index = _.findIndex(event.assignees, function(user) { return user.id == id });

                        event.assignees.splice(index, 1);
                    })
                }

                jQuery('#pm-calendar').fullCalendar( 'updateEvent', event );

                var args = {
                    data:{
                        assignees: assignees,
                        project_id: event.project_id,
                        title: event.title,
                        task_id: event.id,
                        start_at: event.start.format('YYYY-MM-DD'),
                        due_date: event.end.subtract(1, 'day').format('YYYY-MM-DD')
                    },
                    callback (res) {
                        if (res.status && res.status !== 200) {
                            revertFunc();

                        }
                    }
                }

                this.updateTask(args);
            }

            if(event.type === 'milestone' ){
                var args = {
                    data:{
                        project_id: event.project_id,
                        title: event.title,
                        id:event.id,
                        achieve_date: event.start.format('YYYY-MM-DD')
                    },
                    callback (res) {
                        if (res.status && res.status !== 200) {
                            revertFunc();
                        }
                    }
                }

                this.updateMilestone(args);
            }
        },
        eventResize (event, delta, revertFunc) {
            if(event.type == 'task'){
                var assignees = event.assignees.map(user => user.id);
                var args = {
                    data:{
                        assignees: assignees,
                        project_id: event.project_id,
                        title: event.title,
                        task_id:event.id,
                        start_at: event.start.format('YYYY-MM-DD'),
                        due_date: event.end.subtract(1, 'day').format('YYYY-MM-DD')
                    },
                    callback (res) {
                        if (res.status && res.status !== 200) {
                            revertFunc();
                        }
                    }
                }

                this.updateTask(args);
            }
        },

        calendarProjectId () {
            return this.$route.query.project_id ? parseInt(this.$route.query.project_id) : 0;
        },

        getCalendarProjects(args) {
            var self = this;
            var pre_define = {
                conditions : {

                }
            }

            var  args = jQuery.extend(true, pre_define, args );
            var conditions = self.generateConditions(args.conditions);


            var request_data = {
                url: self.base_url + 'pm-pro/v2/calendar-projects?'+conditions,
                data: args.conditions,
                success (res) {

                    // self.loading = false;
                    if(typeof args.callback != 'undefined'){
                        args.callback(res.data);
                    }

                }
            };

            self.httpRequest(request_data);
        }
	}
};
