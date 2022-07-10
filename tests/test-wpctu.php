<?php

class WPCTU_Test extends WP_Test_REST_TestCase {



	static $routes;
	static $namespace;

	public static function wpSetUpBeforeClass() {
		self::$routes    = array( '/upload', '/settings' );
		self::$namespace = '/wpctu-api/v1';

	}

	private function get_rest_url( $endpoint ) {
		return self::$namespace . $endpoint;
	}

	private function log_user_in() {
		$user_id = get_users()[0]->ID;
		wp_clear_auth_cookie();
		wp_set_current_user( $user_id );
		wp_set_auth_cookie( $user_id );
	}

	public function test_routes_are_registered() {
		$routes = rest_get_server()->get_routes();
		foreach ( self::$routes as $endpoint ) {
			$route = self::$namespace . $endpoint;
			$this->assertArrayHasKey( $route, $routes );
		}

	}
	public function test_upload_image() {
		$request = new WP_REST_Request( 'POST', $this->get_rest_url( '/upload' ) );
		$request->set_header( 'Content-Type', 'multipart/form-data' );
		/*
		 * Non-logged in user uploads image.
		 */
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_forbidden', $response, 401 );

		/*
		 * Logged in user
		 */
		$this->log_user_in();
		$request->set_header( 'Content-Type', 'multipart/form-data' );
		$test_file = __DIR__ . '\img\test_image.jpg';

		$request->set_file_params(
			array(
				'file' => array(
					'file'     => file_get_contents( $test_file ),
					'name'     => 'test_image.jpg',
					'size'     => filesize( $test_file ),
					'tmp_name' => $test_file,
					'error'    => false,
				),
			)
		);
		$response = rest_get_server()->dispatch( $request );
		$status   = $response->get_status();
		$this->assertEquals( 200, $status );

	}


	public function test_settings_update_correctly() {

		/*
		 * First test if a non-logged in user can change setting
		 */
		$request = new WP_REST_Request( 'PUT', $this->get_rest_url( '/settings' ) );

		$response = rest_get_server()->dispatch( $request );

		$status = $response->get_status();
		$this->assertEquals( 401, $status, 'Users not logged in should not be able to change settings' );

		/**
		 * Now lets login the user and see if they can update the settings
		 */
		$this->log_user_in();

		$settings         = new WPCTU_Settings();
		$current_settings = $settings->get();

		$request->set_header( 'content-type', 'application/json' );
		$new_settings = array(
			'max_width'  => 1080,
			'max_height' => 1080,
			'quality'    => 100,
		);
		$request->set_body( json_encode( $new_settings ) );

		$response = rest_get_server()->dispatch( $request );

		$status = $response->get_status();
		$this->assertEquals( 200, $status );

		$body              = $response->get_data();
		$response_settings = $body['data'];

		$this->assertNotEquals( $current_settings, $response_settings );
	}

}
