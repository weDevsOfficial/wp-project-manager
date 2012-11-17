<?php

$cpm_active_menu = __( 'Files', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$args = array(
    'post_type' => 'attachment',
    'meta_key' => '_project',
    'meta_value' => $project_id,
    'numberposts' => -1
);

$attachments = get_posts( $args );

if ( $attachments ) {

    echo '<ul class="cpm-files">';
    foreach ($attachments as $attachment) {
        $file = CPM_Comment::getInstance()->get_file( $attachment->ID );
        $parent = get_post( $attachment->post_parent );
        $post_type_object = get_post_type_object( $parent->post_type );

        if ( $parent->post_type == 'task' ) {
            $task_list = get_post( $parent->post_parent );
            $topic_url = cpm_url_single_task( $project_id, $task_list->ID, $parent->ID );
        } else if( $parent->post_type == 'message' ) {
            $topic_url = cpm_url_single_message( $project_id, $parent->ID );
        }
        // var_dump( $file, $parent );
        ?>        
        <li>
            <div class="cpm-thumb">
                <a href="<?php echo $file['url']; ?>"><img src="<?php echo $file['thumb']; ?>" alt="<?php echo esc_attr( $file['name'] ); ?>" /></a>
            </div>
            <div class="cpm-thumb-detail">
                <h3 class="cpm-file-name"><?php echo $file['name']; ?></h3>

                <div class="cpm-file-meta">
                    Attached to the <a href="<?php echo $topic_url; ?>">comment</a> by <?php echo cpm_url_user( $attachment->post_author ); ?>
                </div>

                <div class="cpm-file-action">
                    <a href="<?php echo $file['url']; ?>">Download</a> or Go to the <a href="<?php echo $topic_url; ?>">discussion</a>
                    <?php if( $parent->comment_count ) { ?>
                        <span class="comment-number">
                            <?php printf( _n( '%d comment', '%d comments', get_comments_number( $parent->ID ), 'cpm'), get_comments_number( $parent->ID ) ); ?>
                        </span>
                    <?php } ?>
                </div>
            </div>
        </li>

        <?php
    }
    echo '</ul>';

} else {
    cpm_show_message( __( 'No Files Found!', 'cpm' ) );
}