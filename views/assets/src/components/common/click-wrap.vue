<template>
	<fragment>
    	<slot></slot>
	</fragment>
</template>


<script>
	export default {
		
		mounted () {
			var self = this,
				clickInside = false;

			document.body.addEventListener('click', function(ele) {
		        var hasEl = jQuery(ele.target).closest(self.$el);
		        
		        if(hasEl.length) {
		            clickInside = true;
		        } else {
		        	clickInside = false;
		        }

		        self.$emit('afterClick', clickInside)
		    });
		}
	}
</script>

