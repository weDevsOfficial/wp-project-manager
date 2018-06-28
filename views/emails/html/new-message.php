<?php

$tpbk = config('frontend.assets_url') .'images/tpbk.png';

?>

<div style="width:600px;  background: #fff;">

    <div style="width: 600px;">
        <div style="background-image: url('<?php echo $tpbk; ?>'); background-repeat: no-repeat; height: 174px; width: 600px;">
            <div style="font-family: 'Lato', sans-serif; font-wight: bold; color: #fff; font-size: 30px; padding-top: 26px; text-align: center; text-transform: uppercase;">
<?php _e( 'New Message', 'wedevs-project-manager' ); ?>
            </div>
        </div>

    </div>
    <div style="padding: 0 50px; text-align: justify; background-repeat: no-repeat;">
        <div style="margin: 40px 0 10px; margin-bottom: 20px;">
            <em style="font-family: lato; color: #B3B3B3;padding-right: 5px;"><?php _e( 'Message Created By', 'wedevs-project-manager' ); ?></em>
            <strong style="font-family: lato; color: #7e7e7e; padding-right: 10px;">
<?php echo $updater ?>
            </strong>

        </div>

        <div style="font-family: arial; font-size: 14px; line-height: 24px; color: #7e7e7e;">
            <span style="float: left;  width: 70px;">
                <em style="font-family: lato; color: #B3B3B3; "><?php _e( 'Title', 'wedevs-project-manager' ); ?></em>
            </span>
            <span style="float: left; width: 430px;">
                <strong style="font-family: lato; color: #7e7e7e;">
                    <a style="text-decoration: none; font-family: lato; color: #00b1e7;" href="<?php echo $link. '#/projects/'.$project_id.'/discussions/'.$id ?>">
<?php echo $title; ?>
                    </a>

                </strong>
            </span>
            <div style="clear: both;"></div>
            <span style="float: left;  width: 70px;"><em style="font-family: lato; color: #B3B3B3; "><?php _e( 'Message', 'wedevs-project-manager' ); ?></em></span>
            <span style="float: left; width: 430px;"><?php echo $description ?></span>
            <div style="clear: both;"></div>
        </div>

    </div>
    
        <div style="padding: 18px; margin: 30px auto 45px; border-radius: 30px; background: #00b1e7; width: 171px; text-align: center;">

            <a href="<?php echo $link. '#/projects/'.$project_id.'/discussions/'.$id; ?>" style="font-family: lato; font-size: 16px; text-decoration: none; color: #fff;">
<?php _e( 'View Message', 'wedevs-project-manager' ); ?>
            </a>

        </div>
    
</div>

