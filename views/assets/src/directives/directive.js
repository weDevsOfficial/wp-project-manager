pm.Vue.directive('pm-slide-up-down', {
	inserted: function(el) {
		var node = jQuery(el);
		
		if (node.is(':visible')) {
			node.slideUp(400);
		} else {
			node.slideDown(400);
		}
		
	},
});


pm.Vue.directive('pm-pretty-photo', {
	inserted: function(el) {
		var node = jQuery(el);
		
		node.prettyPhoto();
		
	},
});