<?php

declare(strict_types=1);

namespace Tests;

use ImgFinder\Payload;
use PHPUnit\Framework\TestCase;

class PayloadTest extends TestCase
{
    /**
     * @test
     */
    public function it_should_make_valid_instance()
    {
        $payload = Payload::build(
            'test',
            'https://image',
            'https://thumbnail',
            'foo',
            'https://foo.io'
        );

        self::assertInstanceOf(Payload::class, $payload);
    }


    /**
     * @test
     */
    public function it_should_render_to_array()
    {
        $payload = Payload::build(
            'test',
            'https://image',
            'https://thumbnail',
            'foo',
            'https://foo'
        );

        $data = $payload->render();

        self::assertIsArray($data);
        self::assertSame('foo', $data[Payload::AUTHOR]);
        self::assertSame('https://foo', $data[Payload::URL_AUTHOR]);
        self::assertSame('https://image', $data[Payload::MEDIA]);
        self::assertSame('https://thumbnail', $data[Payload::THUMBNAIL]);
    }
}
