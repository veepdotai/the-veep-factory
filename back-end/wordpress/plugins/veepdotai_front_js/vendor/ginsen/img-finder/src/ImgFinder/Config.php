<?php

declare(strict_types=1);

namespace ImgFinder;

use ImgFinder\Service\RepositoryService;
use ImgFinder\Service\TranslatorService;
use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Yaml\Yaml;

class Config
{
    public const MAIN         = 'img-finder';
    public const REPOSITORIES = 'repositories';
    public const TRANSLATORS  = 'translators';

    private TranslatorService $translatorService;
    private RepositoryService $repositoryService;


    public static function fromYaml(string $filename, CacheItemPoolInterface $cache = null): self
    {
        $config = Yaml::parseFile($filename);

        return self::boostrap($config, $cache);
    }


    public static function fromArray(iterable $arr, CacheItemPoolInterface $cache = null): self
    {
        return self::boostrap($arr, $cache);
    }


    private static function boostrap(iterable $config, ?CacheItemPoolInterface $cache): self
    {
        $conf = $config[self::MAIN];

        $instance = new static();

        $translators  = !empty($conf[self::TRANSLATORS]) ? $conf[self::TRANSLATORS] : [];
        $repositories = !empty($conf[self::REPOSITORIES]) ? $conf[self::REPOSITORIES] : [];

        $instance->translatorService = TranslatorService::init($translators, $cache);
        $instance->repositoryService = RepositoryService::init($repositories, $cache);

        return $instance;
    }


    public function translator(): TranslatorService
    {
        return $this->translatorService;
    }


    public function repository(): RepositoryService
    {
        return $this->repositoryService;
    }


    private function __construct()
    {
    }
}
