<template>
	<router-view></router-view>
</template>

<script>
	export default {
		created () {
			
			if ( '/' === this.$route.path ) {
				this.$router.push(
					{
						name: 'project_lists'
					}
				);
			}
		}
	}
</script>