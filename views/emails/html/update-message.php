<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title><?php echo esc_html( $title ); ?></title>
</head>
<body style="margin: 0; padding: 0; background: #ccc; font-family: 'Roboto', sans-serif; font-weight: 300; box-sizing: border-box;">
    <center style="width: 100%;">
        <table  align="center" border="1" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background: #fff; border:1px solid #f2f2f2;">
            <tr style="border-bottom: 1px solid #f2f2f2;">
                <td style="padding: 30px 50px;">
                    <table  style="margin-right: 20px;">
                        <tr>
                            <td>
                                <img
                                    style="
                                        outline: none;
                                        text-decoration: none;
                                        height: 48px;
                                        width: 48px;
                                        border-radius: 50%;
                                        outline: none;
                                    "
                                    src="<?php echo esc_url( $creator['data']['avatar_url'] ); ?>"
                                    alt="<?php echo esc_attr( $creator['data']['display_name'] ); ?>"
                                    title="<?php echo esc_attr( $creator['data']['display_name'] ); ?>"
                                />
                            </td>
                            <td>
                                <div style="margin-left: 10px;">
                                    <h1 style="margin: 0 0 7px; font-weight: bold; font-size: 18px; color: #000000; letter-spacing: 0.16px; line-height: 22px;">
                                        <?php echo esc_html( ucfirst( $creator['data']['display_name'] ) ); ?> <?php esc_html_e( 'update the discussion', 'wedevs-project-manager' ); ?>
                                    </h1>
                                    <a
                                        style="
                                            text-decoration: none; 
                                            font-size: 15px; 
                                            color: #0676D4; 
                                            letter-spacing: 0.14px; 
                                            line-height: 22px;" 

                                        href="<?php echo esc_url( $link . '#/projects/' . $project_id . '/discussions/' . $id ); ?>"
                                        target="_blank"
                                    >
                                        <?php esc_html_e( 'View this discussion', 'wedevs-project-manager' ); ?>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 50px;">
                    <table>
                        <tr>
                            <td>
                                <p style="font-size: 16px; line-height: 30px; margin: 0; color: #7E8690;"><?php esc_html_e( 'Discussion', 'wedevs-project-manager' ); ?></p>
                                <h2 style="font-size: 18px; color: #000; margin: 0;"><?php echo esc_html( $title ); ?></h2>
                                &nbsp;
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p style="font-size: 16px; line-height: 30px; margin: 0; color: #7E8690;">
                                    <?php esc_html_e( 'Updated at', 'wedevs-project-manager' ); ?>
                                </p>
                                <h2 style="font-size: 16px; color: #000; margin: 0; font-weight: 400;">
                                     <?php $discussion_date = empty( $updated_at['date'] ) ? '&#x02013;&#x02013;' : pm_date_format( esc_html( $updated_at['date'] ) ); ?>
                                    <?php echo esc_html( $discussion_date ); ?>
                                </h2>
                                &nbsp;
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p style="font-size: 16px; line-height: 30px; margin: 0; color: #7E8690;">
                                    <span><?php esc_html_e( 'Details', 'wedevs-project-manager' ); ?></span>
                                </p>
                                <div style="padding: 5px 15px; background: #edeef45e; border: 1px solid #f2f2f2; border-radius: 5px; margin-bottom: 30px; line-height: 26px; margin-top: 10px;">
                                    <?php echo wp_kses_data( $description ); ?>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <a 
                                    style="
                                        text-decoration: none; 
                                        color: #0676D4; 
                                        display: inline-block; 
                                        padding: 9px 24px; 
                                        font-size: 15px; 
                                        color: #FFFFFF; 
                                        letter-spacing: 0.14px; 
                                        line-height: 30px; 
                                        transition: opacity .2s; 
                                        background: #7D60FF; 
                                        border-radius: 3px;" 

                                    href="<?php echo esc_url( $link . '#/projects/' . $project_id . '/discussions/' . $id ); ?>" 
                                    target="_blank"
                                >
                                    <?php esc_html_e( 'View Discussion', 'wedevs-project-manager'); ?>
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td style="padding: 0 50px 50px;">
                    <div>
                        <h2 style="font-size: 20px; color: #000000; letter-spacing: 0.18px; line-height: 30px; margin-bottom: 15px;">
                            <?php esc_html_e( 'Discussion Members', 'wedevs-project-manager'); ?>
                        </h2>
                        <span style="margin: 0; padding: 0; list-style: none; display: inline-block;">

                             <?php

                                foreach( $project['assignees']['data'] as $assign ) {
                                    ?>

                                        <img
                                            style="
                                                outline:none;
                                                margin-right: 4px;
                                                text-decoration:none;
                                                height: 33px;
                                                width: 33px;
                                                border-radius: 50%;"

                                            src="<?php echo esc_url( $assign->avatar_url ); ?>"
                                            alt="<?php echo esc_attr( $assign->display_name ); ?>" title="<?php echo esc_attr( $assign->display_name ); ?>" width="33" height="33"
                                        />
                                    <?php
                                }

                            ?>
                    
                        </span>
                    </div>
                </td>
            </tr>
            
        </table>
    </center>
    <?php require_once dirname(__FILE__) . '/footer.php'; ?>
</body>
</html>
