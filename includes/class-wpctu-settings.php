<?php
/**
 * Handles saving and loading plugin settings
 */

class  WPCTU_Settings {
	/**
	 * Identifier used to save and load plugin settings.
	 *
	 * @var string
	 */
	private string $option_index = WPCTU_PREFIX . '_settings';
	/**
	 * The default settings used by the front-end resizer.
	 *
	 * @var array|int[]
	 */
	private array $default_settings = array(
		'max_width'  => 10240,
		'max_height' => 10240,
		'quality'    => 80,
	);

	/**
	 * Used to Validate the values of the
	 * saved input.
	 */
	private array $boundaries = array(
		'max_width'  => array(
			'max' => 1024,
			'min' => 10,
		),
		'max_height' => array(
			'max' => 1024,
			'min' => 10,
		),
		'quality'    => array(
			'max' => 100,
			'min' => 10,
		),
	);


	/**
	 * The loaded settings used by the front-end resizer.
	 *
	 * @var array
	 */
	private array $settings = array();

	public function save( $new_settings = array() ) {
		foreach ( $new_settings as $index => $value ) {
			// make sure they are valid settings
			// make sure they are ints
			// make sure they are within min and max
			// only update new settings

		}
	}

	/**
	 * Retrieves settings
	 */
	public function get() {

		if ( empty( $this->settings ) ) {
			$this->load();
		}

		return $this->settings;
	}
	/**
	 * Loads settings from WP options
	 */
	public function load() {
		$loaded_settings = get_option( $this->option_index );
		$this->settings  = $loaded_settings ? $loaded_settings : $this->default_settings;
		return $this;
	}

	/**
	 * Reset settings to their default value
	 */
	public function reset() {
		delete_option( $this->option_index );
		$this->settings = $this->default_settings;
		return $this;
	}

}
