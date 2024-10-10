<?php

declare(strict_types=1);

namespace Tests;

use ImgFinder\Request;
use ImgFinder\RequestInterface;
use PHPUnit\Framework\TestCase;

class RequestTest extends TestCase
{
    /**
     * @test
     */
    public function it_should_make_valid_instance()
    {
        $request = Request::set('tests', ['testRepo']);

        self::assertInstanceOf(RequestInterface::class, $request);
    }


    /**
     * @test
     */
    public function it_should_return_default_values()
    {
        $request = Request::set('tests', ['testRepo']);

        self::assertSame('tests', $request->words());
        self::assertSame(1, $request->page());
        self::assertSame(10, $request->perPage());
        self::assertSame('landscape', $request->orientation());
        self::assertSame(320, $request->widthSmall());
    }


    /**
     * @test
     */
    public function it_should_allow_set_values()
    {
        $request1 = Request::set('tests', ['testRepo']);
        $request2 = $request1->setWords('other phrase');
        $request3 = $request2->setPage(2);
        $request4 = $request3->setPerPage(11);
        $request5 = $request4->setOrientation('portrait');
        $request6 = $request4->setWidthSmall(333);

        self::assertSame('tests', $request1->words());
        self::assertSame('other phrase', $request2->words());

        self::assertSame(1, $request2->page());
        self::assertSame(2, $request3->page());

        self::assertSame(10, $request3->perPage());
        self::assertSame(11, $request4->perPage());

        self::assertSame('landscape', $request4->orientation());
        self::assertSame('portrait', $request5->orientation());

        self::assertSame(320, $request5->widthSmall());
        self::assertSame(333, $request6->widthSmall());
    }


    /**
     * @test
     */
    public function it_should_compare_equals_instances()
    {
        $request1 = Request::set('tests', ['testRepo']);
        $request2 = Request::set('tests', ['testRepo']);

        self::assertFalse($request1->isEqual($request2));
        self::assertTrue($request1->isEqual($request1));
        self::assertTrue($request2->isEqual($request2));
    }


    /**
     * @test
     */
    public function it_should_return_words_in_several_formats()
    {
        $request = Request::set('protección crema solar!', ['testRepo']);

        self::assertSame('protección crema solar!', $request->words());
        self::assertSame('protecci%C3%B3n+crema+solar%21', $request->urlWords());
        self::assertSame('proteccion-crema-solar', $request->slugWords());
    }


    /**
     * @test
     */
    public function it_should_return_cache_key_in_slug_format()
    {
        $request = Request::set('tests', ['testRepo']);

        self::assertSame('landscape-10-320-tests-1', $request->cacheKey());
    }
}
