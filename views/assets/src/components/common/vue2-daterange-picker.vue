<template>
	<date-range-picker
        ref="picker"
        :opens="opens"
        :locale-data="localeData"
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
	>

	    <!--    input slot (new slot syntax)-->
	    <template slot="input" scop="date" style="min-width: 350px;">
	    	<div>
	    		<i class="glyphicon glyphicon-calendar fa fa-calendar"></i>
	    		<span>{{ getDate( date ) }}</span>
	    	</div>
	      
	    </template>

	</date-range-picker>

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
			},

			localeData: {
				type: [Object],
				default () {
					return {
						format: 'mmm dd'
					}
				}
			}
		},

		data () {
			return {
				date: {
					startDate: this.startDate,
					endDate: this.endDate
				},
				picker: {
					startDate: '2020-03-03',
					endDate: '2020-03-03',
				}
			}
		},
			
		created () {
			
		},

		components: {
			'date-range-picker': Vue2DateRangePicker
		},

        methods: {
        	getDate ( date ) {

        		if( 
        			(
        				!this.isEmpty(date.startDate)
        					&&
        				this.hasTaskStartField()
        			)
        				&& 
        			!this.isEmpty(date.endDate) 
        		) {
        			return date.startDate.format('MMM DD') +' - '+ date.endDate.format('MMM DD');
        		}

        		if( !this.isEmpty(date.startDate) ) {
        			return date.startDate.format('MMM DD');
        		}
        		
        		if( !this.isEmpty(date.endDate) && this.hasTaskStartField() ) {
        			return date.endDate.format('MMM DD');
        		}
        	},

        	updateValues(date) {
        		this.$emit('update', date);
        	}
        }
	}
</script>
