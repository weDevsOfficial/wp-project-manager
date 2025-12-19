<?php

if ( function_exists( 'wedevs_pm_pro_get_logo' ) ) {
    $wedevs_pm_logo_path = wedevs_pm_pro_get_logo();
    $wedevs_pm_logo_path = $wedevs_pm_logo_path['url'];
}

$wedevs_pm_now      = wedevs_pm_format_date(current_time('mysql'));
$wedevs_pm_calendar = wedevs_pm_config('frontend.assets_url')  . 'images/calendar.png';
?>

<div style="background: #f5f5f5; padding-bottom: 30px;">
    <div style="width:600px; margin: 0 auto; background: #fff;">
        <table cellspacing="0" cellpadding="0">
            <tr>
                <td>

                    <div style="height:9px; width: 100%; background: #858585;">&nbsp;</div>
                    <div style="height: 83px; width: 100%; background: #ededed;">
                        <div style="float: left; margin-left: 7%;  padding: 15px 0px; width: 43%">
                            <a href="<?php echo esc_url(home_url()); ?>">
                                <?php if ( isset( $wedevs_pm_logo_path ) ) { ?>
                                    <img src="<?php echo esc_attr($wedevs_pm_logo_path); ?>" style="max-height: 50px;" />
                                <?php } else { ?>
                                        <h3><?php echo esc_html(get_bloginfo('name')); ?></h3>

                               <?php } ?>
                            </a>
                        </div>
                        <div style="float: right; margin-right: 5%; width: 45%; text-align: right;padding: 28px 0px;">
                            <img style="display: inline;vertical-align: middle;" src="<?php echo esc_attr($wedevs_pm_calendar); ?>">
                            <div style="display: inline;margin: 3px 10px; font-family: arial; font-size: 13px;"><?php  echo esc_html($wedevs_pm_now['date'].' ' . $wedevs_pm_now['time']); ?></div>
                            <div style="clear: both;"></div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>