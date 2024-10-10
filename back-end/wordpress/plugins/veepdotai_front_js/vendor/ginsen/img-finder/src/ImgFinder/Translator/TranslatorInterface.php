<?php

declare(strict_types=1);

namespace ImgFinder\Translator;

use ImgFinder\RequestInterface;

interface TranslatorInterface
{
    public function name(): string;

    public function findWord(RequestInterface $request): RequestInterface;
}
