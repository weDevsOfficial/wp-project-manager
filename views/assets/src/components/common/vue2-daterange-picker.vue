<template>
	<date-range-picker
        ref="picker"
        :opens="opens"
        :locale-data="{ format: 'yyyy-mm-dd' }"
        :minDate="minDate" 
        :maxDate="maxDate"
        :singleDatePicker="singleDatePicker"
        :timePicker="timePicker"
        :timePicker24Hour="timePicker24Hour"
        :showWeekNumbers="showWeekNumbers"
        :showDropdowns="showDropdowns"
        :autoApply="autoApply"
        :ranges="ranges"
        v-model="date"
        @update="updateValues"
        :linkedCalendars="linkedCalendars"
	/>

</template>

<style lang="less">
	.vue-daterange-picker {
		.reportrange-text {
			line-height: 1rem;
		}

		.dropdown-menu {
			top: 25px;

			.yearselect {
				width: 68px;
			}
		}
		
	}
</style>

<script>
	import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
	import Vue2DateRangePicker from 'vue2-daterange-picker'

	export default {
		props: {

			opens: {
				type: [String],
				default () {
					return 'center'
				}
			},

			ref: {
				type: [String],
				default () {
					return 'picker'
				}
			},

			minDate: {
				type: [String],
				default () {
					return new Date('01-01-1970')
				}
			},

			maxDate: {
				type: [String],
				default () {
					return new Date('01-01-2040')
				}
			},

			singleDatePicker: {
				type: [Boolean],
				default () {
					return false
				}
			},

			timePicker: {
				type: [Boolean],
				default () {
					return false
				}
			},

			timePicker24Hour: {
				type: [Boolean],
				default () {
					return true
				}
			},

			showWeekNumbers: {
				type: [Boolean],
				default () {
					return false
				}
			},

			showDropdowns: {
				type: [Boolean],
				default () {
					return false
				}
			},

			autoApply: {
				type: [Boolean],
				default () {
					return false
				}
			},

			linkedCalendars: {
				type: [Boolean],
				default () {
					return true
				}
			},

			dateFormat: {
				type: [String],
				default () {
					return 'YYYY-MM-DD'
				}
			},

			startDate: {
				type: [String, Object],
				default () {
					return new Date()
				}
			},

			endDate: {
				type: [String, Object],
				default () {
					return new Date()
				}
			},

			ranges: {
				type: [Boolean],
				default () {
					return false
				}
			}
		},

		data () {
			return {
				date: {
					startDate: this.startDate,
					endDate: this.endDate
				},
			}
		},
			
		created () {
			
		},

		components: {
			'date-range-picker': Vue2DateRangePicker
		},

        methods: {
        	updateValues(date) {
        		this.$emit('update', date);
        	}
        }
	}
</script>
