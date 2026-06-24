<?php
namespace WeDevs\PM\Google_Workspace\Controllers;

use WP_REST_Request;
use WeDevs\PM\Google_Workspace\Google_Service;
use WeDevs\PM\Google_Workspace\Models\Google_Drive_File;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Task\Models\Task;
use Carbon\Carbon;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Hands the user their own access token + Picker keys, and stores file
 * references (drive.file scope) attached to tasks. No file content is copied.
 */
class Drive_Controller {

    /** GET google-workspace/drive/picker-config */
    public function picker_config( WP_REST_Request $request ) {
        if ( ! Google_Service::picker_ready() ) {
            return new \WP_Error( 'pm_google_not_ready', __( 'Google Picker is not fully configured. An administrator must add the API key and App ID.', 'wedevs-project-manager' ), [ 'status' => 400 ] );
        }

        $access_token = Google_Service::get_access_token( get_current_user_id() );
        if ( empty( $access_token ) ) {
            return new \WP_Error( 'pm_google_not_connected', __( 'Connect your Google account first.', 'wedevs-project-manager' ), [ 'status' => 401 ] );
        }

        return [
            'data' => [
                'access_token' => $access_token,
                'api_key'      => Google_Service::get_api_key(),
                'app_id'       => Google_Service::get_app_id(),
            ],
        ];
    }

    /** GET projects/{project_id}/tasks/{task_id}/google-drive */
    /**
     * Resolve the polymorphic target from the request. Prefers
     * attachable_type/attachable_id; falls back to task_id (legacy task route).
     *
     * @return array{0:string,1:int}
     */
    private function resolve_attachable( WP_REST_Request $request ) {
        $type = sanitize_text_field( (string) $request->get_param( 'attachable_type' ) );
        $id   = (int) $request->get_param( 'attachable_id' );

        if ( $type === '' ) {
            $task_id = (int) $request->get_param( 'task_id' );
            if ( $task_id ) {
                return [ 'task', $task_id ];
            }
        }

        // Whitelist supported entity types.
        $allowed = [ 'task', 'comment', 'discussion', 'project', 'file' ];
        if ( ! in_array( $type, $allowed, true ) ) {
            $type = '';
        }

        return [ $type, $id ];
    }

    /**
     * For comment attachments, restrict add/remove to the comment author or a
     * project manager (mirrors who can edit the comment). Other entity types
     * are gated by project-level Drive access only.
     */
    private function can_manage_attachable( $type, $id, $project_id ) {
        if ( $type !== 'comment' ) {
            return true;
        }

        global $wpdb;
        $created_by = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT created_by FROM {$wpdb->prefix}pm_comments WHERE id = %d", (int) $id
        ) );

        $uid = get_current_user_id();
        if ( $created_by && $created_by === $uid ) {
            return true;
        }
        return wedevs_pm_has_manage_capability( $uid ) || wedevs_pm_is_manager( $project_id, $uid );
    }

    public function index( WP_REST_Request $request ) {
        list( $type, $id ) = $this->resolve_attachable( $request );

        if ( $type === '' ) {
            return [ 'data' => [] ];
        }

        $files = Google_Drive_File::where( 'attachable_type', $type )
            ->where( 'attachable_id', $id )
            ->orderBy( 'created_at', 'desc' )
            ->get();

        return [ 'data' => $this->transform_collection( $files ) ];
    }

    /** GET projects/{project_id}/google-workspace/access — manager: read role access */
    public function get_access( WP_REST_Request $request ) {
        $project_id = (int) $request->get_param( 'project_id' );
        return [ 'data' => Google_Service::project_drive_access( $project_id ) ];
    }

    /** POST projects/{project_id}/google-workspace/access — manager: save role access */
    public function save_access( WP_REST_Request $request ) {
        $project_id = (int) $request->get_param( 'project_id' );
        Google_Service::save_project_drive_access(
            $project_id,
            filter_var( $request->get_param( 'co_worker' ), FILTER_VALIDATE_BOOLEAN ),
            filter_var( $request->get_param( 'client' ), FILTER_VALIDATE_BOOLEAN )
        );
        return [ 'data' => Google_Service::project_drive_access( $project_id ) ];
    }

    /** GET projects/{project_id}/google-workspace/can-use — current user gate */
    public function can_use( WP_REST_Request $request ) {
        $project_id = (int) $request->get_param( 'project_id' );
        return [ 'data' => [ 'can_use' => Google_Service::user_can_use_drive( $project_id ) ] ];
    }

    public function attach( WP_REST_Request $request ) {
        $project_id        = (int) $request->get_param( 'project_id' );
        $file              = $request->get_param( 'file' );
        list( $type, $id ) = $this->resolve_attachable( $request );

        if ( ! Google_Service::user_can_use_drive( $project_id ) ) {
            return new \WP_Error( 'pm_google_forbidden', __( 'You are not allowed to attach Google Drive files in this project.', 'wedevs-project-manager' ), [ 'status' => 403 ] );
        }

        if ( $type === '' || ! $id ) {
            return new \WP_Error( 'pm_google_bad_request', __( 'Invalid attachment target.', 'wedevs-project-manager' ), [ 'status' => 422 ] );
        }

        if ( $type === 'comment' && ! Google_Service::drive_comments_enabled() ) {
            return new \WP_Error( 'pm_google_forbidden', __( 'Google Drive in comments is turned off.', 'wedevs-project-manager' ), [ 'status' => 403 ] );
        }

        if ( ! $this->can_manage_attachable( $type, $id, $project_id ) ) {
            return new \WP_Error( 'pm_google_forbidden', __( 'You can only attach Drive files to your own comment.', 'wedevs-project-manager' ), [ 'status' => 403 ] );
        }

        if ( empty( $file ) || empty( $file['id'] ) ) {
            return new \WP_Error( 'pm_google_bad_request', __( 'No file provided.', 'wedevs-project-manager' ), [ 'status' => 422 ] );
        }

        $existing = Google_Drive_File::where( 'attachable_type', $type )
            ->where( 'attachable_id', $id )
            ->where( 'file_id', $file['id'] )
            ->first();
        if ( $existing ) {
            return [ 'data' => $this->transform( $existing ) ];
        }

        $row = Google_Drive_File::create( [
            'project_id'      => $project_id,
            'task_id'         => $type === 'task' ? $id : null,
            'attachable_type' => $type,
            'attachable_id'   => $id,
            'user_id'         => get_current_user_id(),
            'file_id'         => sanitize_text_field( $file['id'] ),
            'name'            => isset( $file['name'] ) ? sanitize_text_field( $file['name'] ) : '',
            'mime_type'       => isset( $file['mimeType'] ) ? sanitize_text_field( $file['mimeType'] ) : '',
            'icon_link'       => isset( $file['iconLink'] ) ? esc_url_raw( $file['iconLink'] ) : '',
            'thumbnail_link'  => isset( $file['thumbnailLink'] ) ? esc_url_raw( $file['thumbnailLink'] ) : '',
            'web_view_link'   => isset( $file['webViewLink'] ) ? esc_url_raw( $file['webViewLink'] ) : '',
            'modified_time'   => isset( $file['modifiedTime'] ) ? sanitize_text_field( $file['modifiedTime'] ) : '',
            'created_at'      => Carbon::now(),
            'updated_at'      => Carbon::now(),
        ] );

        do_action( 'pm_google_drive_file_attached', $row, $type, $id, $project_id );

        if ( $type === 'task' ) {
            $task = Task::find( $id );
            Activity::create( [
                'actor_id'      => get_current_user_id(),
                'action'        => 'attach_drive_file',
                'action_type'   => 'create',
                'resource_id'   => $id,
                'resource_type' => 'task',
                'meta'          => [
                    'task_title' => $task ? $task->title : '',
                    'file_name'  => $row->name,
                    'file_url'   => $row->web_view_link,
                    'has_drive'  => true,
                ],
                'project_id'    => $project_id,
            ] );
        }

        return [ 'data' => $this->transform( $row ) ];
    }

    /** DELETE projects/{project_id}/google-drive/{id} */
    public function destroy( WP_REST_Request $request ) {
        $project_id = (int) $request->get_param( 'project_id' );
        $id         = (int) $request->get_param( 'id' );

        if ( ! Google_Service::user_can_use_drive( $project_id ) ) {
            return new \WP_Error( 'pm_google_forbidden', __( 'You are not allowed to remove Google Drive files in this project.', 'wedevs-project-manager' ), [ 'status' => 403 ] );
        }

        $row = Google_Drive_File::where( 'id', $id )->where( 'project_id', $project_id )->first();
        if ( $row ) {
            if ( ! $this->can_manage_attachable( $row->attachable_type, $row->attachable_id, $project_id ) ) {
                return new \WP_Error( 'pm_google_forbidden', __( 'You can only remove Drive files from your own comment.', 'wedevs-project-manager' ), [ 'status' => 403 ] );
            }
            do_action( 'pm_google_drive_file_detached', $row );

            if ( $row->attachable_type === 'task' ) {
                $task = Task::find( $row->attachable_id );
                Activity::create( [
                    'actor_id'      => get_current_user_id(),
                    'action'        => 'detach_drive_file',
                    'action_type'   => 'delete',
                    'resource_id'   => (int) $row->attachable_id,
                    'resource_type' => 'task',
                    'meta'          => [
                        'task_title' => $task ? $task->title : '',
                        'file_name'  => $row->name,
                    ],
                    'project_id'    => $project_id,
                ] );
            }

            $row->delete();
        }

        return [ 'data' => [ 'id' => $id, 'deleted' => true ] ];
    }

    private function transform_collection( $rows ) {
        $out = [];
        foreach ( $rows as $row ) {
            $out[] = $this->transform( $row );
        }
        return $out;
    }

    private function transform( $row ) {
        $user = $row->user_id ? get_userdata( $row->user_id ) : null;

        return [
            'id'             => (int) $row->id,
            'file_id'        => $row->file_id,
            'name'           => $row->name,
            'mime_type'      => $row->mime_type,
            'icon_link'      => $row->icon_link,
            'thumbnail_link' => $row->thumbnail_link,
            'web_view_link'  => $row->web_view_link,
            'modified_time'  => $row->modified_time,
            'user_id'        => (int) $row->user_id,
            'added_by_name'  => $user ? $user->display_name : '',
            'added_by_avatar'=> $row->user_id ? get_avatar_url( $row->user_id, [ 'size' => 32 ] ) : '',
        ];
    }
}
