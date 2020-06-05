<!-- <pm-round-progress-bar height="100">

	<div>90%</div>
</pm-round-progress-bar>  -->

<template>
	<div class="progress-content"
		:style="{
			'height': `${height}px`,
			'width': `${height}px`,
		}"
	>
  
	    <div 
	    	class="circle" 
	    	:style="{
	    		'clip': circle(),
	    		'border-color': borderColor()
	    	}"
	    />

	    <div class="round-progress-text"><slot></slot></div>
	</div>
</template>

<script>
	export default {
		props: {
			height: {
				type: [String],
				default () {
					return 100
				}
			},

			progress: {
				type: [Number],
				default () {
					return 90
				}
			}
		},

		methods: {
			circle () {
				let progress = (this.progress/100)*this.height;

				if ( progress <= 0 ) {
					return `rect(auto ${this.height}px auto auto)`;
				} 
				
				return `rect(auto ${progress}px auto auto)`;
			},

			borderColor () {
				let progress = (this.progress/100)*this.height;

				if ( progress <= 0 ) {
					return '#dc3131';
				} 

				return '#0073aa';
			}
		}
	}
</script>

<style lang="less">
	.progress-content {

		position: relative;
		border-radius: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		.circle {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2px solid;
			position: absolute;
			border-radius: 100%;
		}

		.round-progress-text {
			height: 100%;
			width: 100%;
			border: 1px solid transparent;
			border-radius: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #eee;
		}
	} 
</style>
