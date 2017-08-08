<?php

namespace CPM\Core\Router;

use WP_REST_Request;
use WP_REST_Server;
use WP_Error;
use CPM\Core\Validator\Validator;
use CPM\Core\Sanitizer\Sanitizer;

class WP_Router {
	/**
	 * Array of routes that are got from route files.
	 *
	 * @var array
	 */
	public static $routes = [];

	/**
	 * Register routes that are got from route files as wp rest route.
	 *
	 * @param  array  $routes
	 *
	 * @return void
	 */
	public static function register( $routes = [] ) {
		static::$routes = $routes;

		add_action( 'rest_api_init', array( new WP_Router, 'make_wp_rest_route' ) );
	}

	/**
	 * Convert routes that are stored in static property 'routes' to wp rest route.
	 *
	 * @return void
	 */
	public function make_wp_rest_route() {
		$routes = static::$routes;

		foreach ( $routes as $route ) {
			$uri = '/' . $route['uri'];
			$http_verb = $route['http_verb'];
			$controller = new $route['controller'];
			$method = $route['method'];
			$permissions = $route['permission'];
			$validator = $route['validator'];
			$sanitizer = $route['sanitizer'];
			$namespace = config( 'app.slug' ) . '/v' . config( 'app.version' );

			register_rest_route( $namespace, $uri, array(
				'methods' => $http_verb,
				'callback' => array( $controller, $method ),
				'permission_callback' => function ( WP_REST_Request $request ) use ( $permissions ) {
					return $this->check_permission( $request, $permissions );
				},
				'args' => $this->prepare_args( $validator, $sanitizer )
			) );
		}
	}

	/**
	 * Check for permissions for a specific route.
	 *
	 * @param  WP_REST_Request $request (Current http request object.)
	 *
	 * @param  array $permissions (Array of class namespaces of permission classes.)
	 *
	 * @return boolean (Return true if permitted; ortherwise false.)
	 */
	private function check_permission( WP_REST_Request $request, $permissions ) {
		$permitted = false;

		if ( empty( $permissions ) ) {
			$permitted = true;
		}

		foreach ( $permissions as $permission ) {
			$permission_obj = new $permission( $request );

			$permitted = ( $permitted || $permission_obj->check() );
		}

		return $permitted;
	}

	/**
	 * Making of parameters for wp rest routes.
	 *
	 * @param  string $validator (Class namespace of a validator class.)
	 *
	 * @param  string $sanitizer (Class namespace of a sanitizer class.)
	 *
	 * @return array (Array of arguments/parameters that will be passed to a
	 * wp rest route.)
	 */
	private function prepare_args( $validator = null, $sanitizer = null ) {
		$validator = $validator ? new $validator() : null;
		$sanitizer = $sanitizer ? new $sanitizer() : null;
		$args = [];

		if ( $validator ) {
			$args = $this->apply_validation( $args, $validator );
		}

		if ( $sanitizer ) {
			$args = $this->apply_sanitizer( $args, $sanitizer );
		}

		return $args;
	}

	/**
	 * Apply validation to the data that are passed to a wp rest route.
	 *
	 * @param  array $args (Arguments/Parameters that will be passed to a wp
	 * rest route.)
	 *
	 * @param  Validator $validator
	 *
	 * @return array (Array of arguments/parameters that will be passed to a
	 * wp rest route.)
	 */
	protected function apply_validation( $args, Validator $validator ) {
		$rules = $validator->rules();
		$keys = array_keys( $rules );

		foreach ( $keys as $key ) {
			$args[$key] = [
				'required' => in_array( 'required', explode( '|', $rules[$key] ) ),
				'validate_callback' => function ( $param, $request, $key ) use ( $validator ) {
					$validator->request = $request;

					if ( $validator->validate( $request, $key ) ) {
						return true;
					}

					return new WP_Error(
						'rest_invalid_param',
						$validator->get_errors( $key ),
						array(
							'status' => 400
						)
					);
				},
			];
		}

		return $args;
	}

	/**
	 * Apply sanitization to the data that are passed to a wp rest route.
	 *
	 * @param  array $args (Arguments/Parameters that will be passed to a wp
	 * rest route.)
	 *
	 * @param  Sanitizer $sanitizer
	 *
	 * @return array (Array of arguments/parameters that will be passed to a
	 * wp rest route.)
	 */
	protected function apply_sanitizer( $args, Sanitizer $sanitizer ) {
		$filters = $sanitizer->filters();
		$keys = array_keys( $filters );

		foreach ( $keys as $key ) {
			$args[$key]['sanitize_callback'] = function ( $param, $request, $key ) use ( $sanitizer ) {
				$sanitizer->request = $request;

				return $sanitizer->sanitize( $request, $key );
			};
		}

		return $args;
	}
}