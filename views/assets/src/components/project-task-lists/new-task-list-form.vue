<template>  

    <div class="list-form">

        <form v-on:submit.prevent="listFormAction()" action="" method="post">
            <div class="item title">
                <input type="text" class="title-field" required="required" name="tasklist_name" v-model="list.title" :placeholder="task_list_name">
            </div>

            <div class="item content">
                <textarea class="description-field" name="tasklist_detail" id="" v-model="list.description" cols="40" rows="2" :placeholder="task_list_details"></textarea>
            </div>

            <div class="item milestone">
                <select class="milestone-field" v-model="milestone_id">
                    <option value="-1">
                        {{ __( '- Milestone -', 'wedevs-project-manager') }}
                    </option>
                    <option v-for="milestone in milestones" :value="milestone.id" :key="milestone.id">
                        {{ milestone.title }}
                    </option>
                </select>
            </div>
            
            <pm-do-action hook="pm_task_list_form" :actionData="list" ></pm-do-action>

            <div class="item submit">
                <span v-show="show_spinner" class="pm-spinner"></span>
                <input @click.prevent="listFormAction()" v-if="list.id" type="submit" class="pm-button pm-primary" :disabled="submit_disabled" name="submit_todo" :value="task_list_update">
                <input v-if="!list.id" type="submit" class="pm-button pm-primary" :disabled="submit_disabled" name="submit_todo" :value="add_list">
                <a @click.prevent="showHideListForm(false, list)" class="pm-button pm-secondary" href="#">{{__( 'Cancel', 'wedevs-project-manager')}}</a>
                
            </div>
        </form>
    </div>  
<!--     <div :class="todolistFormClass(list)+' pm-new-todolist-form'">

        <form v-on:submit.prevent="listFormAction()" action="" method="post">
            <div class="item title">
                <input type="text" required="required" name="tasklist_name" v-model="list.title" :placeholder="task_list_name">
            </div>

            <div class="item content">
                <textarea name="tasklist_detail" id="" v-model="list.description" cols="40" rows="2" :placeholder="task_list_details"></textarea>
            </div>

            <div class="item milestone">
                <select v-model="milestone_id">
                    <option value="-1">
                        {{ __( '- Milestone -', 'wedevs-project-manager') }}
                    </option>
                    <option v-for="milestone in milestones" :value="milestone.id">
                        {{ milestone.title }}
                    </option>
                </select>
            </div>
            <pm-do-action hook="pm_task_list_form" :actionData="list" ></pm-do-action>
            <div class="item submit">
                <input v-if="list.id" type="submit" class="button-primary" :disabled="submit_disabled" name="submit_todo" :value="task_list_update">
                <input v-if="!list.id" type="submit" class="button-primary" :disabled="submit_disabled" name="submit_todo" :value="add_list">
                <a @click.prevent="showHideListForm(false, list)" class="button list-cancel" href="#">{{__( 'Cancel', 'wedevs-project-manager')}}</a>
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>
        </form>
    </div> -->
</template>

<script>
    import Mixins from './mixin';
    
    export default {
        // Get passing data for this component. Remember only array and objects are 
        props: {
            list: {
                type: [Object],
                default () {
                    return {
                        milestone: -1
                    }
                }
            },

            section: {
                type: [String],
                default () {
                    return '';
                }
            }
        },

        /**
         * Initial data for this component
         * 
         * @return obj
         */
        data: function() {
            return {
                tasklist_milestone: this.list.milestone ? this.list.milestone : '-1',
                show_spinner: false,
                error: [],
                success: '',
                submit_disabled: false,
                project_id: this.$route.params.project_id,
                milestone_id: '-1',
                task_list_name: __( 'Task list name', 'wedevs-project-manager'),
                task_list_details: __( 'Task list details', 'wedevs-project-manager'),
                task_list_update: __( 'Update List', 'wedevs-project-manager'),
                add_list: __( 'Add List', 'wedevs-project-manager')
            };
        },

        mixins: [Mixins],

        created () {
            this.checkMilestone();
        },

        computed: {
        
            /**
             * Get current project milestones 
             * 
             * @return array
             */
            milestones: function() {
                return this.$root.$store.state.milestones;
            },
        },


        methods: {
            checkMilestone () {
                if ( this.list.milestone != -1 && typeof this.list.milestone != 'undefined') {
                    this.milestone_id = this.list.milestone.data.id;
                } else {
                    this.milestone_id = -1;
                }
            },

            /**
             * Get todo list form class
             * 
             * @param  obej list 
             * 
             * @return string     
             */
            todolistFormClass ( list ) {
                return list.ID ? 'pm-todo-form-wrap pm-form pm-slide-'+ list.ID : 'pm-todo-list-form-wrap pm-form pm-slide-list';
            },

            /**
             * Insert and update todo list
             * 
             * @return void
             */
            listFormAction: function() {
                // Prevent sending request when multiple click submit button 
                if ( this.submit_disabled ) {
                    return;
                }
                var self = this;
                // Make disable submit button
                this.submit_disabled = true;
                this.show_spinner = true;                              
                this.show_spinner = true;

                var is_update = typeof this.list.id !== 'undefined' ? true : false
                var args = {
                    data : {
                        id: self.list.id,
                        title : self.list.title,
                        description: self.list.description,
                        milestone: self.milestone_id,
                        order: self.list.order
                    },
                    callback: function(res){
                        self.show_spinner     = false;
                        self.submit_disabled = false;
                        self.listTemplateAction();
                    }
                }

                if(!is_update){
                    self.addList(args);
                }else {
                    self.updateList(args);
                }               
            },
            singleAfterNewList (self, res, is_update) {
                if ( is_update ) {
                    var condition = 'incomplete_tasks,complete_tasks,comments';
                    self.getList(self, self.list.id, condition);
                }
            }
        }
    }
</script>
