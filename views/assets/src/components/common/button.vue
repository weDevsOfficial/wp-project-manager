<!--Usage for this component
<pm-button
    :label="__( 'Click Me', 'wedevs-project-manager')"
    isPrimary
    spinner
    type="button"
    @onClick="yourTarget"
/>
-->

<template>
	<div class="pm-button-wrap">
		<input 
			@click.prevent="onClick()"
			v-if="type=='submit'"
	    	type="submit"
	    	:class="{
	    		'pm-single-button': true,
	    		'pm-button-secondary': !isPrimary,
	    		'pm-button-primary': isPrimary,
	    		'active': spinner
	    	}"
	    	:value="label"
	    	:disabled="disabled"
	    />

	    <a 
	    	@click.prevent="onClick()"
	    	href="#"
	    	v-if="type=='link'"
	    	:class="{
	    		'pm-single-button': true,
	    		'pm-button-secondary': !isPrimary,
	    		'pm-button-primary': isPrimary,
	    		'active': spinner
	    	}"
	    >
			{{ label }}
		</a>

	    <button
	    	@click.prevent="onClick()"
	    	v-if="type=='button'"
	    	:class="{
	    		'pm-single-button': true,
	    		'pm-button-secondary': !isPrimary,
	    		'pm-button-primary': isPrimary,
	    		'active': spinner
	    	}"
	    	:disabled="disabled"
	    >
			{{ label }}
		</button>
	    	
	    <div 
	    	v-if="spinner" 
		    :class="{
		    	'pm-single-spinner': true,
		    	'primary': isPrimary,
		    	'secondary': !isPrimary,
		    }"
	    />
	</div>
    
</template>

<style lang="less">
	.pm-button-wrap {
		position: relative;
		display: inline-block;
		
		.pm-single-button {
			display: inline-block;
			text-decoration: none;
			font-size: 13px;
			line-height: 26px;
			height: 28px;
			margin: 0;
			padding: 0 10px 1px;
			cursor: pointer;
			-webkit-appearance: none;
			border-radius: 3px;
			white-space: nowrap;
			box-sizing: border-box;
			border: none;
		}

		.pm-button-primary {
			background: #007cba;
			color: #fff;
		}

		.pm-button-primary.active {
			color: #007cba
		}
		
		.pm-button-secondary {
			background: #f3f5f6;
			color: #555;
			border: 1px solid #e6e6e6;
		}

		.pm-button-secondary.active {
			color: #f3f5f6;
		}
		
		.pm-single-spinner {
			position: absolute;
		    transform: translate(-50%, -50%);
		    top: 50%;
		    left: 50%;
		    display: inline-flex;

			&:after {
				content: "";
				border-radius: 50%;
				display: inline-block;
				height: 1em;
				width: 1em;
				-webkit-animation: pm-single-spinner 1s infinite;
				animation: pm-single-spinner 1s infinite;
				vertical-align: middle;
			}
		}
		.pm-single-spinner.primary {
			&:after {
				border: 2px solid #f9f9f9;
    			border-color: #fafafa #fafafa #fafafa transparent;
			}
		}

		.pm-single-spinner.secondary {
			&:after {
				border: 2px solid #f9f9f9;
    			border-color: #0073aa #0073aa #0073aa transparent;
			}
		}
	}

	@keyframes pm-single-spinner {
		0% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
			animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
		}
		50% {
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}
		to {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	@-webkit-keyframes pm-single-spinner {
		0% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
			animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
		}
		50% {
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}
		to {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
</style>

<script>
	export default {
		props: {
			label: {
				type: String,
				default: __( 'Submit', 'wedevs-project-manager' )
			},

			isPrimary: {
				type: Boolean,
				default: false
			},

			type: {
				type: String,
				default: 'button'
			},

			spinner: {
				type: Boolean,
				default: false
			},

			disabled: {
				type: Boolean,
				default: false
			}
		},

		methods: {
			onClick () {
				this.$emit( 'onClick' );
			}
		}
	}

</script>
