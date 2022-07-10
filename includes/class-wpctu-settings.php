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
		'max_width'  => 1024,
		'max_height' => 1024,
		'quality'    => 80,
	);
	/**
	 * Used to Validate the values of the
	 * saved input.
	 *
	 * @var array|int[][]
	 */
	private array $boundaries = array(
		'max_width'  => array(
			'max' => 10240,
			'min' => 10,
		),
		'max_height' => array(
			'max' => 10240,
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

	/**
	 * Saves new settings after validating them.
	 *
	 * @param array $new_settings Array of new settings.
	 *
	 * @return array New Settings
	 * @throws Exception Invalid setting name or out of bound value exception.
	 */
	public function save( array $new_settings = array() ) {
		$settings = $this->get();
		foreach ( $new_settings as $setting => $value ) {
			if ( ! $this->is_valid_setting( $setting ) ) {
				throw new Exception( "Setting {$setting} is not a valid setting", 0 );
			}

			$value = intval( $value );

			if ( $this->setting_has_valid_value( $setting, $value ) ) {
				$settings[ $setting ] = $value;
			} else {
				$max_value = $this->boundaries[ $setting ]['max'];
				$min_value = $this->boundaries[ $setting ]['min'];
				throw new Exception( "{$setting} values must be between {$min_value} & {$max_value}", 0 );
			}
		}

		$this->settings = $settings;
		update_option( $this->option_index, $this->settings );
		return $this->settings;
	}

	/**
	 * Checks if we are about to save a valid setting by checking it exists in
	 * the default_settings array.
	 *
	 * @param string $setting Name of setting to check.
	 *
	 * @return bool
	 */
	private function is_valid_setting( $setting ) {
		return $setting && in_array( $setting, array_keys( $this->default_settings ), true );
	}

	/**
	 * We want to make sure that we are not saving any values
	 * out of our defined range in $boundaries.
	 *
	 * @param string $setting Setting name to check.
	 * @param int    $value Setting value.
	 *
	 * @return bool
	 */
	private function setting_has_valid_value( $setting, $value ) {
		$boundaries = $this->boundaries[ $setting ];
		if ( $value < $boundaries['min'] || $value > $boundaries['max'] ) {
			return false;
		}

		return true;

	}

	/**
	 * Retrieves settings
	 */
	public function get(): array {

		if ( empty( $this->settings ) ) {
			$this->load();
		}

		return $this->settings;
	}
	/**
	 * Loads settings from WP options
	 */
	public function load(): WPCTU_Settings {
		$loaded_settings = get_option( $this->option_index );
		$this->settings  = $loaded_settings ? $loaded_settings : $this->default_settings;
		return $this;
	}

	/**
	 * Reset settings to their default value
	 */
	public function reset(): WPCTU_Settings {
		delete_option( $this->option_index );
		$this->settings = $this->default_settings;
		return $this;
	}

}
