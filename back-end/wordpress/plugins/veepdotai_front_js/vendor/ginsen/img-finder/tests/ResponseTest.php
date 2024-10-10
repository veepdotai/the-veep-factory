<?php

declare(strict_types=1);

namespace Tests;

use ImgFinder\Response;
use ImgFinder\ResponseInterface;
use PHPUnit\Framework\TestCase;

class ResponseTest extends TestCase
{
    /**
     * @test
     */
    public function it_should_make_valid_instance()
    {
        $response = Response::fromUrls([]);

        self::assertInstanceOf(ResponseInterface::class, $response);
    }


    /**
     * @test
     */
    public function it_should_return_default_values()
    {
        $response = Response::fromUrls([]);

        self::assertSame([], $response->toArray());
    }


    /**
     * @test
     */
    public function it_should_merge_with_other_instance()
    {
        $response1 = Response::fromUrls([
            'http://tests.com',
            'http://tests.net',
        ]);

        $response2 = Response::fromUrls([
            'http://tests.org',
        ]);

        $response   = $response1->merge($response2);
        $collection = $response->toArray();

        self::assertCount(3, $collection);
        self::assertSame('http://tests.com', $collection[0]);
        self::assertSame('http://tests.net', $collection[1]);
        self::assertSame('http://tests.org', $collection[2]);
    }


    /**
     * @test
     */
    public function _it_should_return_if_is_empty_or_not()
    {
        $response1 = Response::fromUrls([]);
        $response2 = Response::fromUrls(['http://tests.org']);

        self::assertTrue($response1->isEmpty());
        self::assertFalse($response2->isEmpty());

        $response = $response1->merge($response2);

        self::assertFalse($response->isEmpty());
    }
}
