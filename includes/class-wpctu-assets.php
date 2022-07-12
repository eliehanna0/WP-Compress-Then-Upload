<?php
/**
 * Takes care of importing all JS and CSS needed for the app to function
 */
class WPCTU_Assets {

	/**
	 * Development path to app files
	 *
	 * @var string
	 */
	private string $dev_path = 'http://localhost:3000/wp-content/plugins/compress-then-upload/';

	/**
	 * The top level directory in which assets are going to be loaded from.
	 *
	 * @var string
	 */
	private string $front_path = 'front/build/static';

	/**
	 * Register relative scripts depending on the environment
	 */
	public function register_scripts() {
		if ( $this->is_dev_env() ) {
			$this->register_dev_scripts();
		} else {
			$this->register_prod_scripts();
		}

		$this->localize_scripts();
	}

	/**
	 * Checks if we are on the development environment
	 *
	 * @return bool
	 */
	private function is_dev_env(): bool {

		if ( defined( 'WPCTU_DEV_ENV' ) ) {
			return WPCTU_DEV_ENV;
		}

		return false;

	}

	/**
	 * Returns the relative development path of React
	 *
	 * @param string $file
	 *
	 * @return string
	 */
	private function get_dev_file_path( $file = '' ) {
		return $this->dev_path . $this->front_path . $file;
	}

	/**
	 * Returns the relative production path of React
	 *
	 * @param string $file
	 *
	 * @return string
	 */
	private function get_prod_file_path( $file = '' ) {

		return WPCTU_URL . $this->front_path . $file;
	}

	/**
	 * Register dev react scripts
	 */
	private function register_dev_scripts() {
		wp_register_script(
			WPCTU_PREFIX . 'react_js',
			$this->get_dev_file_path( '/js/main.js' )
		);
	}

	/**
	 * Register production react scripts
	 */
	private function register_prod_scripts() {
		wp_register_script( WPCTU_PREFIX . 'react_js', $this->get_prod_file_path( '/js/main.js' ) );
		wp_register_style( WPCTU_PREFIX . 'react_css', $this->get_prod_file_path( '/css/main.css' ) );
	}

	/**
	 * Enqueue react scripts
	 */
	public function enqueue() {
		wp_enqueue_script( WPCTU_PREFIX . 'react_js', '1.0', true );
		wp_enqueue_style( WPCTU_PREFIX . 'react_css' );
	}

	/**
	 * Allows our app to use the API securely, and transports settings to
	 * front-end.
	 */
	private function localize_scripts() {
		$settings = new WPCTU_Settings();
		wp_localize_script(
			WPCTU_PREFIX . 'react_js',
			WPCTU_PREFIX . 'ajax',
			array(
				'urls'     => array(
					'baseURL' => WPCTU_Endpoints::get_rest_url( '' ),
					'upload'  => WPCTU_Endpoints::get_rest_url( '/upload' ),
				),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
				'settings' => $settings->get(),
			)
		);
	}
}
