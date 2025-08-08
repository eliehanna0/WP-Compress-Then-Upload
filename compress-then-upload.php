<?php
/**
 * Plugin Name: Compress & Upload
 * Plugin URI: https://github.com/eliehanna0/WP-Compress-Then-Upload
 * Description: Compress & Upload images | Automatic Image Optimization
 * Version: 1.0.3
 * Author: Elie Hanna
 * Author URI: https://elie.gatolabs.com
 * Tested up to: 6.7.1
 **/

require 'includes/class-wp-compress-then-upload.php';
require 'includes/class-wpctu-assets.php';
require 'includes/class-wpctu-endpoints.php';
require 'includes/class-wpctu-upload-image.php';
require 'includes/class-wpctu-settings.php';

define( 'WPCTU_PREFIX', 'wpctu_' );
define( 'WPCTU_TITLE', 'Compress & Upload' );
define( 'WPCTU_URL', plugin_dir_url( __FILE__ ) );


/**
 * Initializes plugin
 */
function init_plugin() {

	$plugin = new WP_Compress_Then_Upload();
	$plugin->init();

}


add_action( 'init', 'init_plugin' );





