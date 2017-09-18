<template>
	<select>
        <option value="-1">
            - Milestone -
        </option>
        <option v-for="milestone in milestones" :value="milestone.id">
            {{ milestone.title }}
        </option>
    </select>
</template>

<script>
	export default {
		props: ['milestones'],
	}
</script>