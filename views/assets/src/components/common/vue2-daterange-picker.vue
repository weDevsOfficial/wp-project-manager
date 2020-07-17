<template>
	<div class="pm-vue2-daterange-picker">
		<date-range-picker
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
	        @select="select"
		>


		    <template v-if="!customTemplate" slot="input" scop="date" style="min-width: 350px;">
		    	<div class="pm-daterange-view">
		    		<i class="glyphicon glyphicon-calendar fa fa-calendar item"></i>
		    		<span class="item date-text">{{ getDate( date ) }}</span>
		    	</div>
		      
		    </template>

		    <template v-if="customTemplate" slot="input">
		    	<slot name="insert"></slot>
		    </template>

		    <template v-if="customTemplate" slot="footer"><slot name="footer-content"></slot></template>

		</date-range-picker>

		<a 
			v-if="hasDate( date ) && !disabledCancelBtn" 
			class="btn item" 
			href="#" @click.prevent="deleteDate(date)"
		>
	        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 241.171 241.171" style="enable-background:new 0 0 241.171 241.171;" xml:space="preserve"><path id="Close" d="M138.138,120.754l99.118-98.576c4.752-4.704,4.752-12.319,0-17.011c-4.74-4.704-12.439-4.704-17.179,0 l-99.033,98.492L21.095,3.699c-4.74-4.752-12.439-4.752-17.179,0c-4.74,4.764-4.74,12.475,0,17.227l99.876,99.888L3.555,220.497 c-4.74,4.704-4.74,12.319,0,17.011c4.74,4.704,12.439,4.704,17.179,0l100.152-99.599l99.551,99.563 c4.74,4.752,12.439,4.752,17.179,0c4.74-4.764,4.74-12.475,0-17.227L138.138,120.754z"/></svg>
	    </a>
	</div>

</template>

<style lang="less">
	.pm-vue2-daterange-picker {
		display: flex;
		align-items: center;

		.btn {
			padding: 0 10px;

			&:hover {
				svg {
					fill: #e46c6c;
				    stroke-width: 30px;
				    stroke: #e46c6c;
				}
			}

			svg {
				height: 8px;
				width: 8px;
				fill: #000;
			}
		}

		.vue-daterange-picker {
			min-width: auto !important
		}
	}

	.vue-daterange-picker {
		.pm-daterange-view {
			display: flex;
			align-items: center;

			.item {
				margin-right: 5px;
			}

			.date-text {
				margin-right: 0;
			}
		}

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

			minDate: {
				type: [String, Date],
				default () {
					return new Date('01-01-1970')
				}
			},

			maxDate: {
				type: [String, Date],
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
				type: [String, Object, Date],
				default () {
					return new Date()
				}
			},

			endDate: {
				type: [String, Object, Date],
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

			customTemplate: {
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
			},

			disabledCancelBtn: {
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
        	deleteDate (date) {
        		date.startDate = '';
        		date.endDate = '';

        		this.updateValues(date);
        	},

        	getDate ( date ) {
        		if( 
        			(
        				!this.isEmpty(date.startDate)
        					&&
        				this.hasTaskStartField()
        			)
        				&& 
        			!this.isEmpty(date.endDate)
        				&&
        			!this.singleDatePicker 
        		) {
        			return pm.Moment(date.startDate).format('MMM DD') +' - '+ pm.Moment(date.endDate).format('MMM DD');
        		}

        		if( 
        			!this.isEmpty(date.startDate) 
        				&& 
        			this.hasTaskStartField() 
        				&&
        			!this.singleDatePicker
        		) {
        			return pm.Moment(date.startDate).format('MMM DD');
        		}
        		
        		if( !this.isEmpty(date.endDate) ) {
        			return pm.Moment(date.endDate).format('MMM DD');
        		}

        		return '';
        	},

        	hasDate (date) {

        		if(this.getDate(date)) {
        			return true;
        		}

        		return false;
        	},

        	updateValues(date) {
        		this.$emit('update', date);
        	},

        	select (date) {
        		this.$emit('select', date);
        	}
        }
	}
</script>
