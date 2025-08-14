<?php

/**
 * Class WPCTU_Upload_Image
 *
 * Handles images uploads and saves them into the WP media library.
 */
class WPCTU_Upload_Image
{
	private $files = array();
	private $request;
	private $allowed_image_types = array(
		'jpg',
		'jpeg',
		'png',
		'gif',
		'webp',
		'bmp',
		'tiff',
		'tif'
	);
	private $sanitized_filename = '';

	/**
	 * WPCTU_Upload_Image constructor.
	 * Validates and handles images submission.
	 *
	 * @throws Exception Error message produced by missing or invalid file.
	 */
	function __construct($request)
	{
		$this->request = $request;
		$this->set_files();
		$this->validate_files();
		$this->upload_files();
	}

	/**
	 * Assigns $_FILES to class variable.
	 */
	private function set_files()
	{
		$this->files = $this->request->get_file_params();
	}

	/**
	 * Verify if files are valid
	 *
	 * @throws Exception Error message produced by missing or invalid file.
	 */
	private function validate_files()
	{
		$file = isset($this->files['file']) ? $this->files['file'] : array();
		if (empty($file)) {
			throw new Exception('Invalid or empty file');
		}

		if ($file['error']) {
			throw new Exception('File error');
		}

		if ($file['size'] > wp_max_upload_size()) {
			throw new Exception('This file is too big');
		}

		//Validate file extension first
		$file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
		if (! in_array($file_extension, $this->allowed_image_types, true)) {
			throw new Exception('File extension not allowed. Only image files are permitted.');
		}

		//Validate MIME type from file content (not from headers)
		$real_mime_type = mime_content_type($file['tmp_name']);
		if (! $real_mime_type || ! str_starts_with($real_mime_type, 'image/')) {
			throw new Exception('Invalid file type. Only image files are permitted.');
		}

		//Additional validation using WordPress functions
		$wp_filetype = wp_check_filetype_and_ext($file['tmp_name'], $file['name']);
		if (! $wp_filetype['type'] || ! str_starts_with($wp_filetype['type'], 'image/')) {
			throw new Exception('File type validation failed. Only image files are permitted.');
		}

		//Verify the file is actually a valid image by checking image dimensions
		$image_info = getimagesize($file['tmp_name']);
		if (! $image_info || ! isset($image_info[0], $image_info[1]) || $image_info[0] <= 0 || $image_info[1] <= 0) {
			throw new Exception('Invalid image file. Unable to determine image dimensions.');
		}

		//Check if the MIME type matches the file extension
		$expected_mime = $this->get_mime_type_from_extension($file_extension);
		if ($expected_mime && $real_mime_type !== $expected_mime) {
			throw new Exception('File type mismatch. File extension does not match content type.');
		}

		//Additional check against WordPress allowed mime types
		if (! in_array($real_mime_type, get_allowed_mime_types(), true)) {
			throw new Exception('This file format is not allowed');
		}

		// Store sanitized filename for use in upload_files method
		$this->sanitized_filename = $this->sanitize_filename($file['name']);
	}

	/**
	 * Get expected MIME type from file extension
	 *
	 * @param string $extension File extension
	 * @return string|false Expected MIME type or false if not found
	 */
	private function get_mime_type_from_extension($extension)
	{
		$mime_types = array(
			'jpg'  => 'image/jpeg',
			'jpeg' => 'image/jpeg',
			'png'  => 'image/png',
			'gif'  => 'image/gif',
			'webp' => 'image/webp',
			'bmp'  => 'image/bmp',
			'tiff' => 'image/tiff',
			'tif'  => 'image/tiff',
		);

		return isset($mime_types[$extension]) ? $mime_types[$extension] : false;
	}

	/**
	 * Sanitize filename to prevent path traversal and injection attacks
	 *
	 * @param string $filename Original filename
	 * @return string Sanitized filename
	 */
	private function sanitize_filename($filename)
	{
		// Remove any path components
		$filename = basename($filename);

		// Remove any null bytes
		$filename = str_replace(chr(0), '', $filename);

		// Remove any directory traversal attempts
		$filename = str_replace(array('../', '..\\', './', '.\\'), '', $filename);

		// Ensure only alphanumeric, dots, hyphens, and underscores
		$filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);

		// Prevent double extensions
		$filename = preg_replace('/\.(php|php3|php4|php5|phtml|pl|py|jsp|asp|sh|cgi|htaccess|htpasswd|ini|log|sql|fla|psd|sh|bat|cmd|com|exe|dll|vbs|jar|js|vb|ws|wsf|wsc|wsh|msc|scr|reg|pif|lnk|url|js|vbs|ws|wsf|wsc|wsh|msc|scr|reg|pif|lnk|url)$/i', '', $filename);

		return $filename;
	}

	/**
	 * Loops through each of the submitted files uploads them then adds each one
	 * of them as attachments using WordPress built-in functions.
	 */
	private function upload_files()
	{
		$file = $this->files['file'];
		$gallery = array();

		$wordpress_upload_dir = wp_upload_dir();
		$i                    = 1; // number of tries when the file with the same name is already exists.

		// Security: Sanitize the filename before using it
		$sanitized_filename = $this->sanitized_filename;
		$new_file_path        = $wordpress_upload_dir['path'] . '/' . $sanitized_filename;

		while (file_exists($new_file_path)) {
			$i++;
			$new_file_path = $wordpress_upload_dir['path'] . '/' . $i . '_' . $sanitized_filename;
		}

		$new_file_mime = mime_content_type($file['tmp_name']);

		if (move_uploaded_file($file['tmp_name'], $new_file_path)) {
			$upload_id = wp_insert_attachment(
				array(
					'guid'           => $new_file_path,
					'post_mime_type' => $new_file_mime,
					'post_title'     => preg_replace('/\.[^.]+$/', '', $sanitized_filename),
					'post_content'   => '',
					'post_status'    => 'inherit',
				),
				$new_file_path
			);

			require_once(ABSPATH . 'wp-admin/includes/image.php');

			// Generate and save the attachment metas into the database.
			wp_update_attachment_metadata($upload_id, wp_generate_attachment_metadata($upload_id, $new_file_path));
			$gallery[] = $upload_id;
		}
	}
}
