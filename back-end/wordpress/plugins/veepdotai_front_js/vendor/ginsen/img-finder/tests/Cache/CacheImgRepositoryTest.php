<?php

declare(strict_types=1);

namespace Tests\Cache;

use ImgFinder\Cache\CacheImgRepository;
use ImgFinder\Repository\ImgRepositoryInterface;
use ImgFinder\Request;
use ImgFinder\Response;
use ImgFinder\ResponseInterface;
use Mockery as m;
use PHPUnit\Framework\TestCase;
use Psr\Cache\CacheItemInterface;
use Psr\Cache\CacheItemPoolInterface;

class CacheImgRepositoryTest extends TestCase
{
    /**
     * @test
     */
    public function it_should_find_images_without_cache_and_response_empty()
    {
        $item    = $this->getItemCache();
        $cache   = $this->getCachePool($item);
        $imgRepo = $this->getImgRepository();

        $imgRepoCache = new CacheImgRepository($cache, $imgRepo);
        $request      = Request::set('hello world', ['testRepo']);
        $response     = $imgRepoCache->findImages($request);

        self::assertInstanceOf(ResponseInterface::class, $response);
        self::assertTrue($response->isEmpty());
    }


    /**
     * @test
     */
    public function it_should_find_images_without_cache_and_response_urls()
    {
        $urls    = ['http://some.tests'];
        $item    = $this->getItemCache();
        $cache   = $this->getCachePool($item);
        $imgRepo = $this->getImgRepository($urls);

        $imgRepoCache = new CacheImgRepository($cache, $imgRepo);
        $request      = Request::set('hello world', ['testRepo']);
        $response     = $imgRepoCache->findImages($request);

        self::assertInstanceOf(ResponseInterface::class, $response);
        self::assertFalse($response->isEmpty());
    }


    /**
     * @test
     */
    public function it_should_find_images_from_cache()
    {
        $urls     = ['http://some.tests'];
        $response = Response::fromUrls($urls);
        $item     = $this->getItemCache($response);
        $cache    = $this->getCachePool($item);
        $imgRepo  = $this->getImgRepository($urls);

        $imgRepoCache = new CacheImgRepository($cache, $imgRepo);
        $request      = Request::set('hello world', ['testRepo']);

        self::assertInstanceOf(ResponseInterface::class, $imgRepoCache->findImages($request));
    }


    /**
     * @param ResponseInterface|null $resp
     * @return CacheItemInterface
     */
    private function getItemCache(ResponseInterface $resp = null): CacheItemInterface
    {
        $item = m::mock(CacheItemInterface::class);

        $item->shouldReceive('isHit')->andReturn(!empty($resp));
        $item->shouldReceive('set')->andReturnNull();
        $item->shouldReceive('expiresAfter')->andReturnNull();
        $item->shouldReceive('get')->andReturn(serialize($resp));

        return $item;
    }


    /**
     * @param CacheItemInterface $item
     * @return CacheItemPoolInterface
     */
    public function getCachePool(CacheItemInterface $item): CacheItemPoolInterface
    {
        $cache = m::mock(CacheItemPoolInterface::class);

        $cache->shouldReceive('getItem')->andReturn($item);
        $cache->shouldReceive('save')->andReturnNull();

        return $cache;
    }


    /**
     * @param iterable $urls
     * @return ImgRepositoryInterface
     */
    public function getImgRepository(iterable $urls = []): ImgRepositoryInterface
    {
        $imgRepo = m::mock(ImgRepositoryInterface::class);

        $imgRepo->shouldReceive('name')->andReturn('testRepo');
        $imgRepo->shouldReceive('findImages')->andReturn(Response::fromUrls($urls));

        return $imgRepo;
    }
}
