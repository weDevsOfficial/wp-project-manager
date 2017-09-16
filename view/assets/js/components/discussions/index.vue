<template>
	<div>
		<router-view name="discussions"></router-view>
		<router-view name="individual-discussion"></router-view>
	</div>
</template>

<script>
    import header from './../header.vue';

    export default {
        components: {
            'pm-header': header
        }
    }

</script>
