<script>

	import mixin from '../mixin';
	
	function CPMGetComponents() {
		var components = {};
		
		window.cpm_component_lists.map(function(obj, key) {
			obj.property.mixins = [mixin];
			components[obj.component] = obj.property;
		});

		return components;
	}

	var temp = {
		props: ['hook'],

		components: CPMGetComponents(),

		render (h) {
			var components = [],
				self = this;

			window.cpm_component_lists.map(function(obj, key) {
				if (obj.hook == self.hook) {
					components.push(h(obj.component));
				}
			});

			return h('div', {}, components);
		}
	}

	export default temp;

</script>