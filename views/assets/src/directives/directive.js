import clickOutside from '@helpers/click-outside';

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

pm.Vue.directive('pm-tooltip', {
	inserted: function(el) {
		jQuery(el).tipTip();
	},
});

pm.Vue.directive('pm-click-outside', clickOutside);