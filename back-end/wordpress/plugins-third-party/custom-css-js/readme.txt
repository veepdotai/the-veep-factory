=== Simple Custom CSS and JS ===
Created: 06/12/2015
Contributors: diana_burduja
Email: diana@burduja.eu
Tags: custom CSS, custom JS, site css, add style, customize theme 
Requires at least: 3.0.1
Tested up to: 6.7 
Stable tag: 3.50
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html
Requires PHP: 5.2.4

Easily add Custom CSS or JS to your website with an awesome editor.

== Description ==

Customize your WordPress site's appearance by easily adding custom CSS and JS code without even having to modify your theme or plugin files. This is perfect for adding custom CSS tweaks to your site. 

= Features =
* **Text editor** with syntax highlighting 
* Print the code **inline** or included into an **external file**
* Print the code in the **header** or the **footer**
* Add CSS or JS to the **frontend** or the **admin side**
* Add as many codes as you want
* Keep your changes also when you change the theme

== Installation ==

* From the WP admin panel, click "Plugins" -> "Add new".
* In the browser input box, type "Simple Custom CSS and JS".
* Select the "Simple Custom CSS and JS" plugin and click "Install".
* Activate the plugin.

OR...

* Download the plugin from this page.
* Save the .zip file to a location on your computer.
* Open the WP admin panel, and click "Plugins" -> "Add new".
* Click "upload".. then browse to the .zip file downloaded from this page.
* Click "Install".. and then "Activate plugin".

OR...

* Download the plugin from this page.
* Extract the .zip file to a location on your computer.
* Use either FTP or your hosts cPanel to gain access to your website file directories.
* Browse to the `wp-content/plugins` directory.
* Upload the extracted `custom-css-js` folder to this directory location.
* Open the WP admin panel.. click the "Plugins" page.. and click "Activate" under the newly added "Simple Custom CSS and JS" plugin.

== Frequently Asked Questions ==

= What if I want to add multiple external CSS codes? =
If you write multiple codes of the same type (for example: two external CSS codes), then all of them will be printed one after another

= Will this plugin affect the loading time? =
When you click the `Save` button the codes will be cached in files, so there are no tedious database queries.

= Does the plugin modify the code I write in the editor? =
No, the code is printed exactly as in the editor. It is not modified/checked/validated in any way. You take the full responsability for what is written in there.

= My code doesn't show on the website =
Try one of the following:
1. If you are using any caching plugin (like "W3 Total Cache" or "WP Fastest Cache"), then don't forget to delete the cache before seing the code printed on the website.
2. Make sure the code is in **Published** state (not **Draft** or **in Trash**).
3. Check if the `wp-content/uploads/custom-css-js` folder exists and is writable

= Does it work with a Multisite Network? =
Yes.

= What if I change the theme? =
The CSS and JS are independent of the theme and they will persist through a theme change. This is particularly useful if you apply CSS and JS for modifying a plugin's output. 

= Can I use a CSS preprocesor like LESS or Sass? =
For the moment only plain CSS is supported, but you can check out the [Pro version](https://www.silkypress.com/simple-custom-css-js-pro/?utm_source=wordpress&utm_campaign=ccj_free&utm_medium=banner) in case you need a CSS preprocessor.

= Can I upload images for use with my CSS? =
Yes. You can upload an image to your Media Library, then refer to it by its direct URL from within the CSS stylesheet. For example:
`div#content {
    background-image: url('http://example.com/wp-content/uploads/2015/12/image.jpg');
}`

= Can I use CSS rules like @import and @font-face? =
Yes.

= Who can publish/edit/delete Custom Codes? =
By default only the Administrator will be able to publish/edit/delete Custom Codes. On the plugin activation there is a role created called Web Designer. You can assign this role to a non-admin user in order to allow to publish/edit/delete Custom Codes. On the plugin's Settings page there is an option to remove this role. 

= My website has HTTPS urls, but the codes are linked as HTTP =
The URL for the linked Codes is built just like the URL for other media (from Media Library) by using the WordPress Address option found on the WP Admin -> Settings -> General page, as shown in [this screenshot](https://www.silkypress.com/wp-content/uploads/2016/12/ccj-siteurl.png). If the WordPress Address has HTTPS in the url, then the Custom Codes and all the other media will have HTTPS in the url. 


== Screenshots ==

1. Manage Custom Codes

2. Add/Edit Javascript

3. Add/Edit CSS

4. Add/Edit HTML 

== Changelog ==

= 3.50 =
* 02/17/2025
* Fix: the editor doesn't show up under certain conditions 
* Fix: don't show the code excerpts in the list table, if the "Extended View" option is enabled for posts or pages

= 3.49 =
* 11/13/2024
* Fix: add nuance for the "in Block editor" option for websites with WP before v6.6 and after

= 3.48 =
* 09/24/2024
* Feature: add JS/CSS custom codes to the Block editor

= 3.47 =
* 05/27/2024
* Fix: use the GMT time for showing when a custom code was published or modified

= 3.46 =
* 01/31/2024
* Tweak: update the Bootstrap and jQuery library links 
* Tweak: remove the qTranslate-x warning. The qTranslate-x plugin was removed from wp.org since Aug 2021

= 3.45 =
* 10/17/2023
* Fix: enqueue the jQuery library only if there is a frontend JS custom code that requires it 

= 3.44 =
* 06/07/2023
* Compatibility with the WooCommerce "custom order tables" feature

= 3.43 =
* 03/13/2023
* Fix: PHP8.1 deprecation notices
* Fix: after adding a JS/HTML custom code with empty content will show the CSS default message in the editor

= 3.42 =
* 01/17/2023
* Fix: the "LH Archived Post Status" plugin was removing the "Publish" button on the add/edit custom code page
* Feature: multiple values for the "Where in site" option

[See changelog for all versions](https://plugins.svn.wordpress.org/custom-css-js/trunk/changelog.txt).
