<?php

declare(strict_types=1);

namespace ImgFinder\Cache;

use DateInterval;
use ImgFinder\RequestInterface;
use ImgFinder\Translator\TranslatorInterface;
use Psr\Cache\CacheItemPoolInterface;

class CacheTranslator extends AbstractCache implements TranslatorInterface
{
    public function __construct(
        private CacheItemPoolInterface $cache,
        private TranslatorInterface $translator
    ) {
    }


    public function name(): string
    {
        return $this->translator->name();
    }


    /**
     * @throws
     */
    public function findWord(RequestInterface $request): RequestInterface
    {
        $key  = $this->getCacheKey($request);
        $item = $this->cache->getItem($key);

        if ($item->isHit()) {
            $requestCache = unserialize($item->get());

            return $requestCache->setRepositories($request->repositories());
        }

        $newRequest = $this->translator->findWord($request);
        if ($newRequest->isEqual($request)) {
            return $request;
        }

        $item->set(serialize($newRequest));
        $item->expiresAfter(new DateInterval(self::ONE_DAY));
        $this->cache->save($item);

        return $newRequest;
    }
}
