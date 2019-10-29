<template>
	<div class="pm-date-range-picker-wrap">
		<input type="text" @keyup.self="keyUp" :placeholder="options.placeholder" class="pm-daterangepicker" value="">
		<span :class="getClass()" @click.prevent="clearField()"></span>
	</div>
</template>

<style lang="less">
	.pm-date-range-picker-wrap {
		position: relative;
		.flaticon-pm-cross {
			position: absolute;
			cursor: pointer;
		    right: 4%;
		    top: 2px;
			&::before {
				font-size: 8px !important;
			}
		}
	}
</style>

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
			
			jQuery( document ).ready(function() {
			    jQuery('.pm-daterangepicker').daterangepicker(self.options);

				jQuery('.pm-daterangepicker').on('apply.daterangepicker', function(ev, picker) {
					self.$emit('apply', picker.startDate, picker.endDate, 'pm-daterangepicker');
				});

				jQuery('.pm-daterangepicker').on('cancel.daterangepicker', function(ev, picker) {
				    self.clearField();
				});
			});
        },

        methods: {
        	keyUp (e) {
        		var self = this;
        		
        		if(e.target.value == '') {
				    self.clearField();
        		}
        	},

        	clearField () {
        		this.$emit('cancel', 'pm-daterangepicker');
        	},

        	getClass() {
        		return this.startDate == '' && this.endDate == '' ? '' : 'flaticon-pm-cross';
        	}
        }
	}
</script>
