<?php
$text_domain = config( 'app.text_domain' );

return [
    'update-project-title' => __( 'has updated project title ', $text_domain ) . '{$old} ' . __( 'to ', $text_domain ) . '{$new}',
];