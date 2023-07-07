<template>
	<div class="pm-loading-animation-wrap">
		<div class="loading-content">
	        <div v-if="label" class="loading-label">{{ label }}</div>
	        <div class="load-spinner">
	            <div class="rect1"></div>
	            <div class="rect2"></div>
	            <div class="rect3"></div>
	            <div class="rect4"></div>
	            <div class="rect5"></div> 
	        </div>
    	</div>
    </div>
</template>

<script>
	export default {
		props: {
			label: {
				type: [String],
				default: __( 'Loading...', 'wedevs-project-manager' ) 
			}
		}
	}
</script>

<style lang="less">
	.pm-loading-animation-wrap {
		
	    .loading-content {
	    	display: flex;
	    	align-items: center;
	    	justify-content: center;
	    	padding: 15px 0;

	    	.loading-label {
	    		margin-right: 15px;
	    	}

	    	.load-spinner {
			    height: 33px;
			    
				div {
					background-color: #ccc;
				    height: 100%;
				    width: 6px;
				    display: inline-block;
				    -webkit-animation: pm-stretchdelay 1.2s infinite ease-in-out;
				    animation: pm-stretchdelay 1.2s infinite ease-in-out;
	    			font-size: 10px;
				}

				.rect2 {
				  -webkit-animation-delay: -1.1s;
				  animation-delay: -1.1s;
				}

				.rect3 {
				  -webkit-animation-delay: -1s;
				  animation-delay: -1s;
				}

				.rect4 {
				  -webkit-animation-delay: -0.9s;
				  animation-delay: -0.9s;
				}

				.rect5 {
				  -webkit-animation-delay: -0.8s;
				  animation-delay: -0.8s;
				}
			}
	    }
	}

	@-webkit-keyframes pm-stretchdelay {
	  0%,
	  40%,
	  100% {
	    -webkit-transform: scaleY(0.4);
	  }
	  20% {
	    -webkit-transform: scaleY(1);
	  }
	}
	@keyframes pm-stretchdelay {
	  0%,
	  40%,
	  100% {
	    transform: scaleY(0.4);
	    -webkit-transform: scaleY(0.4);
	  }
	  20% {
	    transform: scaleY(1);
	    -webkit-transform: scaleY(1);
	  }
	}

</style>
