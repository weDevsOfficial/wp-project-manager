<script>

	import mixin from '../mixin';
	
	function CPMGetComponents() {
		var components = {};
		
		window.weDevs_PM_Components.map(function(obj, key) {
			if (obj.property.mixins) {
				obj.property.mixins.push(mixin);
			} else {
				obj.property.mixins = [mixin];
			}

			components[obj.component] = obj.property;
		});

		return components;
	}

	var action = {
		props: ['hook'],

		components: CPMGetComponents(),

		render (h) {
			var components = [],
				self = this;

			window.weDevs_PM_Components.map(function(obj, key) {
				if (obj.hook == self.hook) {
					components.push(h(obj.component));
				}
			});

			return h('div', {}, components);
		}
	}

	export default action;

</script>