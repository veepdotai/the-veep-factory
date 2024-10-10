<?php

declare(strict_types=1);

namespace ImgFinder;

class Response implements ResponseInterface
{
    private array $payload;


    public static function fromUrls(array $payload): self
    {
        $instance          = new static();
        $instance->payload = $payload;

        return $instance;
    }


    public function merge(ResponseInterface $response): ResponseInterface
    {
        $items = $this->toArray();
        array_push($items, ...$response->toArray());

        return self::fromUrls($items);
    }


    public function toArray(): array
    {
        return $this->payload;
    }


    public function isEmpty(): bool
    {
        return empty($this->payload);
    }


    private function __construct()
    {
    }
}
