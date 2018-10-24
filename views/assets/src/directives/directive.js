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
		
		node.prettyPhoto({
			allow_resize: true,
			social_tools: '',
			allow_expand: true,
			deeplinking: false,
		} );
		
	},
});

pm.Vue.directive('pm-tooltip', {
	inserted: function(el) {
		jQuery(el).tipTip();
	},
});

pm.Vue.directive('pm-popper', {
	inserted: function(el) {
		const reference = document.querySelector('#popper-ref');
		const popper = document.querySelector('#poppercontent');
		var popperss = new Popper(reference, popper, {
		    placement: 'bottom'
		});
	},
});

pm.Vue.directive('pm-click-outside', clickOutside);

pm.Vue.directive('pm-header-menu-responsive', {
	inserted: function(el) {
		jQuery(el).slicknav({
				prependTo:'.pm-header-menu-wrap'
		});
	},
});






