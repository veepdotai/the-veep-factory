<?php

declare(strict_types=1);

namespace ImgFinder\Service;

use ImgFinder\Cache\CacheTranslator;
use ImgFinder\RequestInterface;
use ImgFinder\Translator\TranslatorInterface;
use Psr\Cache\CacheItemPoolInterface;

class TranslatorService extends AbstractService
{
    /** @var TranslatorInterface[] */
    private array $translators = [];


    public static function init(iterable $translators, ?CacheItemPoolInterface $cache): self
    {
        $instance = new static();

        foreach ($translators as $class => $item) {
            $params     = !empty($item['params']) ? $item['params'] : [];
            $translator = self::makeInstance($class, $params);
            $translator = self::hasCache($item, $cache) ? new CacheTranslator($cache, $translator) : $translator;

            $instance->translators[] = $translator;
        }

        return $instance;
    }


    public function translate(RequestInterface $request): RequestInterface
    {
        foreach ($this->translators as $translator) {
            $newRequest = $translator->findWord($request);
            if (!$newRequest->isEqual($request)) {
                return $newRequest;
            }
        }

        return $request;
    }


    private function __construct()
    {
    }
}
