<template>
	<div v-if="options.input" v-date-field class="pm-daterangepicker"></div>
	<input 
		v-else
		type="text" 
		:placeholder="options.placeholder" 
		class="pm-daterangepicker" 
		:value="dateValue"
		v-date-field
	/>
</template>

<script>

	const datePicker = (el, binding, vnode) => {
		var self = vnode.context;

		if(self.startDate != '') {
			self.options.startDate = new Date( self.startDate );
		}

		if(self.endDate != '') {
			self.options.endDate = new Date( self.endDate );
		}

        jQuery('.pm-daterangepicker').daterangepicker( self.options);

		jQuery('.pm-daterangepicker').on('apply.daterangepicker', function(ev, picker) {
			self.$emit('apply', picker.startDate, picker.endDate, 'pm-daterangepicker');
		});

		jQuery('.pm-daterangepicker').on('cancel.daterangepicker', function(ev, picker) {
		    self.$emit('cancel', 'pm-daterangepicker');
		});

		self.open();
	}

	pm.Vue.directive('date-field', {
	    inserted (el, binding, vnode) {
	        datePicker(el, binding, vnode)
	    },
	    update (el, binding, vnode) {
	    	datePicker(el, binding, vnode)
	    }
	});

	export default {
		props: {
			options: {
				type: [Object],
				default () {
					return {
						"showDropdowns": true,
					    "alwaysShowCalendars": true,
					    "singleDatePicker": true,
					}
				}
			},
			startDate: {
				type: [String, Date],
				default () {
					return ''
				}
			},
			endDate: {
				type: [String, Date],
				default () {
					return ''
				}
			}
		},
		data () {
			return {
				dateValue: ''
			}
		},

        methods: {
        	open () {
        		if(!this.options.autoOpen) {
        			return;
        		}

        		jQuery('.pm-daterangepicker').trigger('click');
        	}
        }
	}
</script>
