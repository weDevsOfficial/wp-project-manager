<?php

namespace WeDevs\PM\File\Helper;

use WeDevs\PM\Core\File_System\File_System;

class File {

	private static $_instance;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $orderby;
	private $with = ['creator', 'updater'];
	private $files;
	private $file_ids;
	private $found_rows;
	private $tb_file;
	private $is_single_query = false;

	public static function getInstance() {
        return new self();
    }

    function __construct() {
    	$this->set_table_name();
    }

	public static function get_task_files(\WP_REST_Request $request) {
		$files = self::get_results( $request->get_params() );

		wp_send_json( $files );
	}

	public static function get_results( $params = [] ) {
		$self = self::getInstance();
		$self->query_params = $params;

		$self->join()
			->where()
			->limit()
			->orderby()
			->get()
			->with()
			->meta();

		$response = $self->format_files( $self->files );

		if ( wedevs_pm_is_single_query( $params ) ) {
			return ['data' => $response['data'][0]] ;
		}

		return $response;
	}

	public static function check_file_for_xss_code( $files ) {

        if (isset($files['type']) && is_array($files['type'])) {
			// Check if the file is an SVG
            foreach ($files['tmp_name'] as $index => $tmp_name) {
                $extension = pathinfo($files['name'][$index], PATHINFO_EXTENSION);
                if ('svg' === $extension && 'image/svg+xml' === $files['type'][$index]) {
                    $svg_content = file_get_contents($tmp_name);

                    if (self::contains_xss_code($svg_content)) {
                        return true;
                    }
                }
            }

        }

        return false;
    }

    public static function contains_xss_code( $content ) {
		$pattern = '/<script.*?>.*?<\/script>|on[a-z]+\s*=\s*["\'][^"\']*["\']|javascript\s*[:=][^"\']+|data\s*[:=][^"\']+/ix';
        return preg_match($pattern, $content);
    }

	/**
	 * Format TaskMilestone data
	 *
	 * @param array $files
	 *
	 * @return array
	 */
	public function format_files( $files ) {
		$response = [
			'data' => [],
			'meta' => []
		];

		// if ( ! is_array( $files ) ) {
		// 	$response['data'] = $this->fromat_file( $files );

		// 	return $response;
		// }

		foreach ( $files as $key => $file ) {
			$files[$key] = $this->fromat_file( $file );
		}

		$response['data']  = $files;
		$response ['meta'] = $this->set_files_meta();

		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_files_meta() {
		return [
			'pagination' => [
				'total'   => $this->found_rows,
				'per_page'  => ceil( $this->found_rows/$this->get_per_page() )
			]
		];
	}

	public function fromat_file( $file ) {
		
        $items = [
            'id'            => (int) $file->id,
            'fileable_id'   => $file->fileable_id,
            'fileable_type' => $file->fileable_type,
            'directory'     => empty( $file->directory ) ? '' : $file->directory,
            'attachment_id' => $file->attachment_id,
            'attached_at'   => wedevs_pm_format_date( $file->created_at ),
            //'fileable'      => $this->get_fileabel($file),
            //'meta'          => $this->get_file_meta($file)
        ];

        $items = $this->set_attach_file( $items, $file ); 
		$items = $this->item_with( $items, $file );

		return apply_filters( 'wedevs_pm_file_transform', $items, $file );
	}

	private function set_attach_file( $items, $file ) {
		$attach_file = File_System::get_file( $file->attachment_id );
        $attach_file = is_array( $attach_file ) ? $attach_file : [];

        return array_merge( $items, $attach_file );
	}

	private function join() {
		return $this;
	}

	private function with() {
		$this->creator()
			->updater();

		return $this;
	}

	private function where() {
		$this->where_id();

		return $this;
	}

	/**
	 * Filter file by ID
	 *
	 * @return self object
	 */
	private function where_id() {
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false; 

		if ( empty( $id ) ) {
			return $this;
		}

		global $wpdb;
		$format     = wedevs_pm_get_prepare_format( $id );
		$format_ids = wedevs_pm_get_prepare_data( $id );

		$this->where .= $wpdb->prepare( " AND {$this->tb_file}.id IN ($format)", $format_ids );

		if ( count( $format_ids ) == 1 ) {
			$this->is_single_query = true;
		}
		
		return $this;
	}

	private function creator() {
		
		if ( empty( $this->files ) ) {
			return $this;
		}

		$creator_ids = wp_list_pluck( $this->files, 'created_by' );
		$creator_ids = array_unique( $creator_ids );

		$creators = wedevs_pm_get_users( [ 'id' => $creator_ids ] );
		$creators = $creators['data'];
		
		$items = []; 
		
		foreach ( $creators as $key => $creator ) {
			$items[$creator['id']] = $creator;
		}

		foreach ( $this->files as $key => $file ) {
			$c_creator = empty( $items[$file->created_by] ) ? [] : $items[$file->created_by];

			$file->creator = [ 'data' => $c_creator ];
		}

		return $this;
	}

	private function updater() {
		if ( empty( $this->files ) ) {
			return $this;
		}

		$updater_ids = wp_list_pluck( $this->files, 'updated_by' );
		$updater_ids = array_unique( $updater_ids );

		$updaters = wedevs_pm_get_users( [ 'id' => $updater_ids ] );
		$updaters = $updaters['data'];
		
		$items = []; 
		
		foreach ( $updaters as $key => $updater ) {
			$items[$updater['id']] = $updater;
		}

		foreach ( $this->files as $key => $file ) {
			$c_updater = empty( $items[$file->updated_by] ) ? [] : $items[$file->updated_by];

			$file->updater = [ 'data' => $c_updater ];
		}

		return $this;
	}

	private function meta() {
		return $this;
	}

	private function item_with( $items, $file ) {
        $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

        if ( ! is_array( $with ) ) {
            $with = explode( ',', str_replace(' ', '', $with ) );
        }

        $with = array_merge( $this->with, $with );
        
        $file_with_items =  array_intersect_key( (array) $file, array_flip( $with ) );

        $items = array_merge( $items, $file_with_items );

        return $items;
    }

    private function limit() {
		global $wpdb;
		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;

		if ( $per_page === false || $per_page == '-1' ) {
			return $this;
		}

		// $this->limit = " LIMIT {$this->get_offset()},{$this->get_per_page()}";
		$this->limit = $wpdb->prepare( " LIMIT %d,%d", $this->get_offset(), $this->get_per_page() );

		return $this;
	}

	private function orderby() {
        global $wpdb;

		$tb_pj    = $wpdb->prefix . 'pm_boards';
		$odr_prms = isset( $this->query_params['orderby'] ) ? $this->query_params['orderby'] : false;

        if ( $odr_prms === false && !is_array( $odr_prms ) ) {
            return $this;
        }

		// Whitelist of allowed columns for ordering
		$allowed_columns = array(
			'id',
			'fileable_id',
			'fileable_type',
			'type',
			'parent',
			'created_by',
			'created_at',
			'updated_at'
		);

		$orders = [];

        $odr_prms = str_replace( ' ', '', $odr_prms );
        $odr_prms = explode( ',', $odr_prms );

        foreach ( $odr_prms as $key => $orderStr ) {
			$orderStr         = str_replace( ' ', '', $orderStr );
			$orderStr         = explode( ':', $orderStr );
			$orderby          = $orderStr[0];
			$order            = empty($orderStr[1]) ? 'asc' : strtolower($orderStr[1]);

			// Validate column name against whitelist
			if (! in_array($orderby, $allowed_columns, true)) {
				continue;
			}

			// Validate order direction
			if (! in_array($order, array('asc', 'desc'), true)) {
				$order = 'asc';
			}

			$orders[$orderby] = $order;
        }

        $order = [];

        foreach ( $orders as $key => $value ) {
			$order[] =  $tb_pj . '.' . esc_sql($key) . ' ' . esc_sql($value);
        }

        $this->orderby = "ORDER BY " . implode( ', ', $order);

        return $this;
    }

	private function get_offset() {
		$page = isset( $this->query_params['page'] ) ? $this->query_params['page'] : false;

		$page   = empty( $page ) ? 1 : absint( $page );
		$limit  = $this->get_per_page();
		$offset = ( $page - 1 ) * $limit;

		return $offset;
	}

	private function get_per_page() {

		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;

		if ( ! empty( $per_page ) && intval( $per_page ) ) {
			return intval( $per_page );
		}

		return 20;
	}

    private function get() {
		global $wpdb;
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false;

		// Ensure these are strings to avoid null/undefined issues
		$join = is_string($this->join) ? $this->join : '';
		$where = is_string($this->where) ? $this->where : '';
		$orderby = is_string($this->orderby) ? $this->orderby : '';
		$limit = is_string($this->limit) ? $this->limit : '';

		// phpcs:ignore PluginCheck.Security.DirectDB.UnescapedDBParameter -- $join is built safely via join() method using wpdb::prepare() and apply_filters()
		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT SQL_CALC_FOUND_ROWS DISTINCT %i.*
				FROM %i
				{$join}
				WHERE %d=%d {$where} 
				{$orderby} {$limit}",
				$this->tb_file,
				$this->tb_file,
				1,
				1
			)
		);

		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );
		$this->files = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->file_ids = wp_list_pluck( $results, 'id' );
		}

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->file_ids = [$results->id];
		}

		return $this;
	}

    private function set_table_name() {
		$this->tb_file = esc_sql( wedevs_pm_tb_prefix() . 'pm_files' );
	}

}

