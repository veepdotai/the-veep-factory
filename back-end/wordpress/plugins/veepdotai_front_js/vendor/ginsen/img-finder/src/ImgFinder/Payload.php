<?php

declare(strict_types=1);

namespace ImgFinder;

class Payload
{
    public const AUTHOR     = 'author';
    public const URL_AUTHOR = 'url_author';
    public const MEDIA      = 'media';
    public const THUMBNAIL  = 'thumbnail';
    public const REPOSITORY = 'repository';


    private ?string $author;
    private ?string $urlAuthor;
    private string $media;
    private ?string $thumbnail;

    private string $repository;


    public static function build(
        string $repository,
        string $media,
        ?string $thumbnail,
        ?string $author = null,
        ?string $urlAuthor = null
    ): self
    {
        $instance = new static();

        $instance->repository = $repository;
        $instance->author     = $author;
        $instance->urlAuthor  = $urlAuthor;
        $instance->media      = $media;
        $instance->thumbnail  = $thumbnail;

        return $instance;
    }


    public function render(): iterable
    {
        return [
            self::AUTHOR     => $this->author,
            self::URL_AUTHOR => $this->urlAuthor,
            self::MEDIA      => $this->media,
            self::THUMBNAIL  => $this->thumbnail,
            self::REPOSITORY => $this->repository,
        ];
    }


    private function __construct()
    {
    }
}
