<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Your Message Subject or Title</title>
</head>
<body style="margin: 0; padding: 0; background: #ccc; font-family: 'Roboto', sans-serif; font-weight: 300; box-sizing: border-box;">
    <table  align="center" border="1" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background: #fff; border:1px solid #f2f2f2;">
        <tr style="border-bottom: 1px solid #f2f2f2;">
            <td style="padding: 50px;">
                
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
                                alt="User Name" 
                                title="User Name"
                            />
                        </td>
                        <td>
                            <div style="margin-left: 10px;">
                                <h1 style="margin: 0 0 7px; font-weight: bold; font-size: 18px; color: #000000; letter-spacing: 0.16px; line-height: 22px;">
                                    <?php echo esc_html( $creator['data']['display_name'] ); ?> <?php _e( 'updated the task', 'wedevs-project-manager' ); ?>
                                </h1>
                                <a style="text-decoration: none; font-size: 15px; color: #0676D4; letter-spacing: 0.14px; line-height: 22px;" href="<?php echo esc_url($link.'#/projects/'.$project_id . '/task-lists/tasks/' . $id); ?>" target="_blank"><?php _e( 'View this task', 'wedevs-project-manger' ); ?></a> 
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
                        <td colspan="2">
                            <p style="font-size: 16px; line-height: 30px; margin: 0; color: #7E8690;"><?php _e( 'Task', 'wedevs-project-manager' ); ?></p>
                            <h2 style="font-size: 18px; color: #000; margin: 0;"><?php echo esc_html( $title ); ?></h2>
                            &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="font-size: 16px; line-height: 30px; margin: 0; color: #7E8690;"><?php _e( 'Assign To', 'wedevs-project-manager' ); ?></p>
                            <p style="font-size: 16px; color: #000000; line-height: 30px; margin: 0;">
                                <?php
                                    $assign_users = [];
                                    foreach( $assignees['data'] as $assign ) {
                                        $assign_users[] = esc_html( $assign->display_name );
                                    }

                                    echo implode( ', ', $assign_users );
                                ?>
                            </p>
                        </td>
                        <td style="padding-left: 80px;">
                            <p style="font-size: 16px; line-height: 30px; margin: 0; color: #7E8690;"><?php _e( 'Due Date', 'wedevs-project-manager' ); ?></p>
                            <p style="font-size: 16px; color: #000000; line-height: 30px; margin: 0;">
                                <?php

                                    echo empty( $due_date['date'] ) ? '&#x02013;&#x02013;' : pm_date_format( esc_html( $due_date['date'] ) );
                                ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            &nbsp;
                            <p style="font-size: 16px; line-height: 30px; margin: 0; color: #7E8690;"><?php _e( 'Project', 'wedevs-project-manager' ); ?></p>
                            <h2 style="font-size: 18px; color: #000; margin: 0;"><?php echo esc_html( $project_title ); ?></h2>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="2">
                            &nbsp;
                            <p style="font-size: 16px; line-height: 30px; margin: 0; color: #7E8690;"><?php _e( 'Task description', 'wedevs-project-manager' ); ?></p>
                            <div style="padding: 24px 30px; background: #edeef45e; border: 1px solid #f2f2f2; border-radius: 5px; margin-bottom: 30px; line-height: 26px; margin-top: 10px;">
                                <?php echo empty( $description['html'] ) ? __( 'No description found!', 'wedevs-project-manager' ) : $description['html']; ?>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="2">
                            &nbsp;
                            <a style="text-decoration: none; color: #0676D4; display: inline-block; padding: 9px 24px; font-size: 15px; color: #FFFFFF; letter-spacing: 0.14px; line-height: 30px; transition: opacity .2s; background: #7D60FF; border-radius: 3px;" href="<?php echo esc_url($link.'#/projects/'.$project_id . '/task-lists/tasks/' . $id); ?>" target="_blank">
                                <?php _e( 'View Task', 'wedevs-project-manager'); ?>
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
                        <?php _e( 'Collaborators', 'wedevs-project-manager'); ?>
                    </h2>
                    <span style="margin: 0; padding: 0; list-style: none; display: inline-block;">

                         <?php

                            foreach( $assignees['data'] as $assign ) {
                                ?>

                                    <img style="outline:none; margin-right: 4px; text-decoration:none; height: 33px; width: 33px; border-radius: 50%;" src="<?php echo esc_url( $assign->avatar_url ); ?>" alt="User Name" title="User Name" width="33" height="33" />
                                <?php
                            }

                        ?>
                
                    </span>
                </div>
            </td>
        </tr>
        
    </table>
</body>
</html>
