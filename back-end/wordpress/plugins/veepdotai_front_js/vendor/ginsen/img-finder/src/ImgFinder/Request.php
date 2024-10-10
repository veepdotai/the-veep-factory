<?php

declare(strict_types=1);

namespace ImgFinder;

use Cocur\Slugify\Slugify;

class Request implements RequestInterface
{
    private string $words;
    private int $page;
    private int $perPage;
    private string $orientation;
    private int $widthSmall;
    private array $repositories;
    private Slugify $slugify;


    public static function set(
        string $words,
        array $repositories,
        int $page = 1,
        int $perPage = 10,
        string $orientation = 'landscape',
        int $widthSmall = 320
    ): RequestInterface {
        $instance = new static();

        $instance->words        = $words;
        $instance->page         = $page;
        $instance->perPage      = $perPage;
        $instance->orientation  = $orientation;
        $instance->widthSmall   = $widthSmall;
        $instance->repositories = $repositories;

        return $instance;
    }


    public function setWords(string $words): RequestInterface
    {
        return self::set(
            $words,
            $this->repositories(),
            $this->page(),
            $this->perPage(),
            $this->orientation(),
            $this->widthSmall()
        );
    }


    public function setRepositories(array $repositories): RequestInterface
    {
        return self::set(
            $this->words(),
            $repositories,
            $this->page(),
            $this->perPage(),
            $this->orientation(),
            $this->widthSmall()
        );
    }


    public function setPage(int $page): RequestInterface
    {
        return self::set(
            $this->words(),
            $this->repositories(),
            $page,
            $this->perPage(),
            $this->orientation(),
            $this->widthSmall()
        );
    }


    public function setPerPage(int $perPage): RequestInterface
    {
        return self::set(
            $this->words(),
            $this->repositories(),
            $this->page(),
            $perPage,
            $this->orientation(),
            $this->widthSmall()
        );
    }


    public function setOrientation(string $orientation): RequestInterface
    {
        return self::set(
            $this->words(),
            $this->repositories(),
            $this->page(),
            $this->perPage(),
            $orientation,
            $this->widthSmall()
        );
    }


    public function setWidthSmall(int $width): RequestInterface
    {
        return self::set(
            $this->words(),
            $this->repositories(),
            $this->page(),
            $this->perPage(),
            $this->orientation(),
            $width,
        );
    }


    public function words(): string
    {
        return $this->words;
    }


    public function urlWords(): string
    {
        return urlencode($this->words);
    }


    public function slugWords(): string
    {
        return $this->slugify->slugify($this->words);
    }


    public function repositories(): array
    {
        return $this->repositories;
    }


    public function page(): int
    {
        return $this->page;
    }


    public function perPage(): int
    {
        return $this->perPage;
    }


    public function orientation(): string
    {
        return $this->orientation;
    }


    public function widthSmall(): int
    {
        return $this->widthSmall;
    }


    public function isEqual(RequestInterface $request): bool
    {
        return $this === $request;
    }


    public function cacheKey(): string
    {
        return sprintf(
            '%s-%d-%d-%s-%d',
            $this->orientation(),
            $this->perPage(),
            $this->widthSmall(),
            $this->slugWords(),
            $this->page()
        );
    }


    private function __construct()
    {
        $this->repositories = [];
        $this->slugify    = new Slugify();
    }
}
