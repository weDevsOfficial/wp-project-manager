<template>
    <div class="" id="cpm-milestone-page">
        <pm-header></pm-header>
        <div class="cpm-milestone-details">
            <div class="cpm-milestone-link clearfix">
                <a @click.prevent="showHideMilestoneForm('toggle')" id="cpm-add-milestone" href="#" class="cpm-btn cpm-btn-blue cpm-plus-white">Add Milestone</a>
            </div>
            <div class="cpm-new-milestone-form" v-if="is_milestone_form_active">
                <div class="cpm-milestone-form-wrap">
                    <new-milestone-form section="milestones" :milestone="{}"></new-milestone-form>
                </div>

            </div>
            <late-milestones></late-milestones>
            <upcomming-milestone></upcomming-milestone>
            <completed-milestones></completed-milestones>
            
        </div>

        <pm-pagination 
            :total_pages="total_milestone_page" 
            :current_page_number="current_page_number" 
            component_name='milestone_pagination'>
            
        </pm-pagination> 


        <!-- <pm-do-action hook="component-lazy-load"></pm-do-action> -->
    </div>
</template>


<script>
    import header from './../header.vue';
    import new_milestone_form from './new-milestone-form.vue';
    import pagination from './../pagination.vue';
    import do_action from './../do-action.vue';
    import late_milestones from './late-milestones.vue';
    import upcoming_milestones from './upcoming-milestones.vue';
    import completed_milestones from './completed-milestones.vue';

    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getSelfMilestones(vm);
            });
        },
        data () {
            return {
                current_page_number: 1
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
            is_milestone_form_active () {
                return this.$store.state.is_milestone_form_active;
            },

            milestones () {
                return this.$store.state.milestones;
            },

            total_milestone_page () {
                return this.$store.state.total_milestone_page;
            }
        },
        methods: {
 
        }
    }

</script>

<style>
    
</style>