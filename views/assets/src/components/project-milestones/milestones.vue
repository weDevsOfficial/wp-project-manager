<template>
    <div class="" id="pm-milestone-page">
        <pm-header></pm-header>

        <div v-if="!isFetchMilestone" class="pm-data-load-before" >
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
        <div v-if="isFetchMilestone">
            <div class="pm-blank-template milestone" v-if="blankTemplate">
                <div class="pm-content" >
                    <h3 class="pm-page-title">  {{ __( 'Milestones', 'pm' ) }}</h3>
                    <p>
                        {{ __( 'Create a lifecycle of your projects using milestones. Time mark the different stages of your project with multiple milestones and also it will help the assigned people to aim for a date to complete the project according to those steps.', 'pm' ) }}
                    </p>
                        <div class="pm-milestone-link clearfix" v-if="user_can('create_milestone')">
                            <a @click.prevent="showHideMilestoneForm('toggle')" id="pm-add-milestone" href="#" class="pm-btn pm-btn-blue pm-plus-white pm-margin-bottom add-milestone pm-btn-uppercase">{{ __( 'Add Milestone', 'pm' ) }}</a>
                        </div>

                        <transition name="slide" v-if="can_create_milestone">

                            <div class="pm-new-milestone-form" v-if="is_milestone_form_active">
                                <div class="pm-milestone-form-wrap"  >
                                    <new-milestone-form section="milestones" :milestone="{}"></new-milestone-form>
                                </div>
                            </div>
                        </transition>

                    <div class="pm-list-content">
                        <h3 class="pm-page-title pm-why-for"> {{ __( 'When to use Milestones?', 'pm' ) }}</h3>

                        <ul class="pm-list">
                            <li>{{ __( 'To set a target date for the project overall.', 'pm' ) }} </li>
                            <li>{{ __( 'To divide a project into several development-time phases.', 'pm' )}} </li>
                            <li>{{ __( 'To coordinate projects and assigned persons timely.', 'pm' ) }} </li>
                        </ul>
                    </div>

                </div>

            </div>
            <div v-if="milestoneTemplate">
                <div class="pm-row pm-milestone-details" >
                    <div class="pm-milestone-link clearfix" v-if="can_create_milestone">
                        <a @click.prevent="showHideMilestoneForm('toggle')"  id="pm-add-milestone" href="#" class="pm-btn pm-btn-blue pm-plus-white pm-margin-bottom add-milestone pm-btn-uppercase">{{ __( 'Add Milestone', 'pm' ) }}</a>
                    </div>

                     <transition name="slide" v-if="can_create_milestone">
                        <div  class="pm-new-milestone-form pm-col-6 pm-sm-col-12" style="float:none;" v-if="is_milestone_form_active">
                            <div class="pm-milestone-form-wrap">
                                <new-milestone-form section="milestones" :milestone="{}"></new-milestone-form>
                            </div>

                        </div>
                    </transition>

                    <late-milestones></late-milestones>
                    <upcomming-milestone></upcomming-milestone>
                    <completed-milestones></completed-milestones>
                    
                </div>

                <pm-pagination 
                    :total_pages="total_milestone_page" 
                    :current_page_number="current_page_number" 
                    component_name='milestone_pagination'>
                    
                </pm-pagination> 

            </div>

        </div>    
        <!-- <pm-do-action hook="component-lazy-load"></pm-do-action> -->
    </div>
</template>


<script>
    import header from './../common/header.vue';
    import new_milestone_form from './new-milestone-form.vue';
    import pagination from './../common/pagination.vue';
    import do_action from './../common/do-action.vue';
    import late_milestones from './late-milestones.vue';
    import upcoming_milestones from './upcoming-milestones.vue';
    import completed_milestones from './completed-milestones.vue';

    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getSelfMilestones();
            });
        },
        mixins: [PmMixin.projectMilestones],
        data () {
            return {
                current_page_number: 1,
            }
        },

        watch: {
            '$route' (route) {
                this.getSelfMilestones(this);
            }
        },
        components: {
            'pm-header': header,
            'new-milestone-form': new_milestone_form,
            'pm-do-action': do_action,
            'pm-pagination': pagination,
            'late-milestones': late_milestones,
            'upcomming-milestone': upcoming_milestones,
            'completed-milestones': completed_milestones
        },
        computed: {
            milestoneTemplate () {
                return this.$store.state.projectMilestones.milestone_template;
            },
            blankTemplate () {
                return this.$store.state.projectMilestones.blank_template;
            },
            is_milestone_form_active () {
                return this.$store.state.projectMilestones.is_milestone_form_active;
            },

            milestones () {
                return this.$store.state.projectMilestones.milestones;
            },

            total_milestone_page () {
                if(typeof this.$store.state.projectMilestones.milestone_meta !== 'undefined'){
                    return this.$store.state.projectMilestones.milestone_meta.total_pages;
                }
                return false;
            },

            isFetchMilestone () {
                return this.$root.$store.state.projectMilestoneLoaded;
            }
        },
        methods: {
            
        }
    }

</script>

<style>
    
</style>