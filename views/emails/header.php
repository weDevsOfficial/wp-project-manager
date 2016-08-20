<?php
$logo_path   = cpm_get_option( 'logo', 'cpm_general' );
$date        = cpm_date2mysql( current_time( 'mysql' ) );
$custom_date = date( 'l, d F Y', strtotime( $date ) );
$calendar    = CPM_URL . '/assets/images/calendar.png';
?>

<div style="background: #f5f5f5; padding-bottom: 30px;">
    <div style="width:600px; margin: 0 auto; background: #fff;">
        <table cellspacing="0" cellpadding="0">
            <tr>
                <td>

                    <div style="height:9px; width: 100%; background: #858585;">&nbsp;</div>
                    <div style="height: 83px; width: 100%; background: #ededed;">
                        <div style="float: left; margin-left: 50px; margin-top: 21px;"><a href="<?php echo home_url(); ?>"><img src="<?php echo $logo_path; ?>"></a></div>
                        <div style="float: right; margin-right: 50px; margin-top: 33px;">
                            <img style="float: left;" src="<?php echo $calendar; ?>">
                            <div style="float: right; margin: 3px 10px; font-family: arial; font-size: 13px;"><?php echo $custom_date; ?></div>
                            <div style="clear: both;"></div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>