<template>
 <ul class="cpm-links cpm-right">
    <li>
        <a @click.prevent="showHideMilestoneForm('toggle', milestone)" class="cpm-icon-edit dashicons dashicons-edit " data-id="107" data-project_id="98" href="#" title="Edit Milestone"></a>
    </li>
    <li>
        <a @click.prevent="deleteMilestone(milestone.id)" class="cpm-milestone-delete dashicons dashicons-trash" data-project="98" data-id="107" data-confirm="Are you sure?" title="Delete milestone" href="#"></a>
    </li>

    <li>
        <a class=" cpm-milestone-open dashicons dashicons-update" data-project="98" data-id="107" title="Mark as incomplete" href="#"></a>
    </li>
    <li>
        <span class="cpm-unlock"></span>
    </li>
</ul>
</template>

<script>
	export default {
		props: ['milestone']
	}
</script>