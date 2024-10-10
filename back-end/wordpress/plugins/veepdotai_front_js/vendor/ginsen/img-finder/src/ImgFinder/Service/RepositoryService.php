<?php

declare(strict_types=1);

namespace ImgFinder\Service;

use ImgFinder\Cache\CacheImgRepository;
use ImgFinder\Repository\ImgRepositoryInterface;
use ImgFinder\RequestInterface;
use ImgFinder\Response;
use ImgFinder\ResponseInterface;
use Psr\Cache\CacheItemPoolInterface;

class RepositoryService extends AbstractService
{
    /** @var ImgRepositoryInterface[] */
    private array $repositories;


    public static function init(iterable $repositories, ?CacheItemPoolInterface $cache): self
    {
        $instance = new static();

        foreach ($repositories as $class => $item) {
            $params  = !empty($item['params']) ? $item['params'] : [];
            $imgRepo = self::makeInstance($class, $params);
            $imgRepo = self::hasCache($item, $cache) ? new CacheImgRepository($cache, $imgRepo) : $imgRepo;

            $instance->repositories[$imgRepo->name()] = $imgRepo;
        }

        return $instance;
    }


    public function names(): iterable
    {
        return array_keys($this->repositories);
    }


    public function findImages(RequestInterface $request): ResponseInterface
    {
        $response = Response::fromUrls([]);

        foreach ($this->repositories as $imgRepo) {
            if (in_array($imgRepo->name(), $request->repositories())) {
                $newResp  = $imgRepo->findImages($request);
                $response = $response->merge($newResp);
            }
        }

        return $response;
    }


    private function __construct()
    {
    }
}
