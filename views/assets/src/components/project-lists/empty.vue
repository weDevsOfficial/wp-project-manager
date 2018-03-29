<template>
	<router-view></router-view>
</template>

<script>
	export default {
		created () {
			
			if ( '/projects' === this.$route.path ) {
				this.$router.push(
					{
						name: 'project_lists'
					}
				);
			}
		},

		watch: {
			'$route' () {
				if ( '/projects' === this.$route.path ) {
					this.$router.push(
						{
							name: 'project_lists'
						}
					);
				}
			}
		}
	}
</script>