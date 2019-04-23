<template>
    <input type="text" :value="value">
</template>

<script>
    export default {
        props: ['value', 'dependency','field_type'],
        mounted: function() {
            var self = this,
                limit_date = ( self.dependency == 'pm-datepickter-from' ) ? "maxDate" : "minDate",
                cur_field_type = (self.field_type == 'date') ? false : true ;;

            /*jQuery( self.$el ).datetimepicker({
                dateFormat: 'yy-mm-dd',
                changeYear: true,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    jQuery( "."+ self.dependency ).datetimepicker( "option", limit_date, selectedDate );
                },
                onSelect: function(dateText) {
                   self.$emit('input', dateText);
                }
            });*/
            
            var dateObj = {
                dateFormat: 'yy-mm-dd',
                changeYear: true,
                changeMonth: true,
                numberOfMonths: 1,
                showTimepicker: false,
                onClose: function( selectedDate ) {
                    jQuery( "."+ self.dependency ).datetimepicker( "option", limit_date, selectedDate );
                },
                onSelect: function(dateText) {
                    self.$emit('input', dateText);
                }
            };
            if(!cur_field_type){
                jQuery( self.$el ).datetimepicker(dateObj);
            }else{
                jQuery( self.$el ).keyup(function(event){
                    var dateText = event.target.value;
                    self.$emit('input', dateText);
                })
            }
        },
    }
</script>