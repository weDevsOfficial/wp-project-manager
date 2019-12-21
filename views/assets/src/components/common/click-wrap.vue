<template>
	<fragment>
    	<slot></slot>
	</fragment>
</template>


<script>
	export default {
		
		mounted () {
			var self = this;
				

			jQuery('body').on('click', function(ele) {
		        self.eventTrigger(ele);
		    });

			
		},

		methods: {
			eventTrigger(ele) {
				var clickInside = false;
				var hasEl = jQuery(ele.target).closest(this.$el);
				
		        if(hasEl.length) {
		            this.$emit('clickInSide')
		        } else {
		        	this.$emit('clickOutSide')
		        }
			}
		}
	}
</script>

