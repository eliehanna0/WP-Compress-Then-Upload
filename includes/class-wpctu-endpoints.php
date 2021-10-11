<?php


class WPCTU_Endpoints {

	private $namespace = 'wpctu-api/';
	private $version   = 'v1';



	public function get_api_namespace() {
		return $this->namespace . $this->version;
	}
	public function add_endpoints() {

		register_rest_route(
			$this->get_api_namespace(),
			'/upload',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'api_callback' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);
	}

	public function check_permission() {

		if ( current_user_can( 'manage_options' ) ) {
			return true;
		}

		return false;
	}

	public function api_callback() {
		try {
			new WPCTU_Upload_Image();

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


	public static function register_endpoints() {
		$instance = new self();
		add_action( 'rest_api_init', array( $instance, 'add_endpoints' ) );

	}

	public  static  function get_rest_url( $endpoint ) {
		$instance = new self();
		return rest_url( $instance->get_api_namespace() . $endpoint );
	}

}
