<?php

/**
 *
 */
class WPCTU_Assets {

	/**
	 * @var string
	 */
	private $dev_path = 'http://localhost:3000/wp-content/plugins/wp-compress-then-upload';

	/**
	 * @var string
	 */
	private $front_path = '/front/build/static';

	/**
	 * Register relative scripts depending on the environment
	 */
	public function register_scripts() {
		if ( $this->is_dev_env() ) {

			$this->register_dev_scripts();

		} else {
			$this->register_prod_scripts();
		}
	}

	/**
	 * Checks if we are on the development environment
	 *
	 * @return bool
	 */
	private function is_dev_env(): bool {
		return in_array( $_SERVER['REMOTE_ADDR'], array( '127.0.0.1', '::1' ), true );
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
		return plugins_url( $this->front_path . $file, __FILE__ );
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
		wp_register_style( WPCTU_PREFIX . 'react_css', plugins_url( $this->get_prod_file_path( '/css/main.css' ), __FILE__ ) );
	}

	/**
	 * Enqueue react scripts
	 */
	public function enqueue() {
		wp_enqueue_script( WPCTU_PREFIX . 'react_js', '1.0', true );
		wp_enqueue_style( WPCTU_PREFIX . 'react_css' );
	}
}
