<template>
 <ul class="pm-links pm-right">
    <li>
        <a @click.prevent="showHideMilestoneForm('toggle', milestone)" class="pm-icon-edit dashicons dashicons-edit " :title="text.edit_milestone"></a>
    </li>
    <li>
        <a @click.prevent="deleteMilestone(milestone.id)" class="pm-milestone-delete dashicons dashicons-trash" :title="text.delete_milestone" href="#"></a>
    </li>

    <li>
        <a v-if="is_complete" @click.prevent="milestoneMarkUndone(milestone)" class="pm-milestone-open dashicons dashicons-update" :title="text.mark_as_incomplete" href="#"></a>
    </li>
    <li>
        <a v-if="!is_complete" @click.prevent="milestoneMarkDone(milestone)" class="pm-milestone-complete dashicons dashicons-yes" :title="text.mark_as_complete" href="#"></a>
    </li>
    <li>
        <span class="pm-unlock"></span>
    </li>
</ul>
</template>

<script>
	export default {
		props: ['milestone'],

        data () {
            return {
                due_date: this.milestone.achieve_date.date,
            }
        },

        computed: {
            is_complete () {
                return this.milestone.status === 'complete' ? true : false;
            }
        }
	}
</script>