<?php

declare(strict_types=1);

namespace ImgFinder\Translator;

use ImgFinder\Exception\DictionaryException;
use ImgFinder\RequestInterface;
use Symfony\Component\Translation\Loader\YamlFileLoader;
use Symfony\Component\Translation\Translator;

class DictionaryYaml implements TranslatorInterface
{
    private const NAME = 'dictionary-yml';

    private Translator $dictionary;


    public function __construct(string $filename)
    {
        if (!is_readable($filename)) {
            throw new DictionaryException('dictionary file not found');
        }

        $this->dictionary = $this->loadTranslator($filename);
    }


    public function name(): string
    {
        return self::NAME;
    }


    public function findWord(RequestInterface $request): RequestInterface
    {
        $wordTrans = $this->dictionary->trans($request->words());

        if ($wordTrans === $request->words()) {
            return $request;
        }

        return $request->setWords($wordTrans);
    }


    /**
     * @param string $filename
     * @return Translator
     */
    private function loadTranslator(string $filename): Translator
    {
        $translator = new Translator('es');

        $translator->addLoader('yaml', new YamlFileLoader());
        $translator->addResource('yaml', $filename, 'en');
        $translator->setFallbackLocales(['en']);

        return $translator;
    }
}
