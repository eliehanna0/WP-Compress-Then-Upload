<?php

/**
 * Registers and handles API requests
 */
class WPCTU_Endpoints {

	private $namespace = 'wpctu-api/';

	private $version = 'v1';

	/**
	 * Generates plugin's namespace
	 *
	 * @return string
	 */
	public function get_api_namespace() {
		return $this->namespace . $this->version;
	}

	/**
	 * Registers /upload route
	 */
	public function add_endpoints() {

		register_rest_route(
			$this->get_api_namespace(),
			'/upload',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'api_upload_images' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);

		register_rest_route(
			$this->get_api_namespace(),
			'/settings',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'api_update_settings' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);
	}

	/**
	 * This methods makes sure that the user is logged in and
	 * has enough permission to upload images.
	 *
	 * @return bool
	 */
	public function check_permission() {

		if ( current_user_can( 'manage_options' ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Handles image upload responses.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function api_upload_images( $request ) {
		try {
			new WPCTU_Upload_Image( $request );

			return new WP_REST_RESPONSE(
				array(
					'success' => true,
					'data'    => array(),
				),
				200
			);

		} catch ( Exception $e ) {
			return new WP_Error( 'wpctu_error', $e->getMessage(), array( 'status' => 400 ) );

		}

	}

	/**
	 * Handles updating settings
	 *
	 * @param WP_REST_Request $request Rest API Request object.
	 *
	 * @return WP_Error|WP_REST_RESPONSE
	 */
	public function api_update_settings( $request ) {
		try {

			$settings         = new WPCTU_Settings();
			$updated_settings = $settings->save( $request->get_json_params() );

			return new WP_REST_RESPONSE(
				array(
					'success' => true,
					'data'    => $updated_settings,
				),
				200
			);

		} catch ( Exception $e ) {
			return new WP_Error( 'wpctu_error', $e->getMessage(), array( 'status' => 400 ) );
		}

	}

	/**
	 * Bootstrap endpoint registration.
	 */
	public static function register_endpoints() {
		$instance = new self();
		add_action( 'rest_api_init', array( $instance, 'add_endpoints' ) );

	}

	/**
	 * Returns the full rest url of a given endpoint.
	 *
	 * @param string $endpoint Endpoint name.
	 *
	 * @return string
	 */
	public  static  function get_rest_url( $endpoint ) {
		$instance = new self();
		return rest_url( $instance->get_api_namespace() . $endpoint );
	}

}
