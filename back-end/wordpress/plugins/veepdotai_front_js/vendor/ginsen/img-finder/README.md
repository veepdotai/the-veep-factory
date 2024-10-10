# img-finder

[![Latest Stable Version](https://poser.pugx.org/ginsen/img-finder/v/stable.svg)](https://packagist.org/packages/ginsen/img-finder)
[![Latest Unstable Version](https://poser.pugx.org/ginsen/img-finder/v/unstable.svg)](https://packagist.org/packages/ginsen/img-finder)
[![License](https://poser.pugx.org/ginsen/img-finder/license.svg)](https://packagist.org/packages/ginsen/img-finder)

PHP Library to find images in several public repositories 

## Install

```bash
$ composer require ginsen/img-finder
```

## Config file

### With YAML format

Create a configuration file in yaml format, `img-finder.yml`, with the following content:

```yaml
img-finder:
    repositories:
        ImgFinder\Repository\PexelsRepository:
            params:
                authorization: your-authorization  # Visit https://www.pexels.com/es-es/api/new/
        
        ImgFinder\Repository\UnsplashRepository:
            params:
                authorization: your-authorization  # Visit https://unsplash.com/developers

    # Optional
    translators:
        ImgFinder\Translator\DictionaryYaml:
            no_cache: true
            params:
                filename: img-finder/doc/examples/yaml_dictionary.yml

        ImgFinder\Translator\GoogleTranslate:
            params:
                apikey: your-credentials
                from: es
                to: en
```

### With PHP format

Create config file with PHP is very similar at YAML, create php file format, as below.

```php
<?php

use ImgFinder\Repository\PexelsRepository;
use ImgFinder\Repository\UnsplashRepository;
use ImgFinder\Translator\DictionaryYaml;
use ImgFinder\Translator\GoogleTranslate;

$settings = [
    'img-finder' => [
        'repositories' => [
            PexelsRepository::class => [
                'params' => [
                    'authorization' => 'your-authorization'  # Visit https://www.pexels.com/es-es/api/new/
                ]
            ],
            UnsplashRepository::class => [
                'params' => [
                    'authorization' => 'your-authorization'  # Visit https://unsplash.com/developers
                ]
            ]
        ],
        'translators' => [
            DictionaryYaml::class => [
                'no_cache' => true,
                'params'   => [
                    'filename' => 'img-finder/doc/examples/yaml_dictionary.yml'
                ]
            ],
            GoogleTranslate::class => [
                'params' => [
                    'apikey' => 'your-credentials',
                    'from'   => 'es',
                    'to'     => 'en'
                ]
            ]
        ]
    ]
];
```

And replace your credentials for use your contract services and delete the repositories that do not have 
credentials for their use.

If you do not have credentials to use *GoogleTranslate* remove this translator service, **the dictionary does not need
credentials**, you can configure it to translate the search terms you want to English, such as a tag cloud. Note that 
**the dictionary is not useful for free text searches**.

## Use

### With YAML format
Create a config instance with the created yml file, and inject it into **the main ImgFinder class**.

```php
$file = '/your/path/img-finder.yml';

$config = ImgFinder\Config::fromYaml($file);
$finder = new ImgFinder\ImgFinder($config);
```

### With PHP format

With the PHP config file it is done as follows.

```php
use ImgFinder\Repository\PexelsRepository;

$settings = [
    'img-finder' => [
        'repositories' => [
            PexelsRepository::class => [
                'params' => [
                    'authorization' => 'your-authorization'  # Visit https://www.pexels.com/es-es/api/new/
                ]
            ],
        ],
        // ...
    ]
    //...
];

$config = ImgFinder\Config::fromArray($settings);
$finder = new ImgFinder\ImgFinder($config);
```

## Ready

**ImgFinder** is now available to query image repositories, just it only necessary to create a request.

### Request in Pexels & Unsplash repositories

```php
// Search in pexels ad unsplash repositories
$request = ImgFinder\Request::set('nature', ['pexels', 'unsplash']);

// same as:
/**
 * @param string      $words        The search term
 * @param array       $repositories The used repositories
 * @param int         $page         Page number
 * @param int         $perPage      Items per page
 * @param string      $orientation  Orientation: 'landscape' or 'portrait', default: 'landscape'
 * @param int         $widthSmall   Width of small photos, default 320 pixels
 */
$request = ImgFinder\Request::set('nature', ['pexels', 'unsplash'], 1, 10, 'landscape', 320);
```
Both requests are the same, **"nature"** is the search term, **1** is the default page, **10** is the number of response
images for each repository, **"landscape"** is the orientation ('landscape' or 'portrait'), and finally **320** is the 
width for thumbnails.

### Request to search only in one repository

```php
// Search in pexels repository
$request = ImgFinder\Request::set('nature', ['pexels']);
// same as:
$request = ImgFinder\Request::set('nature', ['pexels'], 1, 10, 'landscape', 320);
```

### Search

Finally, you only need to perform the search.

```php
$response = $finder->search($request);
```

This is the whole code of the entire operation.

```php
use ImgFinder\Config;
use ImgFinder\ImgFinder;
use ImgFinder\Request;

$file = '/your/path/img-finder.yml';

$config = Config::fromYaml($file);
$finder = new ImgFinder($config);

$request  = Request::set('nature', ['pexels', 'unsplash']);
$response = $finder->search($request);

$imagesUrls = $response->toArray();

echo json_encode($imagesUrls);
/**
 * [  
 *    {  
 *       "author":     "Rodolfo Quirós",
 *       "url_author": "https://www.pexels.com/@rquiros",
 *       "media":      "https://images.pexels.com/photos/2219118/pexels-photo-2219118.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
 *       "thumbnail":  "https://images.pexels.com/photos/2219118/pexels-photo-2219118.jpeg?auto=compress&cs=tinysrgb&h=350&w=320",
 *       "repository": "pexels"
 *    },{
 *       "author":     "Igor Starkov",
 *       "url_author": "https://unsplash.com/@igorstarkoff",
 *       "media":      "https://images.unsplash.com/photo-1595706480968-ca87913ee9c7?ixid=MXwxODk0OTN8MHwxfHNlYXJjaHwxMHx8YmVhdXR5JTIwZmFjZXxlbnwwfDB8fA&ixlib=rb-1.2.1",
 *       "thumbnail":  "https://images.unsplash.com/photo-1595706480968-ca87913ee9c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxODk0OTN8MHwxfHNlYXJjaHwxMHx8YmVhdXR5JTIwZmFjZXxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=320",
 *       "repository": "unsplash"
 *    },
 *    ....
 * ]
 */
```

## Show all public repositories

To show all available repositories.

```php
...

$finder = new ImgFinder($config);
$finder->repositories();

/**
 array:10 [
  0 => "pexels"
  1 => "unsplash"
 ]
 */

```

## Cache optional

If you wish, you can cache requests to improve performance and not stress the image repositories.

For example, if you use the `symfony/cache` component you can inject it into the initial configuration.

Example:

```bash
$ composer require symfony/cache
```

Create **Redis** cache service.

```php
use ImgFinder\Config;
use Symfony\Component\Cache\Adapter\RedisAdapter;

$redisConn = RedisAdapter::createConnection('redis://my.server.com:6379');
$cache     = new RedisAdapter($redisConn, 'imgfinder', 60);

$file   = '/your/path/img-finder.yml';
$config = Config::fromYaml($file, $cache);
```
