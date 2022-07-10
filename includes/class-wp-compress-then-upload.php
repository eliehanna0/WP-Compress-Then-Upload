<?php
/**
 * Bootstraps all plugin components.
 */
class WP_Compress_Then_Upload {
	/**
	 * Class variable that handles asset registration
	 *
	 * @var WPCTU_Assets
	 */
	private WPCTU_Assets $assets;

	/**
	 * Initializes all the plugin components
	 */
	public function init() {

		$this->assets = new WPCTU_Assets();

		$this->register_scripts();
		$this->add_admin_menu();
		WPCTU_Endpoints::register_endpoints();

	}

	/**
	 * Register React scripts
	 */
	private function register_scripts() {

		$this->assets->register_scripts();

	}



	/**
	 * Adds the plugin page under Media as a submenu
	 */
	public function add_admin_menu() {
		add_action(
			'admin_menu',
			function () {
				add_media_page( WPCTU_TITLE, WPCTU_TITLE, 'manage_options', 'wpctu', array( $this, 'admin_page' ) );

			}
		);
	}

	/**
	 * Creates a wrapper in which our React app will be deployed
	 */
	function admin_page() {
		$this->assets->enqueue();

		?>
		<div id="wpctu_root">
			Loading...
		</div>
		<?php
	}


}





