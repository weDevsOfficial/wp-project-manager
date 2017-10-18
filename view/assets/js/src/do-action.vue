<script>

	import mixin from '../mixin';
	
	function PMGetComponents() {
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

		components: PMGetComponents(),

		render (h) {
			var components = [],
				self = this;

			window.weDevs_PM_Components.map(function(obj, key) {
				if (obj.hook == self.hook) {
					components.push(h(obj.component));
				}
			});

			return h('span', {}, components);
		}
	}

	export default action;

</script>

<!-- <template>
	<div>
		<pm-test-component></pm-test-component>
		<pm-again-component></pm-again-component>
	</div>
</template> -->
