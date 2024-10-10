<?php

declare(strict_types=1);

namespace ImgFinder\Cache;

use ImgFinder\RequestInterface;

abstract class AbstractCache
{
    public const ONE_DAY = 'P1D';


    public function getCacheKey(RequestInterface $request): string
    {
        return sprintf('%s-%s', $this->name(), $request->cacheKey());
    }
}
