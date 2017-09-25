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
      
            <div  v-for="milestone in milestones" class="cpm-complete-milestone cpm-milestone-data">
                <h2 class="group-title">Completed Milestones</h2>

                <div class="cpm-milestone complete">
                    <div class="milestone-detail ">
                        <h3 class="milestone-head">
                            {{ milestone.title }} <br>
                            <ul class="cpm-links cpm-right">
                                <li>
                                    <a @click.prevent="showHideMilestoneForm('toggle', milestone)" class="cpm-icon-edit dashicons dashicons-edit " data-id="107" data-project_id="98" href="#" title="Edit Milestone"></a>
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
                            <div v-html="milestone.description"></div>
                        </div>
                    </div>

                    <div class="cpm-milestone-edit-form" v-if="milestone.edit_mode">
                        <new-milestone-form section="milestones" :milestone="milestone"></new-milestone-form>
                    </div>
                    <div class="cpm-milestone-items-details">
                        <div v-if="milestone.task_lists.data.length"  class="cpm-col-6 cpm-milestone-todo cpm-sm-col-12">
                            <h3>Task List</h3>

                            <ul>
                                <li v-for="list in milestone.task_lists.data">
                                    <div class="cpm-col-7">
                                        <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=single&amp;pid=98#/list/102">{{ list.title }}</a>
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

                        <div v-if="milestone.discussion_boards.data.length"  class="cpm-col-6 cpm-milestone-discussion cpm-last-col cpm-sm-col-12">
                            <h3>Discussion</h3>

                            <ul>
                                <li v-for="milestone in milestone.discussion_boards.data">
                                    <div class="cpm-col-5">
                                        <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=98&amp;mid=116">{{ milestone.title }}</a>
                                    </div>

                                    <div class="cpm-col-4 ">
                                        <span class="time">
                                            <time datetime="2017-09-20T11:15:00+00:00" title="2017-09-20T11:15:00+00:00">September 20, 2017 11:15 am</time>                                    </span>
                                    </div>
                                    <div class="cpm-col-2">
                                        <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin"><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=28&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=28&amp;r=g&amp;d=mm 2x" class="avatar avatar-28 photo" height="28" width="28"></a>admin                                </div>
                                    <div class="clearfix"></div>
                                </li>
                                <li>
                                    <div class="cpm-col-5">
                                        <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=98&amp;mid=109">Discuss 2</a>
                                    </div>

                                    <div class="cpm-col-4 ">
                                        <span class="time">
                                            <time datetime="2017-09-12T04:14:31+00:00" title="2017-09-12T04:14:31+00:00">September 12, 2017 4:14 am</time>                                    </span>
                                    </div>
                                    <div class="cpm-col-2">
                                        <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin"><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=28&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=28&amp;r=g&amp;d=mm 2x" class="avatar avatar-28 photo" height="28" width="28"></a>admin                                </div>
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

        <pm-pagination 
            :total_pages="total_milestone_page" 
            :current_page_number="current_page_number" 
            component_name='milestone_pagination'>
            
        </pm-pagination> 


        <pm-do-action hook="component-lazy-load"></pm-do-action>
    </div>
</template>


<script>
    import header from './../header.vue';
    import new_milestone_form from './new-milestone-form.vue';
    import pagination from './../pagination.vue';
    import do_action from './../do-action.vue';

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