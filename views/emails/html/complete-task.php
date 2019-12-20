<?php

$tpbk = config('frontend.assets_url') .'images/tpbk.png';

?>

<div style="width:600px;  background: #fff;">

    <div style="width: 600px;">
        <div style="background-image: url('<?php echo esc_url($tpbk); ?>'); background-repeat: no-repeat; height: 174px; width: 600px;">
            <div style="font-family: 'Lato', sans-serif; font-wight: bold; color: #fff; font-size: 30px; padding-top: 26px; text-align: center;">
                <?php esc_html_e( 'Task status has been changed', 'wedevs-project-manager' ); ?>
            </div>
        </div>

    </div>
    <div style="padding: 0 50px; text-align: justify; background-repeat: no-repeat;">
        <div style="margin: 40px 0 20px;">

            <p style="font-family: lato; color: #7e7e7e; padding-right: 10px;">
                <?php
//                esc_html_e( sprintf( '%1$s has updated the status of a task, %2$s, from <strong>%3$s</strong> to <strong>%4$s</strong>.', $changed_by, $title, $old_value, $new_value ), 'pm', 'wedevs-project-manager');
                  echo wp_sprintf( '%1$s has updated the status of a task, %2$s, from <strong>%3$s</strong> to <strong>%4$s</strong>.', esc_html($changed_by), esc_html($title), esc_html($old_value), esc_html($new_value) );

                ?>
            </p>
        </div>
        <div style="margin: 40px 0 20px;">
            <em style="font-family: lato; color: #B3B3B3;padding-right: 5px;"><?php esc_html_e( 'Changed by', 'wedevs-project-manager' ); ?></em>
            <strong style="font-family: lato; color: #7e7e7e; padding-right: 10px;">
                <?php echo esc_html($changed_by); ?>
            </strong>
        </div>
        <div style="margin: 20px 0 10px; ">
            <em style="font-family: lato; color: #B3B3B3; "><?php esc_html_e( 'due date', 'wedevs-project-manager' ) ?></em>
            <strong style="font-family: lato; color: #7e7e7e;">
                <span style="padding-right: 5px;"><?php echo esc_html($due_date['date']) ?></span>
            </strong>
            <?php if( $start_at !== null ){ ?>
                <em style="font-family: lato; color: #B3B3B3; "><?php esc_html_e( 'start at', 'wedevs-project-manager' ) ?></em>
                <strong style="font-family: lato; color: #7e7e7e;">
                    <span style="padding-right: 5px;"><?php echo esc_html($start_at['date']); ?></span>
                </strong>
            <?php } ?>
        </div>

        <div style="font-family: arial; font-size: 14px; line-height: 24px;">
            <p><?php echo esc_html($title); ?></p>
            <p><?php echo esc_html( $description ); ?></p>
            <div style="clear: both;"></div>
        </div>
    </div>

    <center>
        <div style="padding: 18px; margin: 30px auto 45px; border-radius: 30px; background: #00b1e7; width: 171px; text-align: center;">

            <a href="<?php echo esc_url($link.'#/projects/'.$project_id . '/task-lists/tasks/'. $id); ?>" style="font-family: lato; font-size: 16px; text-decoration: none; color: #fff;">
                <?php esc_html_e( 'View Task', 'wedevs-project-manager' ); ?>
            </a>

        </div>
    </center>
</div>
