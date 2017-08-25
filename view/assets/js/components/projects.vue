<template>
	<div id="projects">
		{{ test }}
		<p>I am project wrap its working awesome</p>
	</div>
</template>

<script>

export default {
	data () {
		return {
			test: 'I am testing mode'
		}
	}
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#projects {
		background: green;
	}

</style>