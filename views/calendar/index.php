<div class="icon32" id="icon-themes"><br></div>
<h2>Calendar</h2>

<?php
CPM_Calendar::getInstance()->get_events();
?>

<div id='calendar' class="cpm-calendar"></div>

<script>
    jQuery(document).ready(function($) {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        
        
        var calendar = $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: false,
             events: {
                url: CPM_Vars.ajaxurl,
                type: 'POST',
                data: {
                    action: 'cpm_get_events',
                    _wpnonce: CPM_Vars.nonce
                },
                error: function() {
                    alert('There was an error while fetching events!');
                }
            }
        });
        
    });
</script>