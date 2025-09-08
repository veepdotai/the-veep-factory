=== WP LinkedIn Auto Publish ===
Contributors: northernbeacheswebsites
Donate link: https://northernbeacheswebsites.com.au/product/donate-to-northern-beaches-websites/
Tags: linkedin, linkedin profile, linkedin company, linkedin companies, auto publish, autopublish, add link to linkedin, linkedin auto publish, social media auto publish, social network auto publish
Requires at least: 3.0.1
Tested up to: 6.4.3
Stable tag: 8.15
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

WP LinkedIn Auto Publish automatically publishes posts, custom posts and pages to your LinkedIn profile and/or company pages.

== Description ==

WP LinkedIn Auto Publish lets you publish posts, custom posts and pages automatically from WordPress to your personal LinkedIn profile and/or company pages that you are an administrator of. 

The plugin is simple, lightweight and free. It does have a couple of options which includes choosing who you want to share your LinkedIn posts with and whether you want to enable simple text-based sharing or more advanced sharing where you can tell LinkedIn to use your posts feature image. You can also setup a default share message format using time saving dynamic shortcodes for all your posts which you can over-ride on the post meta box settings. You can also filter items to be published based on categories selected on the plugin settings page. You can choose whether you want to share posts, custom posts and pages. You can select the default profile and/or companies you want to share with as well.

Every post will automatically be published to LinkedIn, however on each post there is a checkbox which enables you to not share a particular post. On a post page and on the all posts page you will also see a record of instances a post has been shared to LinkedIn.

= Announcing AutoSocial =

Please check out the pro version called AutoSocial which provides the same functionality as WP LinkedIn Auto Publish but adds Facebook, Google My Business, Twitter, Instagram and Pinterest. AutoSocial has many other cool features you will love as well! [Learn more](https://northernbeacheswebsites.com.au/autosocial/)



== Installation ==

There are a couple of methods for installing and setting up this plugin.

= Upload Manually =

1. Download and unzip the plugin
2. Upload the 'wp-linkedin-autopublish' folder into the '/wp-content/plugins/' directory
3. Go to the Plugins admin page and activate the plugin

= Install via the Admin Area =

1. In the admin area go to Plugins > Add New and search for "WP LinkedIn Auto Publish"
2. Click install and then click activate


== Frequently Asked Questions ==

Frequently asked questions can be found under the help tab on the plugin settings page. 

== Screenshots ==

1. Once you have installed the plugin, navigate to Settings > WP LinkedIn Auto Publish and with one click connect your account to your WordPress site!
2. Select the profile and/or companies you want to use with the plugin.
3. In the Sharing Options tab you can choose some additional sharing options.
4. On the Additional Options tab you can choose whether to hide the new post column and whether you want to share posts by default.
5. On every post page there will now be a new LinkedIn settings box where you can over-ride the default share message or choose to not to share the particular post with LinkedIn, or what profiles/companies you want to share with. If the post has been shared on LinkedIn it will also display a share history of the post.
6. On the all posts page there will be a new Shared on LinkedIn column which tells you which posts have been shared on LinkedIn or not and you can share instantly straight from that screen.
7. The plugin contains an FAQ on the settings page.



== Changelog ==

= 8.15 =
* Fix for LinkedIn versioning

= 8.14 =
* Fix for image sharing when hotlinking protection is turned on.

= 8.13 =
* Small bug fixes

= 8.12 =
* Security fix for deleting all plugin settings

= 8.11 =
* Fix for images

= 8.10 =
* Small PHP fixes

= 8.9 =
* Fix for pages

= 8.8 =
* Respect of original characters using littletext format

= 8.7 =
* Better parsing of share message before share to better comply with LinkedIn littetext format

= 8.6 =
* New and improved logging functionality so I can better diagnose errors with LinkedIn posts

= 8.5 =
* PHP error fix

= 8.4 =
* Bug fixes

= 8.3 =
* Fix to show title in link box

= 8.2 =
* Small bug fix for the name that is shown in the share log

= 8.1 =
* Small fix where it would say the post didn't share when it was actually successful

= 8.0 =
* Update to facilitate new version of LinkedIn API

= 7.14 =
* Minor PHP error fix

= 7.13 =
* Better error checking

= 7.12 =
* Compatibility Update

= 7.11 =
* Further bug fixes

= 7.10 =
* Better handling of excerpt

= 7.9 =
* Fixing of PHP error around test authentication

= 7.8 =
* Fixing of PHP errors

= 7.7 =
* Updated messaging for AutoSocial - now we post to Pinterest

= 7.6 =
* Updated messaging for AutoSocial - now we post to Instagram
* Updated character limit to 3000

= 7.5 =
* Additional data sent to LinkedIn upon share

= 7.4 =
* Updates to custom post types

= 7.3 =
* Support for more custom post types

= 7.2 =
* Fixed line break issue

= 7.1 =
* Restoration of don't share by default feature

= 7.0 =
* Updated to the latest version of the LinkedIn API - important after updating please re-authenticate the plugin

= 6.18 =
* Update to advanced mode so if you don't share an image the grey box won't appear
* Tested with WordPress 5.1.1

= 6.17 =
* Further bug fix

= 6.16 =
* Fixes test authentication bug
* Tested with WordPress 5

= 6.15 =
* Only shows re-authentication warning to admins

= 6.14 =
* Announcing AutoSocial our new premium version of WP LinkedIn Auto Publish

= 6.13 =
* Compatibility improvements with other NBW plugins

= 6.12 =
* Updates to messaging in plugin FAQ and testing with WordPress 4.9.8

= 6.11 =
* Image fix for some WordPress sites in advanced mode

= 6.10 =
* Unresolved issues from 6.8

= 6.9 =
* Unresolved issues from 6.8

= 6.8 =
* Small fix if someone doesn't have a LinkedIn company

= 6.7 =
* Bug fix

= 6.6 =
* Fixed compatibility issue with my other plugin WP Google My Business Auto Publish

= 6.5 =
* If you try and share a post with no profile selected we will now display an error message so you know the post hasn't been shared to LinkedIn and you need to select a profile

= 6.4 =
* More diagnostic information collection, better error reporting

= 6.3 =
* Fixed content length bug which was solved in version 5.10 but re-appeared somehow. This was causing some users authentication issues

= 6.2 =
* Update to redirect URL with better HTTPS/http determination

= 6.1 =
* Removed temporary error when authenticating for the first time

= 6.0 =
* A new authentication system so you don't need to create your own app anymore!
* You can now share to multiple companies and a profile at the same time and selectively choose what profile you want to share to!
* Heaps of bug fixes and code improvements

= 5.26 =
* now loads all styles/scripts locally

= 5.25 =
* new SSL mode to assist people with forced SSL backends - please see this new setting under additional options

= 5.24 =
* minor bug fix around admin notice message showing error

= 5.23 =
* issue with company selection not showing correctly in the plugin settings

= 5.22 =
* Better feedback in the plugin settings of the current authentication status of the plugin.

= 5.21 =
* A bug caused by LinkedIn is bringing back a share URL which doesn't work. This update resolves this so the link to your shared post actually works

= 5.20 =
* Fixed issue where it appeared as if there was an authentication error when there wasn't 

= 5.19 =
* Fixed issue with authorisation code not working due to version 5.18
* Better debugging or authorisation

= 5.18 =
* Removed HTTPS from the redirect URL displayed in the 'Authorisation Instructions' to show an HTTP address instead as LinkedIn wasn't accepting an HTTPS redirect URL.

= 5.17 =
* Added new option to not share posts by default in the plugin settings. Thanks Alexander.

= 5.16 =
* Fixed diagnostic error message

= 5.15 =
* Added diagnostic information to the help tab

= 5.14 =
* Added a loading message when clicking a button to prevent people double clicking a button. Thanks skinner009!

= 5.13 =
* Enabled the instant share options i.e. the LinkedIn meta box share button and the 'share now' link on post listings to share a post even though the category or post type has been blocked in the plugin settings. This enables you to over-ride default actions if necessary

= 5.12 =
* Made the plugin translatable and provided some translations

= 5.11 =
* Removed shortcodes and HTML tags from post content
* Fixed plural of day on admin notice

= 5.10 =
* Fixed authentication issue some users might have experienced due to LinkedIn requesting a content length in POST requests

= 5.9 =
* Fixed admin notice so it now tells you a more accurate message once the authentication has expired

= 5.8 =
* Fixed donation link

= 5.7 =
* Fixed the way the Redirect URI (which is used in the initial plugin setup/authorisation process) is created and deployed. Now if you change website addresses or go from an HTTP to an HTTPS website the redirect URI will be dynamically created instead of being saved in the plugin settings which was causing some headaches for people. Thanks to Jack Welch for the inspiration to do this fix
* Tested with WordPress version 4.7.4

= 5.6 =
* Limited share message to 700 characters to allow long posts to still be shared

= 5.5 =
* Resolved special characters showing incorrectly on advanced share message

= 5.4 =
* Resolved fully special characters showing incorrectly

= 5.3 =
* Fixes issue with website name and post title showing special characters incorrectly

= 5.2 =
* New getting started video which is viewable from the plugin settings

= 5.1 =
* Minor change to 'Share Now' button

= 5.0 =
* Implemented new 'Share Now' button on posts page meta box so posts can be shared without having to update/publish the page
* New smart AJAX post option saving which will give more predictable results when choosing to share, not share or change the custom message of a post
* Now the 'Share Now' button on the All Posts page will actually share the post to LinkedIn rather than taking you to the post edit page to then share the post to LinkedIn

= 4.2 =
* Made it easier to reshare previously published posts as you don't need to make them draft and then publish them again

= 4.1 =
* Fixes issue with custom post types being shared to LinkedIn

= 4.0 =
* Now works with scheduled posts
* New help tab to help people with common issues particular as to why posts aren't being shared on LinkedIn
* Tested with WordPress version 4.7.2

= 3.5 =
* Added notice regarding scheduled posts not working

= 3.4 =
* Fixed PHP warning if setting not set

= 3.3 =
* Removed 'Share With' option because when set to 'Connections Only' posts weren't being shared on LinkedIn - I couldn't find a solution to this so just removed the option

= 3.2 =
* Removed error message created by expiry message if the user hasn't saved settings yet

= 3.1 =
* Fix of advanced option share where the pulling of the title was triggering an error message
* Added quick settings link on plugin page

= 3.0 =
* Now you can share custom post types and pages - check out the new setting in the sharing options tab

= 2.8 =
* There are now more more shortcodes to use for the default share message which include the posts excerpt, content, author and the website title

= 2.7 =
* Fixed numbering error

= 2.6 =
* Updated screenshots

= 2.5 =
* Now displays whether a post has been shared with LinkedIn or not on the main posts listing - this can be turned off with a new setting as well

= 2.4 =
* Improved logic so that once a post has been sent to LinkedIn the post will default to not sending the post again if updated
* Added a share history section at the bottom of the meta box on the posts page so you can see if the post has been sent to linkedin before

= 2.3 =
* Added clipboard functionality to make it easier to copy redirect url
* Added admin warning when access token is about to expire

= 2.2 =
* Updated links and messaging

= 2.1 =
* Updated file names

= 2.0 =
* Reconfigured plugin setting arrangement to follow WordPress best practice
* Updated settings interface

= 1.1 =
* You can now choose particular categories not to share on LinkedIn

= 1.0 =
* Initial launch of the plugin
