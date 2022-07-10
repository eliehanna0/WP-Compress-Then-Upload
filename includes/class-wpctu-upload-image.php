<?php

/**
 * Class WPCTU_Upload_Image
 *
 * Handles images uploads and saves them into the WP media library.
 */
class  WPCTU_Upload_Image {

	private $files = array();
	private $request;

	/**
	 * WPCTU_Upload_Image constructor.
	 * Validates and handles images submission.
	 *
	 * @throws Exception Error message produced by missing or invalid file.
	 */
	function __construct($request) {
		$this->request =$request;
		$this->set_files();
		$this->validate_files();
		$this->upload_files();

	}

	/**
	 * Assigns $_FILES to class variable.
	 */
	private function set_files() {
		$this->files = $this->request->get_file_params();
	}

	/**
	 * Verify if files are valid
	 *
	 * @throws Exception Error message produced by missing or invalid file.
	 */
	private function validate_files() {

		$file = isset( $this->files['file'] ) ? $this->files['file'] : array();
		if ( empty( $file ) ) {
			throw new Exception( 'Invalid or empty file' );
		}

		if ( $file['error'] ) {
			throw new Exception( 'File error' );
		}

		if ( $file['size'] > wp_max_upload_size() ) {
			throw new Exception( 'This file is too big' );
		}

		$new_file_mime = mime_content_type( $file['tmp_name'] );

		if ( ! in_array( $new_file_mime, get_allowed_mime_types(), true ) ) {
			throw new Exception( 'This file format is not allowed' );
		}

	}

	/**
	 * Loops through each of the submitted files uploads them then adds each one
	 * of them as attachments.
	 */
	private function upload_files() {
		$file = $this->files['file'];

		$gallery = array();

		$wordpress_upload_dir = wp_upload_dir();
		$i                    = 1; // number of tries when the file with the same name is already exists.
		$new_file_path        = $wordpress_upload_dir['path'] . '/' . $file['name'];
		while ( file_exists( $new_file_path ) ) {
			$i++;
			$new_file_path = $wordpress_upload_dir['path'] . '/' . $i . '_' . $file['name'];

		}

		$new_file_mime = mime_content_type( $file['tmp_name'] );

		if ( move_uploaded_file( $file['tmp_name'], $new_file_path ) ) {
			$upload_id = wp_insert_attachment(
				array(
					'guid'           => $new_file_path,
					'post_mime_type' => $new_file_mime,
					'post_title'     => preg_replace( '/\.[^.]+$/', '', $file['name'] ),
					'post_content'   => '',
					'post_status'    => 'inherit',
				),
				$new_file_path
			);

			require_once( ABSPATH . 'wp-admin/includes/image.php' );

			// Generate and save the attachment metas into the database.
			wp_update_attachment_metadata( $upload_id, wp_generate_attachment_metadata( $upload_id, $new_file_path ) );
			$gallery[] = $upload_id;
		}

	}
}
