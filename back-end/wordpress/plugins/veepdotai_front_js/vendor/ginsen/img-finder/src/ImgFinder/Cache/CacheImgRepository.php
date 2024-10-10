<?php

declare(strict_types=1);

namespace ImgFinder\Cache;

use DateInterval;
use ImgFinder\Repository\ImgRepositoryInterface;
use ImgFinder\RequestInterface;
use ImgFinder\ResponseInterface;
use Psr\Cache\CacheItemPoolInterface;

class CacheImgRepository extends AbstractCache implements ImgRepositoryInterface
{
    public function __construct(
        private CacheItemPoolInterface $cache,
        private ImgRepositoryInterface $imgRepo
    ) {
    }


    public function name(): string
    {
        return $this->imgRepo->name();
    }


    /**
     * @throws
     */
    public function findImages(RequestInterface $request): ResponseInterface
    {
        $key  = $this->getCacheKey($request);
        $item = $this->cache->getItem($key);

        if ($item->isHit()) {
            return unserialize($item->get());
        }

        $response = $this->imgRepo->findImages($request);

        if ($response->isEmpty()) {
            return $response;
        }

        $item->set(serialize($response));
        $item->expiresAfter(new DateInterval(self::ONE_DAY));
        $this->cache->save($item);

        return $response;
    }
}
