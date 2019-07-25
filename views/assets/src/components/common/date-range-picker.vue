<template>
	<input type="text" class="pm-daterangepicker" :value="dateValue">
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
			
            jQuery('.pm-daterangepicker')
            	.daterangepicker( self.options, function(start, end, label) {
					self.$emit('onChange', start, end, label);
				});
        }
	}
</script>
