# Compress & Upload

A WordPress plugin that allows uploading images that are resized and compressed client-side before getting sent to WordPress. This plugin was created to solve a common problem where customers struggle with large image uploads due to hosting provider file size limits.

## Why This Plugin?

Many WordPress users face frustrating upload failures when trying to add high-quality images to their sites. This often happens because:

- **Hosting provider limits**: Many shared hosting providers have strict file upload size limits (often 2-8MB)
- **Large image files**: Modern cameras and phones create images that are unnecessarily large for web use
- **Manual compression is time-consuming**: Users shouldn't need to manually compress every image before uploading
- **Server performance**: Client-side compression reduces server CPU usage and prevents crashes that can occur when processing large images on the server

This plugin solves these problems by automatically compressing and resizing images in the browser before upload, ensuring your images are web-ready while staying within your hosting provider's limits and keeping your server running smoothly.

## Demo
![wpctu_demo](https://user-images.githubusercontent.com/76950619/137004970-eca5ccda-a792-4e4f-9845-72b2309d08fe.gif)

## Installation
- Unzip the plugin in `/wp-content/plugins/`
- Install and activate the plugin by browsing `/wp-admin/plugins.php` 

## Usage
- Navigate to `Media -> Compress & Upload`
- Upload some files
- Enjoy!

## Development
- cd to `wp-content/plugins/compress-then-upload/front/`
- Run `npm install`
- Enable dev environment by setting `define( 'WPCTU_DEV_ENV', true );` in `wp-config.php`
- Run `npm run start:craco` to watch for changes and navigate to `/wp-admin/upload.php?page=wpctu`
- Run `npm run build:craco` to create production build


## Todo 
- Sequential image upload
- Add proper error handling for uploading images

## 

Feel free to contribute to this plugin!
