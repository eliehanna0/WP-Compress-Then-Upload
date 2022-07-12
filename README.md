# WP Compress Then Upload

A plugin that allows uploading images that are resized and compressed client side before getting sent to the WordPress.


## Demo
![wpctu_demo](https://user-images.githubusercontent.com/76950619/137004970-eca5ccda-a792-4e4f-9845-72b2309d08fe.gif)

## Installation
- Unzip the plugin in `/wp-content/plugins/`
- Install and activate the plugin by browsing `/wp-admin/plugins.php` 

## Usage
- Navigate to `Media -> Compress then Upload`
- Upload some files
- Enjoy!

## Development
- cd to `wp-content/plugins/wp-compress-then-upload/front/`
- Run `npm install`
- Enable dev environment by setting `define( 'WPCTU_DEV_ENV', true );` in `wp-config.php`
- Run `npm run start:craco` to watch for changes and navigate to `/wp-admin/upload.php?page=wpctu`
- Run `npm run build:craco` to create production build


## Todo 
- Sequencial image upload
- Add proper error handling for uploading images

## 

Feel free to contribute to this plugin!
