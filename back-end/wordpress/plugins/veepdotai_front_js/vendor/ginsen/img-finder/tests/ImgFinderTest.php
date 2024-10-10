<?php

declare(strict_types=1);

namespace Tests;

use ImgFinder\Config;
use ImgFinder\ImgFinder;
use ImgFinder\Request;
use ImgFinder\Response;
use ImgFinder\ResponseInterface;
use ImgFinder\Service\RepositoryService;
use ImgFinder\Service\TranslatorService;
use Mockery as m;
use PHPUnit\Framework\TestCase;

class ImgFinderTest extends TestCase
{
    /**
     * @test
     */
    public function it_should_make_valid_instance()
    {
        $config = $this->getConfig();
        $finder = new ImgFinder($config);

        self::assertInstanceOf(ImgFinder::class, $finder);
    }


    /**
     * @test
     */
    public function it_should_search_images()
    {
        $config = $this->getConfig();
        $finder = new ImgFinder($config);

        $request  = Request::set('cuidados bebé', ['testRepo']);
        $response = $finder->search($request);

        self::assertInstanceOf(ResponseInterface::class, $response);
    }


    /**
     * @test
     */
    public function it_should_return_repository_names()
    {
        $yaml   = __DIR__ . '/../doc/examples/config.yml';
        $config = Config::fromYaml($yaml);
        $finder = new ImgFinder($config);

        self::assertSame(['spy-repository'], $finder->repositories());
    }


    public function getConfig(): Config
    {
        $config     = m::mock(Config::class);
        $translator = $this->translatorService();
        $repository = $this->repository();

        $config->shouldReceive('translator')->andReturn($translator);
        $config->shouldReceive('repository')->andReturn($repository);

        return $config;
    }


    public function translatorService(): TranslatorService
    {
        $translator = m::mock(TranslatorService::class);
        $translator
            ->shouldReceive('translate')
            ->andReturn(
                Request::set('translate request', ['testRepo'])
            );

        return $translator;
    }



    public function repository(): RepositoryService
    {
        $repository = m::mock(RepositoryService::class);
        $repository->shouldReceive('findImages')->andReturn(Response::fromUrls([]));

        return $repository;
    }
}
