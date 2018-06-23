<?php

namespace WeDevs\PM\Core\Router;

use WP_REST_Request;
use WP_REST_Server;
use WP_Error;
use WeDevs\PM\Core\Validator\Validator;
use WeDevs\PM\Core\Sanitizer\Sanitizer;

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
			$uri         = '/' . $route['uri'];
			$http_verb   = $route['http_verb'];
			$controller  = new $route['controller'];
			$method      = $route['method'];
			$permissions = $route['permission'];
			$validator   = $route['validator'];
			$sanitizer   = $route['sanitizer'];
			$namespace   = config( 'app.slug' ) . '/v' . config( 'app.api' );

			register_rest_route( $namespace, $uri, array(
				'methods'  => $http_verb,
				'callback' => array( $controller, $method ),
				'permission_callback' => function ( WP_REST_Request $request ) use ( $permissions ) {
					return $this->check_permission( $request, $permissions );
				},
				'args' => $this->prepare_args( $http_verb, $namespace, $uri, $validator, $sanitizer )
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
		$permitted = array();
		$merge_error = false;

		if ( empty( $permissions ) ) {
			$permitted = true;
		}

		foreach ( $permissions as $permission ) {
			$permission_obj = new $permission( $request );
			$has_permission = $permission_obj->check();

			if ( is_wp_error( $has_permission ) ) {
				$merge_error = true;
			}

			$permitted[] = $has_permission;
		}

		if ( $merge_error ) {
			$permitted = $this->merge_permission_error( $permitted );
		} else if ( is_array($permitted) && in_array( false, $permitted ) ) {
			$permitted = false;
		}
		
		return $permitted;
	}

	function merge_permission_error($wp_errors) {
	  	$wp_error_merged = new WP_Error();

	  	if ( !is_array( $wp_errors ) ) {
	  		return $wp_errors;
	  	}
		
		foreach ( $wp_errors as $wp_error ) {
			if ( ! is_wp_error( $wp_error ) )
				continue;
			foreach ( $wp_error as $key => $errors ) {
				foreach ( $errors as $error ) {
					$wp_error_merged->add( $key, $error );
				}
				if ( isset( $wp_error->error_data[ $key ] ) ) {
					$wp_error_merged->add_data( $wp_error->error_data[ $key ], $key );
				}
			}
		}	
		return $wp_error_merged;
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
	private function prepare_args( $http_verb, $namespace, $uri, $validator = null, $sanitizer = null ) {

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

	protected function prepare_request_object( $http_verb, $namespace, $uri) {
		$request_uri = $_SERVER['REQUEST_URI'];
		$url_prefix = '/' . rest_get_url_prefix();
		$request_uri = substr( $request_uri, strlen( $url_prefix ) );

		$route   = '/' . $namespace . $uri;
		$request = new WP_REST_Request( $http_verb, $request_uri );
		$request = $this->append_header( $request );
		$request = $this->append_uri_params( $request, $route );
		$request = $this->append_params( $request );

		return $request;
	}

	protected function append_header( WP_REST_Request $request ) {
		$headers = $this->get_headers();

		foreach( $headers as $key => $value ) {
			$request->add_header( $key, $value );
		}

		return $request;
	}


    /**
     * Get all HTTP header key/values as an associative array for the current request.
     *
     * @return array The HTTP header key/value pairs.
     */
    private function get_headers() {
        $headers = array();

        $copy_server = array(
            'CONTENT_TYPE'   => 'Content-Type',
            'CONTENT_LENGTH' => 'Content-Length',
            'CONTENT_MD5'    => 'Content-Md5',
        );

        foreach ( $_SERVER as $key => $value ) {
            if ( substr( $key, 0, 5 ) === 'HTTP_' ) {
                $key = substr( $key, 5 );

                if ( !isset( $copy_server[$key] ) || !isset( $_SERVER[$key] ) ) {
                    $key = str_replace( ' ', '-', ucwords( strtolower( str_replace( '_', ' ', $key ) ) ) );
                    $headers[$key] = $value;
                }
            } elseif ( isset( $copy_server[$key] ) ) {
                $headers[$copy_server[$key]] = $value;
            }
        }

        if ( !isset( $headers['Authorization'] ) ) {
            if ( isset( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ) ) {
                $headers['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
            } elseif ( isset( $_SERVER['PHP_AUTH_USER'] ) ) {
                $basic_pass = isset( $_SERVER['PHP_AUTH_PW'] ) ? $_SERVER['PHP_AUTH_PW'] : '';
                $headers['Authorization'] = 'Basic ' . base64_encode( $_SERVER['PHP_AUTH_USER'] . ':' . $basic_pass );
            } elseif ( isset( $_SERVER['PHP_AUTH_DIGEST'] ) ) {
                $headers['Authorization'] = $_SERVER['PHP_AUTH_DIGEST'];
            }
        }

        return $headers;
    }

    protected function append_uri_params( WP_REST_Request $request, $route ) {
    	$request_uri = $request->get_route();
    	$uri_parts = explode( '/', $request_uri );
    	$route_parts = explode( '/', $route );
    	$params = [];

    	if ( count( $uri_parts ) === count( $route_parts ) ) {
    		foreach ($uri_parts as $key => $value) {
    			if ( $value === $route_parts[$key] ) {
    				continue;
    			} elseif ( preg_match( "/^(\(\?P<).+(>\.\+\))$/", $route_parts[$key] ) ) {
    				$param = str_replace( "(?P<", '', $route_parts[$key] );
    				$param = str_replace( ">.+)", '', $param );
    				$params[$param] = $value;
    			}
    		}
    	}

    	$request->set_url_params( $params );

    	return $request;
    }

	protected function append_params( WP_REST_Request $request ) {
		$request->set_query_params( $_GET );
		$request->set_body_params( $_POST );
		$request->set_file_params( $_FILES );

		return $request;
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
				return $sanitizer->sanitize( $request, $key );
			};
		}

		return $args;
	}
}