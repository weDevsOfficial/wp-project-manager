<?php
use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router = Router::singleton();

$gw_base   = 'WeDevs/PM/Google_Workspace/Controllers/';
$gw_admin  = 'WeDevs\PM\Core\Permissions\Settings_Page_Access';
$gw_auth   = 'WeDevs\PM\Core\Permissions\Authentic';
$gw_access = 'WeDevs\PM\Core\Permissions\Access_Project';

// ── Admin: site-level OAuth credentials + Picker keys ────────────────
$wedevs_pm_router->get( 'google-workspace/settings', $gw_base . 'Settings_Controller@get' )
    ->permission( [ $gw_admin ] );

$wedevs_pm_router->post( 'google-workspace/settings', $gw_base . 'Settings_Controller@save' )
    ->permission( [ $gw_admin ] );

// ── Per-user connection ──────────────────────────────────────────────
$wedevs_pm_router->get( 'google-workspace/status', $gw_base . 'OAuth_Controller@status' )
    ->permission( [ $gw_auth ] );

$wedevs_pm_router->get( 'google-workspace/auth-url', $gw_base . 'OAuth_Controller@auth_url' )
    ->permission( [ $gw_auth ] );

$wedevs_pm_router->post( 'google-workspace/disconnect', $gw_base . 'OAuth_Controller@disconnect' )
    ->permission( [ $gw_auth ] );

// ── Drive Picker config (vends caller's own access token + Picker keys) ──
$wedevs_pm_router->get( 'google-workspace/drive/picker-config', $gw_base . 'Drive_Controller@picker_config' )
    ->permission( [ $gw_auth ] );

// ── Per-project Drive role access (manager configures; members query) ──
$gw_manager = 'WeDevs\PM\Core\Permissions\Project_Manage_Capability';

$wedevs_pm_router->get( 'projects/{project_id}/google-workspace/access', $gw_base . 'Drive_Controller@get_access' )
    ->permission( [ $gw_manager ] );

$wedevs_pm_router->post( 'projects/{project_id}/google-workspace/access', $gw_base . 'Drive_Controller@save_access' )
    ->permission( [ $gw_manager ] );

$wedevs_pm_router->get( 'projects/{project_id}/google-workspace/can-use', $gw_base . 'Drive_Controller@can_use' )
    ->permission( [ $gw_access ] );

// ── Task attachments ─────────────────────────────────────────────────
$wedevs_pm_router->get( 'projects/{project_id}/tasks/{task_id}/google-drive', $gw_base . 'Drive_Controller@index' )
    ->permission( [ $gw_access ] );

$wedevs_pm_router->post( 'projects/{project_id}/tasks/{task_id}/google-drive', $gw_base . 'Drive_Controller@attach' )
    ->permission( [ $gw_access ] );

$wedevs_pm_router->delete( 'projects/{project_id}/tasks/{task_id}/google-drive/{id}', $gw_base . 'Drive_Controller@destroy' )
    ->permission( [ $gw_access ] );
