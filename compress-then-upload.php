<?php
/**
 * Plugin Name: Compress Then Upload
 * Plugin URI: https://github.com/eliehanna0/WP-Compress-Then-Upload
 * Description: An image uploader that resizes and compresses images before getting uploaded.
 * Version: 1.0.2
 * Author: Elie Hanna
 * Author URI: https://elie.gatolabs.com
 * Tested up to: 6.2
 **/

require 'includes/class-wp-compress-then-upload.php';
require 'includes/class-wpctu-assets.php';
require 'includes/class-wpctu-endpoints.php';
require 'includes/class-wpctu-upload-image.php';
require 'includes/class-wpctu-settings.php';

define( 'WPCTU_PREFIX', 'wpctu_' );
define( 'WPCTU_TITLE', 'Compress Then Upload' );
define( 'WPCTU_URL', plugin_dir_url( __FILE__ ) );


/**
 * Initializes plugin
 */
function init_plugin() {

	$plugin = new WP_Compress_Then_Upload();
	$plugin->init();

}


add_action( 'init', 'init_plugin' );





