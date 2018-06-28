<?php

namespace WeDevs\PM\Core\Router;

use WeDevs\PM\Core\Router\Uri_Parser;
use WeDevs\PM\Core\Singletonable;
use WeDevs\PM\Core\Permissions\Permission;

class Router {
	/**
	 * Code associated with making a class singleton.
	 */
	use Singletonable;

	/**
	 * All the api routes will be stored in this static variable.
	 *
	 * @var array
	 */
	public static $routes = [];

	/**
	 * A route with GET http verb will be parsed into a pre-defined
	 * format using parse method and it is a chain method.
	 *
	 * @param  string $uri
	 *
	 * @param  stirng $handler (This string contains a class namespace
	 * and a method name. These two things are sperated by @. Left
	 * part of @ is the class namespace and right part is the mehtod
	 * name.)
	 *
	 * @return object (An object of the router class.)
	 */
	public function get( $uri, $handler ) {
		$this->parse( $uri, $handler, 'GET');

		return $this;
	}

	/**
	 * A route with POST http verb will be parsed into a pre-defined
	 * format using parse method and it is a chain method.
	 *
	 * @param  string $uri
	 *
	 * @param  stirng $handler (This string contains a class namespace
	 * and a method name. These two things are sperated by @. Left
	 * part of @ is the class namespace and right part is the mehtod
	 * name.)
	 *
	 * @return object (An object of the router class.)
	 */
	public function post( $uri, $handler ) {
		$this->parse( $uri, $handler, 'POST' );

		return $this;
	}

	/**
	 * A route with PUT http verb will be parsed into a pre-defined
	 * format using parse method and it is a chain method.
	 *
	 * @param  string $uri
	 *
	 * @param  stirng $handler (This string contains a class namespace
	 * and a method name. These two things are sperated by @. Left
	 * part of @ is the class namespace and right part is the mehtod
	 * name.)
	 *
	 * @return object (An object of the router class.)
	 */
	public function put( $uri, $handler ) {
		$this->parse( $uri, $handler, 'PUT' );

		return $this;
	}

	/**
	 * A route with DELETE http verb will be parsed into a pre-defined
	 * format using parse method and it is a chain method.
	 *
	 * @param  string $uri
	 *
	 * @param  stirng $handler (This string contains a class namespace
	 * and a method name. These two things are sperated by @. Left
	 * part of @ is the class namespace and right part is the mehtod
	 * name.)
	 *
	 * @return object (An object of the router class.)
	 */
	public function delete( $uri, $handler ) {
		$this->parse( $uri, $handler, 'DELETE' );

		return $this;
	}

	/**
	 * A route with PATCH http verb will be parsed into a pre-defined
	 * format using parse method and it is a chain method.
	 *
	 * @param  string $uri
	 *
	 * @param  stirng $handler (This string contains a class namespace
	 * and a method name. These two things are sperated by @. Left
	 * part of @ is the class namespace and right part is the mehtod
	 * name.)
	 *
	 * @return object (An object of the router class.)
	 */
	public function patch( $uri, $handler ) {
		$this->parse( $uri, $handler, 'PATCH' );

		return $this;
	}

	/**
	 * Separation of different parts of strings that come to the route
	 * as parameters will be stored in the static variable routes.
	 *
	 * @param  string $uri
	 *
	 * @param  string $handler (This string contains a class namespace
	 * and a method name. These two things are sperated by @. Left
	 * part of @ is the class namespace and right part is the mehtod
	 * name.)
	 *
	 * @param  string $http_verb (GET, POST, PUT, DELETE, PATCH)
	 */
	private function parse( $uri, $handler, $http_verb ) {
		$uri_parser = new Uri_Parser();

		$handler = $uri_parser->class_method_separation( $handler );

		$controller = $uri_parser->get_controller( $handler[0] );
		$method     = $uri_parser->get_method( $controller, $handler[1] );

		static::$routes[] = [
			'http_verb'    => $http_verb,
			'original_uri' => $uri,
			'uri'          => $uri_parser->convert_to_wp_uri( $uri ),
			'controller'   => $controller,
			'method'       => $method,
			'permission'   => [],
			'validator'    => null,
			'sanitizer'    => null,
		];
	}

	/**
	 * Apply permissions to a route.
	 *
	 * @param  array  $permissions (Array of permission classes.)
	 *
	 * @return object (An object of the router class.)
	 */
	public function permission( $permissions = array() ) {
		$last_index = count( static::$routes ) - 1;

		static::$routes[$last_index]['permission'] = $permissions;

		return $this;
	}

	/**
	 * Apply validator to the request(WP_REST_Request) data entering
	 * into the app(plugin).
	 *
	 * @param  string $validator (Validator class namespace.)
	 *
	 * @return object (An object of the router class.)
	 */
	public function validator( $validator, $method = false ) {
		$last_index = count( static::$routes ) - 1;
		static::$routes[$last_index]['validator'] = $validator;

		return $this;
	}

	/**
	 * Apply sanitizer to the request(WP_REST_Request) data entering
	 * into the app(plugin).
	 *
	 * @param  string $sanitizer (Sanitizer class namespace.)
	 *
	 * @return object (An object of the router class.)
	 */
	public function sanitizer( $sanitizer ) {
		$last_index = count( static::$routes ) - 1;

		static::$routes[$last_index]['sanitizer'] = $sanitizer;

		return $this;
	}

	/**
	 * Get all the routes that are needed to registered as wp rest api.
	 *
	 * @return array (Static property of the class.)
	 */
	public static function get_routes() {
		return static::$routes;
	}
}