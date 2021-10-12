<?php


class  WPCTU_Upload_Image {

	private $files = array();
	function __construct() {
		$this->set_files();
		$this->validate_files();
		$this->upload_files();

	}

	private function set_files() {
		$this->files = $_FILES;
	}

	/**
	 * @throws Exception
	 */
	private function validate_files() {

		$file = $this->files['file'];
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

		if ( ! in_array( $new_file_mime, get_allowed_mime_types() ) ) {
			throw new Exception( 'This file format is not allowed' );
		}

	}

	private function upload_files() {
		$file = $this->files['file'];

		$gallery = array();

		$wordpress_upload_dir = wp_upload_dir();
		$i                    = 1; // number of tries when the file with the same name is already exists
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

		return true;

	}
}
