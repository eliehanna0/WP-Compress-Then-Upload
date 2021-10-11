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
		return true;
	}

	public function api_callback() {

		print_r( $_FILES );
		print_r( $_REQUEST );

		return new WP_REST_RESPONSE(
			array(
				'success' => true,
				'value'   => array(
					'bla' => 'blah',
					'blu' => 'bluh',
				),
			),
			200
		);
	}


	public static function register_endpoints() {
		$instance = new self();
		$instance->add_endpoints();

	}

	public  static  function get_rest_url( $endpoint ) {
		$instance = new self();
		return rest_url( $instance->get_api_namespace() . $endpoint );
	}

}
