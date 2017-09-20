<template>
    <div class="" id="cpm-milestone-page">
        <pm-header></pm-header>
        <div class="cpm-milestone-details">
            <div class="cpm-milestone-link clearfix">
                <a @click.prevent="showHideMilestoneForm('toggle')" id="cpm-add-milestone" href="#" class="cpm-btn cpm-btn-blue cpm-plus-white">Add Milestone</a>
            </div>
            <div class="cpm-new-milestone-form" v-if="is_milestone_form_active">
                <div class="cpm-milestone-form-wrap">
                    <new-milestone-form :milestone="{}"></new-milestone-form>
                </div>

            </div>

            <div class="cpm-complete-milestone cpm-milestone-data">
                <h2 class="group-title">Completed Milestones</h2>

                <div class="cpm-milestone complete">
                    <div class="milestone-detail ">
                        <h3 class="milestone-head">
                            Milestone 1 <br>
                            <ul class="cpm-links cpm-right">
                                <li>
                                    <a class="cpm-icon-edit dashicons dashicons-edit " data-id="107" data-project_id="98" href="#" title="Edit Milestone"></a>
                                </li>
                                <li>
                                    <a class="cpm-milestone-delete dashicons dashicons-trash" data-project="98" data-id="107" data-confirm="Are you sure?" title="Delete milestone" href="#"></a>
                                </li>

                                <li>
                                    <a class=" cpm-milestone-open dashicons dashicons-update" data-project="98" data-id="107" title="Mark as incomplete" href="#"></a>
                                </li>
                                <li>
                                    <span class="cpm-unlock"></span>
                                </li>
                            </ul>
                        </h3>

                        <div class="detail">
                            <div>Milestone description</div>
                        </div>
                    </div>

                    <div class="cpm-milestone-edit-form"></div>
                    <div class="cpm-milestone-items-details">
                        <div class="cpm-col-6 cpm-milestone-todo cpm-sm-col-12">
                            <h3>Task List</h3>

                            <ul>
                                <li>
                                    <div class="cpm-col-7">
                                        <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=single&amp;pid=98#/list/102">List 2</a>
                                    </div>
                                    <div class=" cpm-col-3">
                                        <div class="cpm-progress cpm-progress-info">
                                            <div style="width:33.3333333333%" class="bar completed"></div>
                                        </div>

                                    </div>
                                    <div class="cpm-col-1 cpm-right cpm-last-col">
                                        33%                                
                                    </div>
                                    <div class="clearfix"></div>
                                </li>
                            </ul>
                        </div>
                        <div class="clearfix"></div>
                    </div>

                    <div class="cpm-milestone-completed">
                        Completed on: 
                        <time datetime="2017-09-20T05:21:16+00:00" title="2017-09-20T05:21:16+00:00">September 20, 2017 5:21 am</time>            
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import header from './../header.vue';
    import new_milestone_form from './new-milestone-form.vue';

    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getMilestones(vm);
            });
        },
        components: {
            'pm-header': header,
            'new-milestone-form': new_milestone_form
        },
        computed: {
            is_milestone_form_active () {
                return this.$store.state.is_milestone_form_active;
            },

            milestones () {
                return this.$store.state.milestones;
            }
        },
        methods: {
 
        }
    }

</script>

<style>
    
</style>