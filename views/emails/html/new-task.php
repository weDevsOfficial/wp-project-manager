<?php

$tpbk = config('frontend.assets_url') .'images/tpbk.png';

?>

<div style="width:600px;  background: #fff;">

    <div style="width: 600px;">
        <div style="background-image: url('<?php echo $tpbk; ?>'); background-repeat: no-repeat; height: 174px; width: 600px;">
            <div style="font-family: 'Lato', sans-serif; font-wight: bold; color: #fff; font-size: 30px; padding-top: 26px; text-align: center;">
<?php _e( 'New task has been assigned to you', 'pm' ); ?>
            </div>
        </div>

        <div style="padding: 0 50px; text-align: justify; background-repeat: no-repeat;">
            <div style="margin: 40px 0 10px; margin-bottom: 20px;">
                <em style="font-family: lato; color: #B3B3B3;padding-right: 5px;"><?php _e( 'Created By', 'pm' ); ?></em>
                <strong style="font-family: lato; color: #7e7e7e; padding-right: 10px;">
<?php echo $creator; ?>
                </strong>
                <em style="font-family: lato; color: #B3B3B3; "><?php  __( 'Due Date', 'pm' ) ?></em>
                <strong style="font-family: lato; color: #7e7e7e;">
                    <span style="padding-right: 5px;"><?php echo $due_date ?></span>
                </strong>
            </div>

            <div style="font-family: arial; font-size: 14px; line-height: 24px;">
                <span style="float: left; width: 459px;"><?php echo $title; ?></span>
                <div style="clear: both;"></div>
            </div>

        </div>
        
        <div style="padding: 18px; margin: 30px 0 45px; border-radius: 30px; background: #00b1e7; width: 171px;">

            <a href="<?php echo $link.'#/'.$project_id . '/task/'.$id; ?>" style="font-family: lato; font-size: 16px; text-decoration: none; color: #fff;">
<?php _e( 'View Task', 'pm' ); ?>
            </a>

        </div>
        
    </div>

