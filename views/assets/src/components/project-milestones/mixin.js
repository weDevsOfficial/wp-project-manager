
export default {
    data () {
        return {

        }
    },
    computed: {
        can_create_milestone () {
            return this.user_can("create_task");
        }
    },
    methods: {
        can_edit_milestone (milestone) {
            var user = PM_Vars.current_user;
            if (this.is_manager()) {
                return true;
            }

            if ( milestone.creator.data.id == user.ID ){
                return true;
            }

            return false;
        },
        showHideMilestoneForm (status, milestone) {
            var milestone   = milestone || false,
                milestone   = jQuery.isEmptyObject(milestone) ? false : milestone;

            if ( milestone && typeof milestone.edit_mode != 'undefined' ) {
                if ( status === 'toggle' ) {
                    milestone.edit_mode = milestone.edit_mode ? false : true;
                } else {
                    milestone.edit_mode = status;
                }
            } else {
                this.$store.commit('projectMilestones/showHideMilestoneForm', status);
            }
        },

        showHideCommentForm (status, comment) {
            if ( status === 'toggle' ) {
                comment.edit_mode = comment.edit_mode ? false : true;
            } else {
                comment.edit_mode = status;
            }
        },
        /**
         * get single Milestones 
         *
         * @param {args} object [object with calback]
         */
        
        getMilestone(args) {
            var self = this,
            pre_define = {
                conditions :{
                    with:'discussion_boards,task_lists',
                },
                callback: false
            }

            var args       = jQuery.extend(true, pre_define, args );
            var conditions = self.generateConditions(args.conditions);

            var request = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/milestones/'+self.$route.params.discussion_id+'?'+conditions,
                success (res) {
                    self.addMeta(res.data);
                    self.$store.commit( 'projectMilestones/setMilestone', res.data );

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    } 
                }
            };
            self.httpRequest(request);
        },

        /**
         * Retrive milestones 
         * 
         * @param {Object} args Object with callback
         */
         getMilestones(args){
            var self = this,
            pre_define = {
                conditions :{
                    with:'discussion_boards,task_lists',
                    per_page: 20,
                    page:1,
                },
                callback: false
            }

            var args       = jQuery.extend(true, pre_define, args );
            var conditions = self.generateConditions(args.conditions);

            var request = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/milestones?'+ conditions,
                success (res) {
                    res.data.map(function(milestone, index) {
                        self.addMeta(milestone, index);
                    });
                    self.$store.commit( 'projectMilestones/setMilestones', res.data );
                    self.$store.commit('projectMilestones/setMilestonesMeta', res.meta.pagination);

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                }
            };

            self.httpRequest(request);
         },

         getSelfMilestones(){
            var self = this,
            args = {
                conditions :{
                    with:'discussion_boards,task_lists',
                    per_page: 20,
                    page:self.setCurrentPageNumber(),
                },
                callback: function(){
                    self.$root.$store.state.projectMilestoneLoaded = true;
                    pm.NProgress.done();
                    self.templateAction();
                }
            }

            self.getMilestones(args);
        },

        addMeta (milestone, index) {
            milestone.edit_mode = false;
        },

        setCurrentPageNumber () {
            var self = this;
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },

                 /**
         * WP settings date format convert to pm.Moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateFormat ( date ) {
            if ( !date ) {
                return;
            }

            date = new Date(date);
            date = pm.Moment(date).format('YYYY-MM-DD');

            var format = 'MMMM DD YYYY';

            if ( PM_Vars.wp_date_format == 'Y-m-d' ) {
            format = 'YYYY-MM-DD';

            } else if ( PM_Vars.wp_date_format == 'm/d/Y' ) {
                format = 'MM/DD/YYYY';

            } else if ( PM_Vars.wp_date_format == 'd/m/Y' ) {
                format = 'DD/MM/YYYY';
            } 

            return pm.Moment( date ).format(format);
        },

        /**
         * Add new milestone 
         *
         * @param {object} args upgoment with data
         * @return { void } [description]
         */
        addMilestone ( args ) {
            var self = this,
            pre_define = {
                data: {
                    order: 0,
                    status:'incomplete'
                },
                callback: false,
            };
            var args = jQuery.extend(true, pre_define, args );
            var data = pm_apply_filters( 'before_milestone_save', args.data );
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/milestones',
                type: 'POST',
                data: data,
                success (res) {
                    self.addMeta(res.data);
                    
                    self.$store.commit('projectMilestones/newMilestone', res.data);
                    self.$store.commit('projectMilestones/afterNewMilestoneUpdateMeta');

                    self.$root.$store.state.milestones_load = false;
                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);

                    self.$root.$emit( 'after_comment' );
                    self.templateAction();
                    
                    if(typeof args.callback === 'function'){
                        args.callback.call(self, res);
                    }  
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    self.$store.commit('updateProjectMeta', 'total_milestones');

                    if ( self.section === 'milestones' ) {
                        self.afterNewMilestone();
                    }
                },

                error (res) {
                    // Showing error

                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }

                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    if(typeof args.callback === 'function'){
                        args.callback.call(self, res);
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
            var data = pm_apply_filters( 'before_milestone_save', args.data );
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+args.data.project_id+'/milestones/'+args.data.id+'/update',
                type: 'POST',
                data: data,
                success (res) {
                    self.addMeta(res.data);

                    // update milestone 
                    self.$store.commit('projectMilestones/updateMilestone', res.data);
                    self.$root.$store.state.milestones_load = false;
                   
                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);
                    self.submit_disabled = false;
                    self.templateAction();

                    self.$root.$emit( 'after_comment' );
                    self.$store.commit('updateProjectMeta', 'total_activities');

                    if(typeof args.callback === 'function'){
                        args.callback.call ( self, res );
                    }  

                    if ( self.section === 'milestones' ) {
                        self.afterNewMilestone();
                    }
                },

                error (res) {
                    // Showing error
                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                    if(typeof args.callback === 'function'){
                        args.callback.call ( self, res );
                    }
                }
            }
            self.httpRequest(request_data);
        },

        /**
         * Delete Milestone
         * @param  {Object} args 
         * @return {void}      
         */
        deleteMilestone ( args ) {
            if ( ! confirm( this.__( 'Are you sure you want to delete this milestones?', 'wedevs-project-manager') ) ) {
                return;
            }
            var pre_define = {
                milestone_id: '',
                callback: false,
            }

            var args = jQuery.extend(true, pre_define, args );
            var self = this;
            
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/milestones/' + args.milestone_id + '/delete',
                type: 'POST',
                success: function(res) {
                    self.$store.commit('projectMilestones/afterDeleteMilestone', args.milestone_id);
                    self.$root.$store.state.milestones_load = false;
                    self.$store.commit('decrementProjectMeta', 'total_milestones');
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    pm.Toastr.success(res.message);
                    if(typeof args.callback === 'function'){
                        args.callback.call(self, res);
                    }
                }
            }

            self.httpRequest(request_data);
        },

        afterNewMilestone () {
            var self = this;

            if ( self.$route.params.current_page_number > 1 ) {
                // named route
                self.$router.push({ 
                    name: 'milestones', 
                    params: { 
                        project_id: self.project_id 
                    }
                });
                
            }
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
            
            var total_tasks     = parseInt(list.meta.total_incomplete_tasks) + parseInt(list.meta.total_complete_tasks), //tasks.length,
                completed_tasks = list.meta.total_complete_tasks, //this.countCompletedTasks( list ),
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
        humanDate (milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
                due_date = new Date(due_date),
                due_date = pm.Moment(due_date).format();

            return pm.Moment(due_date).fromNow(true);
        },
        momentFormat (milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
                due_date = new Date(due_date),
                due_date = pm.Moment(due_date).format();

            return due_date;
        },
        getDueDate (milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
            var due_date = this.dateFormat(due_date);

            return due_date;
        },
        templateAction(){
            var blank, miltemp;

            var milestones = this.$store.state.projectMilestones.milestones;
            
            if(milestones.length){
                blank = false; miltemp = true;
            }

            if(!milestones.length){
                blank = true; miltemp = false;
            }

            this.$store.commit('projectMilestones/balankTemplateStatus', blank);
            this.$store.commit('projectMilestones/milestoneTemplateStatus', miltemp);
        },
        privateClass ( privacy ){
            if( typeof privacy !== 'undefined' ){
                if ( privacy == '1' ){
                    return 'dashicons dashicons-lock'
                }else {
                    return 'dashicons dashicons-unlock'
                }
            }
        },

        milestoneLockUnlock (milestone) {
            var self = this;
            var data = {
                is_private: milestone.meta.privacy == '0' ? 1 : 0
            }
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/milestones/privacy/'+milestone.id,
                type: 'POST',
                data: data,
                success (res) {
                    self.$store.commit('projectMilestones/updateMilestonePrivacy', {
                        privacy: data.is_private,
                        project_id: self.project_id,
                        milestone_id: milestone.id

                    });
                },

                error (res) {
                  
                }
            }
            self.httpRequest(request_data);
        }

    },
};

