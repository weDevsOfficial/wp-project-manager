<template>
	<input type="text" :placeholder="options.placeholder" class="pm-daterangepicker" :value="dateValue">
</template>

<script>
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
				type: [String],
				default () {
					return ''
				}
			},
			endDate: {
				type: [String],
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
		mounted: function() {
			var self = this;

			if(self.startDate != '') {
				self.options.startDate = self.startDate;
			}

			if(self.endDate != '') {
				self.options.endDate = self.endDate;
			}
			
            jQuery('.pm-daterangepicker').daterangepicker(self.options);

			jQuery('.pm-daterangepicker').on('apply.daterangepicker', function(ev, picker) {
				self.$emit('apply', picker.startDate, picker.endDate, 'pm-daterangepicker');
			});

			jQuery('.pm-daterangepicker').on('cancel.daterangepicker', function(ev, picker) {
			    self.$emit('cancel', 'pm-daterangepicker');
			});

			// if(self.options.startDate && self.options.endDate) {
			// 	jQuery('.pm-daterangepicker').val(self.options.startDate +'-'+self.options.endDate);
			
			// } else if (self.options.startDate && !self.options.endDate) {
			// 	jQuery('.pm-daterangepicker').val(self.options.startDate);
			
			// } else if (!self.options.startDate && self.options.endDate) {
			// 	jQuery('.pm-daterangepicker').val(self.options.endDate);
			// } else {
			// 	jQuery('.pm-daterangepicker').val('');
			// }
			
        }
	}
</script>
