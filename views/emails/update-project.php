<?php
    cpm_get_email_header();

    $tpbk   = CPM_URL . '/assets/images/tpbk.png';
    $author = wp_get_current_user();
    ?>

    <div style="width:600px;  background: #fff;">


        <div style="width: 600px;">
            <div style="background-image: url('<?php echo $tpbk; ?>'); background-repeat: no-repeat; height: 174px; width: 600px;">
                <div style="font-family: 'Lato', sans-serif; font-wight: bold; color: #fff; font-size: 30px; padding-top: 26px; text-align: center; text-transform: uppercase;">
                    <?php _e( 'Update Project', 'cpm' ); ?>
                </div>
            </div>

            <div style="padding: 0 50px; text-align: justify; background-repeat: no-repeat;">
                <div style="margin: 40px 0 10px; margin-bottom: 20px;">
                    <em style="font-family: lato; color: #B3B3B3;padding-right: 5px;"><?php _e( 'Project Updated By', 'cpm' ); ?></em>
                    <strong style="font-family: lato; color: #7e7e7e; padding-right: 10px;">
                        <?php echo $author->display_name; ?>
                    </strong>
                </div>

                <div style="font-family: arial; font-size: 14px; line-height: 24px; color: #7e7e7e;">
                    <p><?php _e( 'Hello', 'cpm' ); ?></p>

                    <div><?php printf( __( 'You are assigned to a project update "%s" by %s.', 'cpm' ), '<b>'.$data['post_title'].'</b>', $author->display_name ) ?></div>
                    <div><?php _e( 'You can see the project by going here:', 'cpm' ); ?>
                        <a style="text-decoration: none; color: #00b1e7;" href="<?php echo cpm_url_project_details( $project_id ); ?>"><?php echo $data['post_title']; ?></a>

                    </div>

                </div>
                <center>
                    <div style="padding: 18px; margin: 30px 0 45px; border-radius: 30px; background: #00b1e7; width: 171px;">

                        <a href="<?php echo cpm_url_project_details( $project_id ); ?>" style="font-family: lato; font-size: 16px; text-decoration: none; color: #fff;">
                            <?php _e( 'View Project', 'cpm' ); ?>
                        </a>

                    </div>
                </center>
            </div>
            <?php
            cpm_get_email_footer();