<?php

declare(strict_types=1);

namespace Tests;

use ImgFinder\Config;
use ImgFinder\Service\RepositoryService;
use ImgFinder\Service\TranslatorService;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Yaml\Yaml;

class ConfigTest extends TestCase
{
    /**
     * @test
     */
    public function it_should_make_config_instance_from_yml_file()
    {
        $yaml   = __DIR__ . '/../doc/examples/config.yml';
        $config = Config::fromYaml($yaml);

        self::assertInstanceOf(Config::class, $config);
        self::assertInstanceOf(RepositoryService::class, $config->repository());
        self::assertInstanceOf(TranslatorService::class, $config->translator());
    }


    /**
     * @test
     */
    public function it_should_make_config_instance_from_array()
    {
        $yaml     = __DIR__ . '/../doc/examples/config.yml';
        $settings = Yaml::parseFile($yaml);
        $config   = Config::fromArray($settings);

        self::assertInstanceOf(Config::class, $config);
        self::assertInstanceOf(RepositoryService::class, $config->repository());
        self::assertInstanceOf(TranslatorService::class, $config->translator());
    }
}
