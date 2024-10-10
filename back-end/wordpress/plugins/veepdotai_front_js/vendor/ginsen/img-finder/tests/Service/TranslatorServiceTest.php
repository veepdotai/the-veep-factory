<?php

declare(strict_types=1);

namespace Tests\Service;

use ImgFinder\Request;
use ImgFinder\Service\TranslatorService;
use Mockery as m;
use PHPUnit\Framework\TestCase;
use Psr\Cache\CacheItemPoolInterface;

class TranslatorServiceTest extends TestCase
{
    /**
     * @test
     */
    public function it_should_init_instance()
    {
        $service = $this->makeService();

        self::assertInstanceOf(TranslatorService::class, $service);
    }

    /**
     * @test
     */
    public function it_should_init_instance_with_cache()
    {
        $cache   = m::mock(CacheItemPoolInterface::class);
        $service = $this->makeService($cache);

        self::assertInstanceOf(TranslatorService::class, $service);
    }


    /**
     * @test
     */
    public function it_should_return_request_when_find_translator()
    {
        $service    = $this->makeService();
        $request    = Request::set('test', ['testRepo']);
        $newRequest = $service->translate($request);

        self::assertTrue($request->isEqual($newRequest));
    }



    public function makeService(?CacheItemPoolInterface $cache = null): TranslatorService
    {
        $repos = [
            'Tests\Translator\SpyTranslator' => [
                'no_cache' => true,
            ],
        ];

        return TranslatorService::init($repos, $cache);
    }
}
