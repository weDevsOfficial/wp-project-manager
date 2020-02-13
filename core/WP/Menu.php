<?php

namespace WeDevs\PM\Core\WP;

use WeDevs\PM\Core\WP\Output as Output;
use WeDevs\PM\Core\WP\Enqueue_Scripts as Enqueue_Scripts;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\User\Models\User_Role;

class Menu {

	private static $capability = 'read';

	public static function admin_menu() {
		global $submenu, $wedevs_pm_pro, $wedevs_license_progress;

		$ismanager = pm_has_manage_capability();
		$slug = pm_admin_slug();

		$home = add_menu_page( __( 'Project Manager', 'wedevs-project-manager' ), __( 'Project Manager', 'wedevs-project-manager' ), self::$capability, $slug, array( new Output, 'home_page' ), self::pm_svg(), 3 );

		$submenu[$slug][] = [ __( 'Projects', 'wedevs-project-manager' ), self::$capability, "admin.php?page={$slug}#/" ];

		$active_task = self::my_task_count();
		$mytask_text = sprintf( __( 'My Tasks %s', 'cpm-pro' ), '<span class="awaiting-mod count-1"><span class="pending-count">' . $active_task . '</span></span>' );
		$submenu[$slug][] = [ $mytask_text , self::$capability, "admin.php?page={$slug}#/my-tasks" ];

		if ( $ismanager ) {
			$submenu[$slug][] = [ __( 'Categories', 'wedevs-project-manager' ), self::$capability, "admin.php?page={$slug}#/categories" ];
		}

		if ( ! $wedevs_pm_pro ) {
			$submenu[$slug][] = [ __( 'Premium', 'wedevs-project-manager' ), self::$capability, "admin.php?page={$slug}#/premium" ];
		}

        
		do_action( 'pm_menu_before_load_scripts', $home );

		add_action( 'admin_print_styles-' . $home, array( 'WeDevs\\PM\\Core\\WP\\Menu', 'scripts' ) );

		do_action( 'cpm_admin_menu', self::$capability, $home );

		if ( $ismanager ) {
			$submenu[$slug][] = [ __( 'Settings', 'wedevs-project-manager' ), 'administrator', "admin.php?page={$slug}#/settings" ];
		}

		if ( $ismanager ) {
        	$submenu[$slug]['importtools'] = [ __( 'Tools', 'wedevs-project-manager' ), self::$capability, "admin.php?page={$slug}#/importtools" ];
    	}


		do_action( 'pm_menu_after_load_scripts', $home );
	}

	public static function pm_svg() {
		return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5JY29uIHdoaXRlPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IjQtUHJvamVjdC1MaXN0LVBhZ2UtRGVzaWduLVByb2plY3QtRmlsdGVyaW5nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTYuMDAwMDAwLCAtMTI3LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSJJY29uLXdoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Ni4wMDAwMDAsIDEyNy4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJJY29uIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNS4wNywxNC4wNDk3Mjk3IEM1LjM2MTc1Mjg2LDE0LjI5Nzg1NTggNS41NDE4MjA0NCwxNC42NTc4ODA1IDUuNTY4MjcxNjMsMTUuMDQ1OTY3NSBDNS41OTQ3MjI4MiwxNS40MzQwNTQ1IDUuNDY1MjQ5MDUsMTUuODE2MzMyOCA1LjIxLDE2LjEwMzc4MzggQzQuNzA4MTE2MywxNi42NzA2NyAzLjg1OTIxNDY1LDE2LjcyNzQzMDcgMy4yOSwxNi4yMzIxNjIyIEMwLjg0MDQ0MjU4NSwxNC4wOTIxODQyIC0wLjMxNzc0MDA0MywxMC43NzY4MDk0IDAuMjQ4NDc0OTc4LDcuNTI1NTk0MzkgQzAuODE0NjksNC4yNzQzNzkzOSAzLjAyMDA0NTQxLDEuNTc2ODcyNjcgNi4wNCwwLjQ0MTYyMTYyMiBMNy43MzUsMi44ODA4MTA4MSBMOC42MTUsNC4yMDU2NzU2OCBMNi44MTUsNi42NSBMNS4xNDUsNC4xOTAyNzAyNyBDMy43MTI5MzE1MSw1LjQwMTM1MjU1IDIuODc3MDk0NzEsNy4yMDE5NzE3NyAyLjg2MjYxNzM0LDkuMTA3MTQxNzMgQzIuODQ4MTM5OTcsMTEuMDEyMzExNyAzLjY1NjUxMDgzLDEyLjgyNjEwOTcgNS4wNywxNC4wNiBMNS4wNywxNC4wNDk3Mjk3IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNC43NiwxNi40NjMyNDMyIEMxNC4zODMwODQ4LDE2Ljc5MDcyMDcgMTMuODY0NjkxMiwxNi44ODY4MDU4IDEzLjQwMDA5MzEsMTYuNzE1MzA0MiBDMTIuOTM1NDk1LDE2LjU0MzgwMjcgMTIuNTk1Mjc1OSwxNi4xMzA3Njk2IDEyLjUwNzU5MzEsMTUuNjMxNzkwNiBDMTIuNDE5OTEwMiwxNS4xMzI4MTE3IDEyLjU5ODA4NDcsMTQuNjIzNjkzNiAxMi45NzUsMTQuMjk2MjE2MiBDMTQuMzc0Mzc5MSwxMy4wNjY4OTQ1IDE1LjE3NjI4OTIsMTEuMjY3NTM0MSAxNS4xNjc2MjEzLDkuMzc2MzE4MzkgQzE1LjE1ODk1MzQsNy40ODUxMDI2OSAxNC4zNDA1ODU0LDUuNjkzNTc1MjYgMTIuOTMsNC40Nzc4Mzc4NCBMMTAuNjgsNy43MDI3MDI3IEwxMC4zMiw4LjIxNjIxNjIyIEwxMC4zMiwxNy4yMDc4Mzc4IEMxMC4zMjI3OTEyLDE4LjAxMjEzNjEgOS42OTMwOTQyLDE4LjY2ODAyNTIgOC45MSwxOC42NzY0ODY1IEw4Ljg4LDE4LjY3NjQ4NjUgQzguMDk2OTA1OCwxOC42NjgwMjUyIDcuNDY3MjA4ODEsMTguMDEyMTM2MSA3LjQ3LDE3LjIwNzgzNzggTDcuNDcsOS42OSBMNy40Nyw4LjEwODM3ODM4IEw3LjQ3LDcuMzIyNzAyNyBMMTIuMDY1LDAuNzEzNzgzNzg0IEMxNS4wNjkwMjc4LDEuODU4MzcyIDE3LjI1NzUyODksNC41NTIxNDY5MyAxNy44MTU5Mzc1LDcuNzkyNDc4MzQgQzE4LjM3NDM0NiwxMS4wMzI4MDk4IDE3LjIxOTAyOTUsMTQuMzM0Mzk2MiAxNC43OCwxNi40NjgzNzg0IEwxNC43NiwxNi40NjMyNDMyIFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgICAgIDxnIGlkPSJQYWdlIj48L2c+CiAgICA8L2c+Cjwvc3ZnPgoK';
	}

	public static function scripts() {
		Enqueue_Scripts::scripts();
		Enqueue_Scripts::styles();
	}

	public static function my_task_count () {
		$today = date( 'Y-m-d', strtotime( current_time( 'mysql' ) ) );
		$user_id = get_current_user_id();

		$project_ids = User_Role::where( 'user_id', $user_id)->get(['project_id'])->toArray();
        $project_ids = wp_list_pluck( $project_ids, 'project_id' );

        if ( pm_has_manage_capability() ){
            $tasks = User::find( $user_id )
            	->tasks()
                ->whereHas('boards')
                ->parent()
                ->where( pm_tb_prefix() . 'pm_tasks.status', 0)
            	->whereIn( pm_tb_prefix() . 'pm_tasks.project_id', $project_ids)
                ->get();
        }else{
            $tasks = User::find( $user_id )->tasks()
                ->parent()
                ->where( pm_tb_prefix() . 'pm_tasks.status', 0)
                ->whereIn( pm_tb_prefix() . 'pm_tasks.project_id', $project_ids)
                ->doesntHave( 'metas', 'and', function ($query) {
                    $query->where( 'meta_key', '=', 'privacy' )
                        ->where( 'meta_value', '!=', '0' );

                });

            $tasks = $tasks->doesntHave( 'task_lists.metas', 'and', function ($query) {
                $query->where( 'meta_key', '=', 'privacy' )
                        ->where( 'meta_value', '!=', '0' );

                })->get();
        }

        return $tasks->count();
	}
}
