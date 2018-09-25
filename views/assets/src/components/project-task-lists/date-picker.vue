<template>
    <input type="text" class="pm-datepicker" :value="dateValue">
</template>

<script>
    export default {
        props: ['value', 'dependency'],
        data () {
            return {
                dateValue: ''
            }
        },
        created () {
            if(!this.value) {
                return '';
            }
            var date = new Date(this.value);
            date = pm.Moment(date).format('YYYY-MM-DD');
            this.dateValue = date;
        },
        mounted: function() {
            var self = this,
                limit_date = ( self.dependency == 'pm-datepicker-from' ) ? "maxDate" : "minDate";

            jQuery( self.$el ).datepicker({
                dateFormat: 'yy-mm-dd',
                changeYear: true,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    jQuery( "."+ self.dependency ).datepicker( "option", limit_date, selectedDate );
                },
                onSelect: function(dateText) {
                   self.$emit('input', dateText);
                }
            })
            jQuery(self.$el).on("change", function() {
                var date = jQuery(self.$el).val();
                self.$emit('input', date);
            });
        },
    }
</script>
