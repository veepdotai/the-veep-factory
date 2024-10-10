<?php

declare(strict_types=1);

namespace ImgFinder;

interface ResponseInterface
{
    public function merge(self $response): self;

    public function toArray(): array;

    public function isEmpty(): bool;
}
