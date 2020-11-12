<?php
if ( function_exists( 'pm_pro_get_logo' ) ) {
    $logo_path = pm_pro_get_logo();
    $logo_path = $logo_path['url'];

    if ( !empty($logo_path) ) {
        ?>
            <center style="width: 100%;">
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%!important;min-width:100%!important">
                    <tr><td width="50%">&nbsp;</td><td width="50%">&nbsp;</td></tr>
                    <tr>
                        <td align="right" valign="middle" width="50%"><span style="color: #9c9c9c;"><?php _e( 'Made by' ) ?>&nbsp;</span></td>
                        <td align="left" valign="middle" width="50%" style="line-height: 0;">
                            <a 
                                style="
                                    display: inline-block; 
                                    text-decoration: none; 
                                    line-height: 0;"

                                href="<?php echo esc_url( home_url() ); ?>"
                            >
                                <img style="width: 100px;"  src="<?php echo esc_url( 'https://i.ibb.co/dpr63ch/pm.png'); ?>" alt="<?php echo esc_html( get_bloginfo( 'name' ) ); ?>" title="<?php echo esc_html( get_bloginfo( 'name' ) ); ?>"  />
                            </a>
                        </td>
                    </tr>
                </table>
            </center>
            
        <?php
    }

}
