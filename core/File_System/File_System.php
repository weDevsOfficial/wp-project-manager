<?php

namespace CPM\Core\File_System;

require_once( ABSPATH . 'wp-admin/includes/file.php' );

Class File_System {

    public static function upload( $file ) {
        if ( ! function_exists( 'wp_handle_upload' ) ) {
            require_once( ABSPATH . 'wp-admin/includes/file.php' );
        }

        $uploaded_file = wp_handle_upload( $file, array( 'test_form' => false ) );
        $attachment_id = self::attachment_id( $uploaded_file );

        return $attachment_id;
    }

    public static function multiple_upload( $file ) {
        if ( ! function_exists( 'wp_handle_upload' ) ) {
            require_once( ABSPATH . 'wp-admin/includes/file.php' );
        }

        $number_of_files = count( $file['name'] );
        $attachment_ids = [];

        for( $i = 0; $i < $number_of_files; $i++ ) {
            $file_to_upload = [
                'name'     => $file['name'][$i],
                'type'     => $file['type'][$i],
                'tmp_name' => $file['tmp_name'][$i],
                'error'    => $file['error'][$i],
                'size'     => $file['size'][$i],
            ];

            $uploaded_file = wp_handle_upload( $file_to_upload, array( 'test_form' => false ) );
            $attachment_ids[] = self::attachment_id( $uploaded_file );
        }

        return array_filter( $attachment_ids );
    }

    private function attachment_id( $uploaded_file ) {
        if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
            require_once( ABSPATH . 'wp-admin/includes/image.php' );
        }

        $file_location = $uploaded_file['file'];
        $file_name = basename( $uploaded_file['file'] );
        $file_type = wp_check_filetype( $file_name );

        $attachment_data = array(
            'post_mime_type' => $file_type['type'],
            'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $file_name ) ),
            'post_content'   => '',
            'post_status'    => 'inherit'
        );

        $attachment_id = wp_insert_attachment( $attachment_data, $file_location );
        $attachment_metadata = wp_generate_attachment_metadata( $attachment_id, $file_location );

        wp_update_attachment_metadata( $attachment_id, $attachment_metadata );

        return $attachment_id;
    }

    public static function get_file( $attachment_id ) {
        $file = get_post( $attachment_id );

        if ( $file ) {
            $response = array(
                'id'   => $attachment_id,
                'name' => get_the_title( $attachment_id ),
                'url'  => wp_get_attachment_url( $attachment_id ),
            );

            if ( wp_attachment_is_image( $attachment_id ) ) {
                $thumb             = wp_get_attachment_image_src( $attachment_id, 'thumbnail' );
                $response['thumb'] = $thumb[0];
                $response['type']  = 'image';
            } else {
                $response['thumb'] = wp_mime_type_icon( $file->post_mime_type );
                $response['type']  = 'file';
            }

            return $response;
        }

        return false;
    }

    public static function delete( $file_id, $force = true ) {
        wp_delete_attachment( $file_id, $force );
    }

    public static function update( $attach_id, $attach_data ) {
        $args = array(
            'ID'         => $attach_id,
            'post_title' => $attach_data['name'],
        );

        wp_update_post( $args );
    }

}
