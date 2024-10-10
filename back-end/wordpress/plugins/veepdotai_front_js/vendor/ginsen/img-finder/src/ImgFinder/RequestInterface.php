<?php

declare(strict_types=1);

namespace ImgFinder;

interface RequestInterface
{
    /**
     * @param string      $words        The search term
     * @param string[]    $repositories The repositories to use
     * @param int         $page         Page number
     * @param int         $perPage      Items per page
     * @param string      $orientation  Orientation: 'landscape' or 'portrait', default: 'landscape'
     * @param int         $widthSmall   Width of small photos, default 320 pixels
     * @return static
     */
    public static function set(
        string $words,
        array $repositories,
        int $page = 1,
        int $perPage = 10,
        string $orientation = 'landscape',
        int $widthSmall = 320
    ): self;

    public function setWords(string $words): self;

    public function words(): string;

    public function urlWords(): string;

    public function slugWords(): string;

    public function setRepositories(array $repositories): self;

    public function repositories(): array;

    public function setPage(int $page): self;

    public function page(): int;

    public function setPerPage(int $perPage): self;

    public function perPage(): int;

    public function setOrientation(string $orientation): self;

    public function orientation(): string;

    public function setWidthSmall(int $width): self;

    public function widthSmall(): int;

    public function isEqual(self $request): bool;

    public function cacheKey(): string;
}
