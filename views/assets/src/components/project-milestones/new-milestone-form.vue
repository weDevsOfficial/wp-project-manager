<template>
    <form class="pm-milestone-form" @submit.prevent="milestoneFormAction()">
        <div class="item milestone-title">
            <input v-model="milestone.title" name="milestone_name" class="required" type="text" id="milestone_name" value="" :placeholder="milestone_name">
        </div>
        
        <div class="item due">
            <pm-datepickter v-model="due_date" class="pm-datepickter-to" dependency="pm-datepickter-from" :placeholder="due_date_text"></pm-datepickter>
        </div>

        <div class="item detail">
            <text-editor :editor_id="editor_id" :content="content"></text-editor>
        </div>
        <pm-do-action hook="pm_milestone_form" :actionData="milestone" ></pm-do-action>
        <div class="submit">
            <input v-if="!milestone.id" type="submit" name="create_milestone" id="create_milestone" class="button-primary" :value="add_milestone">
            <input v-if="milestone.id" type="submit" name="update_milestone" id="update_milestone" class="button-primary" :value="update_milestone">
            <a @click.prevent="showHideMilestoneForm(false, milestone)" class="button milestone-cancel">{{  __( 'Cancel', 'wedevs-project-manager') }}</a>
            <span v-show="show_spinner" class="pm-spinner"></span>
        </div>
        
    </form>
</template>

<style>
    .pm-milestone-form .detail {
        border: none !important;
        padding: 0 !important;
    }
</style>


<script>
    import editor from './../common/text-editor.vue';
    import date_picker from './date-picker.vue';
    import Mixins from './mixin';

    export default { 
        props: ['milestone', 'section'],
        data () {
            return {
                submit_disabled: false,
                show_spinner: false,
                due_date_text: __( 'Due Date', 'wedevs-project-manager'),
                milestone_name: __( 'Milestone name', 'wedevs-project-manager'),
                add_milestone: __( 'Add Milestone', 'wedevs-project-manager'),
                update_milestone: __( 'Update Milestone', 'wedevs-project-manager'),
                content: {
                    html: typeof this.milestone.description == 'undefined' ? '' : this.milestone.description,
                },
                milestone_id: 4,
                due_date: typeof this.milestone.achieve_date === 'undefined' ? '' : this.milestone.achieve_date.date
            }
        },

        mixins: [Mixins],

        watch: {
            /**
             * Observe onchange comment message
             *
             * @param string new_content 
             * 
             * @type void
             */
            content: {
                handler: function( new_content ) {
                    this.milestone.description = new_content.html;
                },

                deep: true
            },
        },

        components: {
            'text-editor': editor,
            'pm-datepickter': date_picker
        },
        computed: {
            milestones () {
                return this.$store.state.projectMilestones.milestones;
            },
            /**
             * Editor ID
             * 
             * @return string
             */
            editor_id: function() {
                var milestone_id = ( typeof this.milestone.id === 'undefined' ) ? '' : '-' + this.milestone.id;
                return 'pm-milestone-editor' + milestone_id;
            },
        },
        methods: {
            milestoneFormAction ( ) {
                 // Exit from this function, If submit button disabled 
                if ( this.submit_disabled ) {
                    return;
                }
                if(!this.milestone.title) {
                    pm.Toastr.error('Milestone title required!');
                    return false;
                }
                // Disable submit button for preventing multiple click
                this.submit_disabled = true;
                // Showing loading option 
                this.show_spinner = true;

                var self = this;

                var args = {
                    data: {
                        title : self.milestone.title,
                        description: self.milestone.description,
                        achieve_date: self.due_date,
                        order: self.milestone.order,
                        status: self.milestone.status,
                    }
                }

                if( typeof this.milestone.id !== 'undefined' ){
                    args.data.id = this.milestone.id;
                    args.callback = function ( res ) {
                            self.showHideMilestoneForm(false, self.milestone);
                            self.show_spinner = false;
                            self.submit_disabled = false;
                    }

                    this.updateMilestone ( args );
                }else{
                    args.callback = function ( res ) {
                        self.showHideMilestoneForm(false);
                        self.show_spinner = false;
                        self.submit_disabled = false;
                    }
                    this.addMilestone ( args );
                }
            }
        }
    
    }   
</script>