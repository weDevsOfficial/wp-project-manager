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

        // if ( this.$route.path && ( '/calender' !== this.$route.path || '/progress' !== this.$route.path || 'woo-project' !== this.$route.path ) ) {
        //   document.querySelector( '.pm-content-overlay' ).remove();
        // }
			}
		}
	}
</script>
