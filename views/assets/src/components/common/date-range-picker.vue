<template>
	
	<div 
		v-if="!options.input" 
		v-date-field 
		:class="`${id} ${contentClass} nonsortable`"
	>
		<slot></slot>
	</div>

	<input 
		v-else
		type="text" 
		:placeholder="options.placeholder" 
		:class="`${id} ${contentClass} nonsortable`"
		v-date-field
	/>
	
</template>

<style lang="less">
	.daterangepicker {
		z-index: 99999 !important;
	}
</style>

<script>

	const datePicker = (el, binding, vnode) => {
		var self = vnode.context;

		if(self.startDate != '') {
			self.options.startDate = new Date( self.startDate );
		}

		if(self.endDate != '') {
			self.options.endDate = new Date( self.endDate );
		}
		
        jQuery(`.${self.id}`).daterangepicker( self.options);

		jQuery(`.${self.id}`).on('apply.daterangepicker', function(ev, picker) {
			self.$emit('apply', picker.startDate, picker.endDate, self.id);
		});

		jQuery(`.${self.id}`).on('cancel.daterangepicker', function(ev, picker) {
		    self.$emit('cancel', self.id);
		});

		self.open();
	}

	pm.Vue.directive('date-field', {
	    inserted (el, binding, vnode) {
	        datePicker(el, binding, vnode)
	    },
	    update (el, binding, vnode) {
	    	//datePicker(el, binding, vnode)
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
			},
			contentClass: {
				type: [String],
				default () {
					return ''
				}
			}
		},
		data () {
			return {
				dateValue: '',
				id: ''
			}
		},

		created () {
			this.id = `pm-daterangepicker-${this.getUniqueRandomNumber()}`;
		},

        methods: {
        	open () {
        		if(!this.options.autoOpen) {
        			return;
        		}

        		jQuery(`.${this.id}`).trigger('click');
        	}
        }
	}
</script>
