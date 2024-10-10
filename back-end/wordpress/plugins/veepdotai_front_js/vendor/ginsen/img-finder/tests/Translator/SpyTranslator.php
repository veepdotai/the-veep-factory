<?php

declare(strict_types=1);

namespace Tests\Translator;

use ImgFinder\RequestInterface;
use ImgFinder\Translator\TranslatorInterface;

class SpyTranslator implements TranslatorInterface
{
    private const NAME = 'spy-translator';


    public function name(): string
    {
        return self::NAME;
    }


    public function findWord(RequestInterface $request): RequestInterface
    {
        return $request;
    }
}
