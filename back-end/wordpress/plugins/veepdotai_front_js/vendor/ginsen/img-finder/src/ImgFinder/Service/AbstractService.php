<?php

declare(strict_types=1);

namespace ImgFinder\Service;

use ImgFinder\Repository\ImgRepositoryInterface;
use ImgFinder\Translator\TranslatorInterface;
use Psr\Cache\CacheItemPoolInterface;
use ReflectionClass;

abstract class AbstractService
{
    /**
     * @throws
     */
    public static function makeInstance(string $class, iterable $params = []): TranslatorInterface|ImgRepositoryInterface
    {
        $reflection = new ReflectionClass($class);

        if (empty($params)) {
            return $reflection->newInstance();
        }

        return $reflection->newInstanceArgs($params);
    }


    public static function hasCache(?iterable $item, ?CacheItemPoolInterface $cache): bool
    {
        if (empty($cache)) {
            return false;
        }

        if (!empty($item) && !empty($item['no_cache'])) {
            return false;
        }

        return true;
    }
}
