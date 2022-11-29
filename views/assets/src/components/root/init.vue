<template>
	<router-view></router-view>
</template>

<script>

	export default {
		created () {
			if ( '/' === this.$route.path ) {
				this.$router.push(
					{
						name: 'projects'
					}
				);
			}
		},

		watch: {
			'$route' () {
				if ( '/' === this.$route.path ) {
					this.$router.push(
						{
							name: 'projects'
						}
					);
				}
			}
		}
	}
</script>
